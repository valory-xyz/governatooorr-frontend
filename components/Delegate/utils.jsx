import { gql } from '@apollo/client';
import axios from 'axios';
import { uniqBy, get } from 'lodash';
import { getWeb3Details } from 'common-util/Contracts';
import {
  SUPPORTED_TOKEN_TYPES,
  ACCEPTED_GOVERNOR_TYPES,
  DELEGATEE_ADDRESS,
} from 'util/constants';

const ETHERSCAN_URL = 'https://api.etherscan.io/api';

export const QUERY = gql`
  query Governors(
    $chainIds: [ChainID!]
    $addresses: [Address!]
    $ids: [AccountID!]
    $includeInactive: Boolean
    $pagination: Pagination
    $sort: GovernorSort
  ) {
    governors(
      chainIds: $chainIds
      addresses: $addresses
      ids: $ids
      includeInactive: $includeInactive
      pagination: $pagination
      sort: $sort
    ) {
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
      proposalStats {
        total
        active
        failed
        passed
      }
    }
  }
`;

/**
 * if the contract is a proxy contract, returns the proxy contract address
 * else returns the token address (which is received as a parameter)
 *
 * response of sourceCodeApi
 * @example
 * {
 *  "status": "1",
 *  "message": "OK",
 *  "result": [
 *   {
 *     "ContractName": "InitializableAdminUpgradeabilityProxy",
 *     "CompilerVersion": "v0.6.10+commit.00c0fcaf",
 *     "OptimizationUsed": "1",
 *     "Runs": "200",
 *     "ConstructorArguments": "",
 *     "EVMVersion": "Default",
 *     "Library": "",
 *     "LicenseType": "",
 *     "Proxy": "1", // proxy contract if 1 else 0
 *     "Implementation": "0x96f68837877fd0414b55050c9e794aecdbcfca59",
 *     "SwarmSource": ""
 *   }
 *  ]
 * }
 */
const getContractAddress = async (tokenAddress) => {
  try {
    const response = await axios.get(
      `${ETHERSCAN_URL}?module=contract&action=getsourcecode&address=${tokenAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
    );
    const proxyAddress = response.data.result[0].Implementation;

    console.log({ proxyAddress });

    // if proxyAddress is null, then the contract is not a proxy contract
    return proxyAddress || tokenAddress;
  } catch (error) {
    console.error('Error retrieving Proxy contract ABI', error);
  }

  throw new Error('No Proxy contract address found');
};

// returns the ABI of the token contract
const getTokenContractAbi = async (tokenAddress) => {
  try {
    const address = await getContractAddress(tokenAddress);

    const response = await axios.get(
      `${ETHERSCAN_URL}?module=contract&action=getabi&address=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
    );

    if (response.status !== 200 && response.data.status !== '1') {
      throw new Error(
        `Error retrieving token contract ABI: Status ${response.status}`,
      );
    }

    console.log(response);

    const stringedTokenContractAbi = response.data.result;
    const parsedAbi = JSON.parse(stringedTokenContractAbi);
    console.log(parsedAbi);
    return parsedAbi;
  } catch (e) {
    console.error('Error retrieving token contract ABI:', e);
    throw new Error('Error retrieving token contract ABI');
  }
};

export const getFullTokenContractAbi = async (subTokenAddress) => {
  const stringedTokenContractAbi = await getTokenContractAbi(subTokenAddress);
  return stringedTokenContractAbi;
};

export const createTokenContract = (abi, token) => {
  const { web3 } = getWeb3Details();

  // Check if tokenContractAbi is not empty
  if (abi && token) {
    return new web3.eth.Contract(abi, token);
  }

  throw new Error('Token contract ABI is empty');
};

export const getUniqueGovernorBravoGovernors = (governors) => {
  const filteredGovernors = governors.filter(({ type }) => ACCEPTED_GOVERNOR_TYPES.includes(type));
  return uniqBy(filteredGovernors, 'id');
};

export const isSupportedTokenType = (token) => SUPPORTED_TOKEN_TYPES.includes(token.type);

/**
 * Contract call to delegate tokens
 */
export const delegateTokensRequest = ({
  account,
  tokenContractAbi,
  tokenAddress,
  // others
}) => new Promise((resolve, reject) => {
  const contract = createTokenContract(tokenContractAbi, tokenAddress);

  contract.methods
    .delegate(DELEGATEE_ADDRESS)
    .send({ from: account })
    .then((response) => {
      // const id = get(response, 'events.Transfer.returnValues.id');
      // resolve(id);
      window.console.log(
        { response },
      );
      // listen to the delegate event & check if the delegatee address is correct
      contract.events
        .DelegateChanged()
        .on('data', (event) => {
          window.console.log('Transfer event data:', event);
          const { returnValues } = event;
          const { delegatee } = returnValues;
          if (delegatee === DELEGATEE_ADDRESS) {
            resolve(true);
          }
        })
        .on('error', (error) => {
          window.console.log(
            'Error occurred when listening to the Transfer event',
          );
          reject(error);
        });
    })
    .catch((e) => {
      window.console.log('Error occurred when delegating tokens');
      reject(e);
    });
});
