// const { ethers } = require('ethers');
// const TallyAbi = require('./TallyAbi.json');

// // Set up your provider and Tally contract instance
// const provider = new ethers.providers.JsonRpcProvider();
// const tallyAddress = '0x...'; // replace with Tally contract address
// const tallyContract = new ethers.Contract(tallyAddress, TallyAbi, provider);

// async function getGovernorTokenAddress() {
//   // Get the governor token address from the Tally contract
//   const governorTokenAddress = await tallyContract.governorToken();

//   // Check if the governor token address is a proxy contract
//   const code = await provider.getCode(governorTokenAddress);
//   const isProxy = code.includes('UpgradeableProxy(');

//   // If the governor token address is a proxy, return the implementation address instead
//   if (isProxy) {
//     const implementationAddress = await
// tallyContract.getImplementationAddress(governorTokenAddress);
//     return implementationAddress;
//   }

//   // Otherwise, return the governor token address
//   return governorTokenAddress;
// }

// getGovernorTokenAddress().then((address) => {
//   console.log('Governor token address:', address);
// });

const axios = require('axios');

const API_KEY = 'your_etherscan_api_key';
const CONTRACT_ADDRESS = '0x...'; // replace with the address of the contract you want to retrieve the transaction hash for

const fn = () => {
  // Call the API method to retrieve the transaction hash
  axios.get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${API_KEY}`)
    .then((response) => {
      // Parse the transaction hash from the API response
      const txHash = response.data.result.hash;
      console.log(`Transaction hash for contract deployment at address ${CONTRACT_ADDRESS}: ${txHash}`);
    })
    .catch((error) => {
      console.error(error);
    });
};
