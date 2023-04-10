import { get } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import {
  Button, Card, Typography, Select, Radio,
} from 'antd/lib';
import axios from 'axios';
import { notifyError, notifySuccess } from 'common-util/functions';
import {
  SERVICE_ENDPOINT,
  SUPPORTED_CHAIN_IDS,
  DELEGATEE_ADDRESS,
} from 'util/constants';
import {
  QUERY,
  getFullTokenContractAbi,
  createTokenContract,
  getUniqueGovernorBravoGovernors,
  isSupportedTokenType,
} from './utils';

const { Text, Title } = Typography;

export default function DelegateBody() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenContractAbi, setTokenContractAbi] = useState(null);
  const [votingPreference, setVotingPreference] = useState('evil');
  const [delegating, setDelegating] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [governorAddress, setGovernorAddress] = useState('');
  const [governors, setGovernors] = useState([]);
  const [tokenBalance, setTokenBalance] = useState('');

  const account = useSelector((state) => get(state, 'setup.account'));

  const handleQueryCompleted = async (data) => {
    const uniqueGovernorBravoGovernors = getUniqueGovernorBravoGovernors(
      data.governors,
    );

    setAvailableTokens(
      uniqueGovernorBravoGovernors
        .flatMap((governor) => governor.tokens)
        .filter((token) => isSupportedTokenType(token) && token.symbol !== ''),
    );

    setGovernors(uniqueGovernorBravoGovernors);
  };

  const assignGovernor = (selectedTokenAddress) => {
    // eslint-disable-next-line max-len
    const selectedGovernor = governors.find((governor) => governor.tokens.some((token) => token.address === selectedTokenAddress));
    if (selectedGovernor && selectedTokenAddress) {
      setGovernorAddress(selectedGovernor.id.split(':').pop());
    }
  };

  const handleTokenAddressChange = async (selectedTokenAddress) => {
    console.log('handleTokenAddressChange', selectedTokenAddress);

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

  console.log(tokenContractAbi);

  const delegateTokens = () => new Promise((resolve, reject) => {
    const contract = createTokenContract(tokenContractAbi);
    contract.options.address = tokenAddress;

    console.log(1, DELEGATEE_ADDRESS);

    contract.methods
      .delegate(DELEGATEE_ADDRESS)
      .send({ from: account })
      .then((response) => {
        console.log(2);
        const id = get(response, 'events.Transfer.returnValues.id');
        resolve(id);
      })
      .catch((e) => {
        console.log(3);
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
      addresses: [],
      includeInactive: false,
      sort: {
        field: 'ACTIVE_PROPOSALS',
        order: 'DESC',
      },
      pagination: {
        limit: 200,
        offset: 0,
      },
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
          <Select
            showSearch
            onChange={handleTokenAddressChange}
            value={tokenAddress}
            className="token-delegate-select"
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={availableTokens
              .filter((token) => token.symbol !== '')
              .map((token, i) => ({
                key: `${token.address}-${i}`,
                value: token.address,
                label: `${token.symbol} - ${token.name}`,
              }))}
          />
        </div>

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
          onClick={handleDelegate}
          loading={delegating}
          disabled={!account}
        >
          Delegate
        </Button>

        {!account && <div className="u-mt1">To delegate, connect a wallet</div>}
      </Card>
    </>
  );
}
