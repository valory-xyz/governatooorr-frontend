import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import {
  Button, Card, Typography, Select, Radio,
} from 'antd/lib';
import axios from 'axios';
import { notifyError, notifySuccess } from 'common-util/functions';
import { SERVICE_ENDPOINT, SUPPORTED_CHAIN_IDS } from 'util/constants';
import {
  QUERY,
  getTokenContractAbi,
  createTokenContract,
  getUniqueGovernorBravoGovernors,
  isSupportedTokenType,
  delegateTokensRequest,
} from './utils';

const { Text, Title } = Typography;

export default function DelegateBody() {
  // proxy address can be token address or proxy contract address
  const [proxyAddress, setProxyAddress] = useState('');

  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenContractAbi, setTokenContractAbi] = useState(null);
  const [votingPreference, setVotingPreference] = useState('evil');
  const [delegating, setDelegating] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [governorAddress, setGovernorAddress] = useState('');
  const [governors, setGovernors] = useState([]);
  const [tokenBalance, setTokenBalance] = useState('');

  const account = useSelector((state) => get(state, 'setup.account'));

  // if tokenAddress is not empty, fetch the token contract abi
  useEffect(() => {
    const updateTokenBalance = async () => {
      // Get the governor ID for the selected token
      // eslint-disable-next-line max-len
      const selectedGovernor = governors.find(({ tokens }) => tokens.some((token) => token.address === tokenAddress));
      if (selectedGovernor && tokenAddress) {
        setGovernorAddress(selectedGovernor.id.split(':').pop());
      }

      const { parsedAbi, proxyAddress: pAddress } = await getTokenContractAbi(
        tokenAddress,
      );

      console.log({
        parsedAbi,
        pAddress,
      });

      setProxyAddress(pAddress);
      setTokenContractAbi(parsedAbi);

      const tokenContract = createTokenContract(parsedAbi, pAddress);

      try {
        const balance = await tokenContract.methods.balanceOf(account).call();
        setTokenBalance(balance);
      } catch (error) {
        console.error('Error fetching token balance:', error);
        setTokenBalance('');
      }
    };

    if (account && tokenAddress) {
      updateTokenBalance();
    }
  }, [tokenAddress]);

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

  const handleDelegate = async () => {
    try {
      setDelegating(true);

      const isDelegated = await delegateTokensRequest({
        account,
        tokenContractAbi,
        tokenAddress: proxyAddress,
      });

      if (isDelegated) {
        const postPayload = {
          address: account,
          delegatedToken: tokenAddress,
          votingPreference,
          governorAddress,
          tokenBalance,
        };

        console.log('backend call for delegation:', postPayload);

        axios
          .post(`${SERVICE_ENDPOINT}/delegate`, postPayload)
          .then(() => {
            notifySuccess('Delegation complete');
          })
          .catch((error) => {
            console.error('Error posting object:', error);
            notifyError('Error: Could not complete delegation.');
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
    return <Card className="form-card">Loading...</Card>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <>
      <Card className="form-card">
        <Title level={3}>Delegate</Title>

        <div>
          <Text strong>Token to delegate</Text>
          <br />
          <Select
            showSearch
            onChange={(value) => setTokenAddress(value)}
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
            onChange={(event) => setVotingPreference(event.target.value)}
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
          disabled={!account || !tokenContractAbi || !tokenAddress}
        >
          Delegate
        </Button>

        {!account && <div className="u-mt1">To delegate, connect a wallet</div>}
      </Card>
    </>
  );
}
