import { useQuery, gql } from "@apollo/client";
import { Button, message } from "antd";
import axios from "axios";
import { getWeb3Details } from "common-util/Contracts";
import { notifySuccess } from "common-util/functions";
import { get } from "lodash";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

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

const delegateeAddress = "0x94825185b1dD96918635270ddA526254a0F2fbf1";
const serviceEndpoint =
  "https://WrithingDependentApplicationprogram.oaksprout.repl.co";

const mockDelegateTokens = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      const mockTransactionId = "123123"; // Simulated transaction ID
      console.log("Mock delegation successful, id:", mockTransactionId);
      resolve(mockTransactionId);
    }, 1000); // Simulate a delay in the response
  });

const getTokenContractAbi = async (tokenAddress) => {
  const etherscanApiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`;

  const response = await axios.get(etherscanApiUrl);
  return response.data.result;
};

const createTokenContract = (tokenContractAbi) => {
  const { web3 } = getWeb3Details();

  return new web3.eth.Contract(tokenContractAbi);
};

export default function TokenAddress() {
  const [tokenAddress, setTokenAddress] = useState(
    "0xc00e94Cb662C3520282E6f5717214004A7f26888"
  );
  const [tokenContractAbi, setTokenContractAbi] = useState("");
  const [votingPreference, setVotingPreference] = useState("evil");
  const [delegating, setDelegating] = useState(false);

  const account = useSelector((state) => get(state, "setup.account"));

  const handleQueryCompleted = async (data1) => {
    const stringedTokenContractAbi = await getTokenContractAbi(tokenAddress);
    // convert ABI to JSON format
    const tempTokenContractAbi = eval(stringedTokenContractAbi);
    setTokenContractAbi(tempTokenContractAbi);
  };

  const handleTokenAddressChange = (event) => {
    setTokenAddress(event.target.value);
  };

  const handleVotingPreferenceChange = (event) => {
    setVotingPreference(event.target.value);
  };

  const delegateTokens = () =>
    new Promise((resolve, reject) => {
      const contract = createTokenContract(tokenContractAbi);
      contract.options.address = tokenAddress;

      contract.methods
        .delegate(delegateeAddress)
        .send({ from: account })
        .then((response) => {
          notifySuccess("Tokens delegated");
          const id = get(response, "events.Transfer.returnValues.id");
          resolve(id);
        })
        .catch((e) => {
          window.console.log("Error occurred when delegating tokens");
          reject(e);
        });
    });

  const handleDelegate = async () => {
    try {
      setDelegating(true);

      // const id = await delegateTokens();
      const id = await mockDelegateTokens();

      if (id) {
        const postPayload = {
          address: account,
          delegatedToken: tokenAddress,
          votingPreference,
        };

        axios
          .post(`${serviceEndpoint}/submit-json`, postPayload)
          .then((response) => {
            console.log("Successfully posted object:", response);
            message.success("Delegation complete!"); // Display success message
          })
          .catch((error) => {
            console.error("Error posting object:", error);
            message.error("Error: Could not complete delegation."); // Display error message
          })
          .finally(() => {
            setDelegating(false);
          });
      }
    } catch (e) {
      console.error("Error occurred when delegating tokens:", e);
      message.error("Error: Could not complete delegation."); // Display error message
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
      <div className="card form-card  u-mb2">
        <div>
          <b>Token to delegate</b>
        </div>
        <label>
          <input
            type="radio"
            value="0xc00e94Cb662C3520282E6f5717214004A7f26888"
            checked={
              tokenAddress === "0xc00e94Cb662C3520282E6f5717214004A7f26888"
            }
            onChange={handleTokenAddressChange}
          />
          &nbsp;COMP
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
            checked={
              tokenAddress === "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
            }
            onChange={handleTokenAddressChange}
          />
          &nbsp;UNI
        </label>

        <br />
        <br />

        <div>
          <div>
            <b>Voting preference</b>
          </div>
          <label>
            <input
              type="radio"
              value="good"
              checked={votingPreference === "good"}
              onChange={handleVotingPreferenceChange}
            />
            &nbsp;Good
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="evil"
              checked={votingPreference === "evil"}
              onChange={handleVotingPreferenceChange}
            />
            &nbsp;Evil
          </label>
        </div>

        <br />

        <Button
          type="primary"
          onClick={() => handleDelegate()}
          loading={delegating}
          disabled={!account}
          className={account || "u-mb1"}
        >
          Delegate
        </Button>
        {account || <div>To delegate, connect a wallet</div>}
      </div>
      <div className="card form-card u-mb2">
        <Link href="/docs">Docs</Link>
      </div>
      <div className="card form-card u-mb2">
        Donate ETH for gas: {delegateeAddress}
      </div>
    </>
  );
}
