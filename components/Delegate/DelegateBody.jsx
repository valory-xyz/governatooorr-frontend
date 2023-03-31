import { get } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import {
  Button, message, Card, Radio, Typography,
} from 'antd/lib';
import axios from 'axios';
import { getWeb3Details } from 'common-util/Contracts';
import { notifySuccess } from 'common-util/functions';

const { Text, Title } = Typography;

const QUERY = gql`
  query Accounts($ids: [AccountID!]) {
    accounts(ids: $ids) {
      address
      name
      participations {
        governor {
          id
        }
      }
    }
  }
`;

const serviceEndpoint = 'https://WrithingDependentApplicationprogram.oaksprout.repl.co';

const getTokenContractAbi = async (tokenAddress) => {
  const etherscanApiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`;

  const response = await axios.get(etherscanApiUrl);
  return response.data.result;
};

const createTokenContract = (tokenContractAbi) => {
  const { web3 } = getWeb3Details();

  return new web3.eth.Contract(tokenContractAbi);
};

export default function DelegateBody({ delegateeAddress }) {
  const [tokenAddress, setTokenAddress] = useState(
    '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  );
  const [tokenContractAbi, setTokenContractAbi] = useState('');
  const [votingPreference, setVotingPreference] = useState('evil');
  const [delegating, setDelegating] = useState(false);

  const account = useSelector((state) => get(state, 'setup.account'));

  const handleQueryCompleted = async () => {
    const stringedTokenContractAbi = await getTokenContractAbi(tokenAddress);
    // convert ABI to JSON format
    // eslint-disable-next-line no-eval
    const tempTokenContractAbi = eval(stringedTokenContractAbi);
    setTokenContractAbi(tempTokenContractAbi);
  };

  const handleTokenAddressChange = (event) => {
    setTokenAddress(event.target.value);
  };

  const handleVotingPreferenceChange = (event) => {
    setVotingPreference(event.target.value);
  };

  const delegateTokens = () => new Promise((resolve, reject) => {
    const contract = createTokenContract(tokenContractAbi);
    contract.options.address = tokenAddress;

    contract.methods
      .delegate(delegateeAddress)
      .send({ from: account })
      .then((response) => {
        notifySuccess('Tokens delegated');
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
        };

        axios
          .post(`${serviceEndpoint}/delegate`, postPayload)
          .then((response) => {
            console.log('Successfully posted object:', response);
            message.success('Delegation complete!'); // Display success message
          })
          .catch((error) => {
            console.error('Error posting object:', error);
            message.error('Error: Could not complete delegation.'); // Display error message
          })
          .finally(() => {
            setDelegating(false);
          });
      }
    } catch (e) {
      console.error('Error occurred when delegating tokens:', e);
      message.error('Error: Could not complete delegation.'); // Display error message
      setDelegating(false);
    }
  };

  const { loading, error } = useQuery(QUERY, {
    variables: { ids: [`eip155:1:${tokenAddress}`] },
    onCompleted: (data1) => handleQueryCompleted(data1),
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
        <Title level={2}>Delegate</Title>
        <div className="token-to-delegate">
          <Text strong>Token to delegate</Text>
          <br />
          <Radio.Group onChange={handleTokenAddressChange} value={tokenAddress}>
            <Radio value="0xc00e94Cb662C3520282E6f5717214004A7f26888">
              COMP
            </Radio>
            <Radio value="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984">
              UNI
            </Radio>
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
        <div className="u-mt1">
          {account || 'To delegate, connect a wallet'}
        </div>
      </Card>
    </>
  );
}

DelegateBody.propTypes = {
  delegateeAddress: PropTypes.string.isRequired,
};
