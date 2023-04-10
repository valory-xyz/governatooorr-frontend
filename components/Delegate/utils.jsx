import { uniqBy } from 'lodash';
import { gql } from '@apollo/client';

import axios from 'axios';
import { getWeb3Details } from 'common-util/Contracts';
import { SUPPORTED_TOKEN_TYPES, ACCEPTED_GOVERNOR_TYPES } from 'util/constants';
import { DEFAULT_ERC20_ABI } from 'common-util/AbiAndAddresses';

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

// create a function and get proxy contract using token address through etherscan api
export const getContractProxyAbi = async (tokenAddress) => {
  console.log('getContractProxyAbi START');
  const API = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${tokenAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`;
  // const API = `https://api.etherscan.io/api?module=proxy&action=eth_call&to=${tokenAddress}&data=0x3570b2c0&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`;
  try {
    const response = await axios.get(API);
    if (response.status !== 200) {
      throw new Error(
        `Error retrieving token contract ABI: Status ${response.status}`,
      );
    }
    const stringedTokenContractAbi = response.data.result[0];
    console.log(stringedTokenContractAbi);
    // if (!stringedTokenContractAbi) {
    //   console.warn(
    //     'No contract ABI available to retrieve. Falling back to default ABI.',
    //   );
    //   return DEFAULT_ERC20_ABI;
    // }
    const parsedAbi = JSON.parse(stringedTokenContractAbi);
    // https://stackoverflow.com/a/74771952
    // console.log(parsedAbi);

    if (stringedTokenContractAbi.includes('implementation')) {
      // const hasBalanceOf = parsedAbi.find((entry) => entry.name === 'implementation');
      const { web3 } = getWeb3Details();
      const contract = new web3.eth.Contract(parsedAbi, tokenAddress);
      const abc = await contract.methods.implementation().send({
        from: '0xe3D1fB73D21895286aef7063444d173626eb9C9E',
      });
      console.log(abc);
      // const abc = await web3.eth.getTransactionReceipt(
      //   tokenAddress,
      // );
      // console.log(abc);
    }

    return parsedAbi;
  } catch (e) {
    console.log(e);
  }
  console.log('getContractProxyAbi END');
  return null;
};

const getTokenContractAbi = async (tokenAddress) => {
  const etherscanApiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`;

  try {
    const response = await axios.get(etherscanApiUrl);

    if (response.status !== 200) {
      throw new Error(
        `Error retrieving token contract ABI: Status ${response.status}`,
      );
    }

    const stringedTokenContractAbi = response.data.result;
    console.log(stringedTokenContractAbi);
    if (!stringedTokenContractAbi) {
      console.warn(
        'No contract ABI available to retrieve. Falling back to default ABI.',
      );
      return DEFAULT_ERC20_ABI;
    }

    await getContractProxyAbi(tokenAddress);
    const parsedAbi = JSON.parse(stringedTokenContractAbi);

    const hasBalanceOf = parsedAbi.some((entry) => entry.name === 'balanceOf');
    const hasDelegate = parsedAbi.some((entry) => entry.name === 'delegate');

    if (!hasBalanceOf) {
      console.warn('Using default ERC20 ABI due to missing balanceOf function');
      return DEFAULT_ERC20_ABI;
    }

    if (!hasDelegate) {
      console.warn('Using default ERC20 ABI due to missing delegate function');
      return DEFAULT_ERC20_ABI;
    }

    // if (stringedTokenContractAbi.includes('implementation')) {
    //   // const hasBalanceOf = parsedAbi.find((entry) => entry.name === 'implementation');
    //   const { web3 } = getWeb3Details();
    //   const contract = new web3.eth.Contract(parsedAbi, tokenAddress);

    //   console.log(contract);

    //   const abc = await contract.methods
    //     .implementation()
    //     .send({ from: '0xe3D1fB73D21895286aef7063444d173626eb9C9E' });
    //   console.log(abc);
    // }

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

export const createTokenContract = (token) => {
  const { web3 } = getWeb3Details();
  console.log(token);
  console.log(web3);

  // Check if tokenContractAbi is not empty
  if (token) {
    return new web3.eth.Contract(token);
  }
  throw new Error('Token contract ABI is empty');
};

export const getUniqueGovernorBravoGovernors = (governors) => {
  const filteredGovernors = governors.filter(({ type }) => ACCEPTED_GOVERNOR_TYPES.includes(type));
  return uniqBy(filteredGovernors, 'id');
};

export const isSupportedTokenType = (token) => SUPPORTED_TOKEN_TYPES.includes(token.type);
