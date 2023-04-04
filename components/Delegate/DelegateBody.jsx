import { get } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, gql } from '@apollo/client';
import {
  Button, Card, Radio, Typography,
} from 'antd/lib';
import axios from 'axios';
import { getWeb3Details } from 'common-util/Contracts';
import { notifyError, notifySuccess } from 'common-util/functions';
import {
  SERVICE_ENDPOINT,
  SUPPORTED_CHAIN_IDS,
  SUPPORTED_GOVERNORS_ADDRESSES,
  DELEGATEE_ADDRESS,
  ACCEPTED_GOVERNOR_TYPES,
} from 'util/constants';

const { Text, Title } = Typography;

const QUERY = gql`
  query Governors($chainIds: [ChainID!], $addresses: [AccountID!]) {
    governors(chainIds: $chainIds, ids: $addresses) {
      id
      type
      name
      slug
      tokens {
        address
        name
        symbol
        type
      }
    }
  }
`;

const getTokenContractAbi = async (tokenAddress) => {
  const etherscanApiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`;

  try {
    const response = await axios.get(etherscanApiUrl);

    if (response.status !== 200 || response.status !== 201) {
      throw new Error(
        `Error retrieving token contract ABI: Status ${response.status}`,
      );
    }

    const stringedTokenContractAbi = response.data.result;
    if (!stringedTokenContractAbi) {
      throw new Error('Token contract ABI is empty');
    }
    return JSON.parse(stringedTokenContractAbi);
  } catch (e) {
    console.error('Error retrieving token contract ABI:', e);
    throw new Error('Error retrieving token contract ABI');
  }
};

const getFullTokenContractAbi = async (subTokenAddress) => {
  const stringedTokenContractAbi = await getTokenContractAbi(subTokenAddress);
  return stringedTokenContractAbi;
};

const createTokenContract = (tokenContractAbi) => {
  const { web3 } = getWeb3Details();

  // Check if tokenContractAbi is not empty
  if (tokenContractAbi) {
    return new web3.eth.Contract(tokenContractAbi);
  }
  throw new Error('Token contract ABI is empty');
};

export default function DelegateBody() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenContractAbi, setTokenContractAbi] = useState('');
  const [votingPreference, setVotingPreference] = useState('evil');
  const [delegating, setDelegating] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [governorAddress, setGovernorAddress] = useState('');
  const [governors, setGovernors] = useState([]);
  const [tokenBalance, setTokenBalance] = useState('');

  const account = useSelector((state) => get(state, 'setup.account'));

  const handleQueryCompleted = async (data) => {
    // eslint-disable-next-line max-len
    const governorBravoGovernors = data.governors.filter((governor) => ACCEPTED_GOVERNOR_TYPES.includes(governor.type));

    setAvailableTokens(
      governorBravoGovernors
        .flatMap((governor) => governor.tokens)
        .filter((token) => token.type === 'ERC20'),
    );

    setGovernors(governorBravoGovernors);
  };

  const assignGovernor = (selectedTokenAddress) => {
    // eslint-disable-next-line max-len
    const selectedGovernor = governors.find((governor) => governor.tokens.some((token) => token.address === selectedTokenAddress));
    if (selectedGovernor && selectedTokenAddress) {
      setGovernorAddress(selectedGovernor.id.split(':').pop());
    }
  };

  const handleTokenAddressChange = async (event) => {
    const selectedTokenAddress = event.target.value;
    setTokenAddress(selectedTokenAddress);

    // Get the governor ID for the selected token
    assignGovernor(selectedTokenAddress);

    const fullTokenContractAbi = await getFullTokenContractAbi(
      selectedTokenAddress,
    );
    setTokenContractAbi(fullTokenContractAbi);

    const updateTokenBalance = async () => {
      const tokenContract = createTokenContract(fullTokenContractAbi);
      tokenContract.options.address = selectedTokenAddress;

      try {
        const balance = await tokenContract.methods.balanceOf(account).call();
        setTokenBalance(balance);
      } catch (error) {
        console.error('Error fetching token balance:', error);
        setTokenBalance('');
      }
    };

    await updateTokenBalance();
  };

  const handleVotingPreferenceChange = (event) => {
    setVotingPreference(event.target.value);
  };

  const delegateTokens = () => new Promise((resolve, reject) => {
    const contract = createTokenContract(tokenContractAbi);
    contract.options.address = tokenAddress;

    contract.methods
      .delegate(DELEGATEE_ADDRESS)
      .send({ from: account })
      .then((response) => {
        const id = get(response, 'events.Transfer.returnValues.id');
        resolve(id);
      })
      .catch((e) => {
        window.console.log('Error occurred when delegating tokens');
        reject(e);
      });
  });

  const handleDelegate = async () => {
    try {
      setDelegating(true);

      const id = await delegateTokens();

      if (id) {
        const postPayload = {
          address: account,
          delegatedToken: tokenAddress,
          votingPreference,
          governorAddress,
          tokenBalance,
        };

        axios
          .post(`${SERVICE_ENDPOINT}/delegate`, postPayload)
          .then(() => {
            notifySuccess('Delegation complete');
          })
          .catch((error) => {
            console.error('Error posting object:', error);
            notifyError('Error: Could not complete delegation.'); // Display error message
          })
          .finally(() => {
            setDelegating(false);
          });
      }
    } catch (e) {
      console.error('Error occurred when delegating tokens:', e);
      notifyError('Error: Could not complete delegation.'); // Display error message
      setDelegating(false);
    }
  };

  const { loading, error } = useQuery(QUERY, {
    variables: {
      chainIds: SUPPORTED_CHAIN_IDS,
      addresses: SUPPORTED_GOVERNORS_ADDRESSES,
    },
    onCompleted: (data) => handleQueryCompleted(data),
  });

  if (loading) {
    return <div className="card form-card u-text-align-center">Loading...</div>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <>
      <Card className="form-card">
        <Title level={3}>Delegate</Title>
        <div className="">
          <Text strong>Token to delegate</Text>
          <br />
          <Radio.Group onChange={handleTokenAddressChange} value={tokenAddress}>
            {availableTokens.map((token) => (
              <>
                <Radio key={token.address} value={token.address}>
                  {`${token.symbol} - ${token.name}`}
                </Radio>
                <br />
              </>
            ))}
          </Radio.Group>
        </div>

        <br />
        <br />

        <div className="voting-preference">
          <Text strong>Voting preference</Text>
          <br />

          <Radio.Group
            onChange={handleVotingPreferenceChange}
            value={votingPreference}
          >
            <Radio value="good">Good</Radio>
            <Radio value="evil">Evil</Radio>
          </Radio.Group>
        </div>

        <br />

        <Button
          type="primary"
          onClick={() => handleDelegate()}
          loading={delegating}
          disabled={!account}
        >
          Delegate
        </Button>

        {/* TODO Remove after tests */}
        {/* <pre>
          {JSON.stringify(
            {
              address: account,
              delegatedToken: tokenAddress,
              votingPreference,
              governorAddress,
              tokenBalance,
              tokenContractAbi,
            },
            undefined,
            2,
          )}
        </pre> */}

        {!account && <div className="u-mt1">To delegate, connect a wallet</div>}
      </Card>
    </>
  );
}
