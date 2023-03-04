import { useQuery, gql } from "@apollo/client";
import axios, { AxiosError } from "axios";
import { getWeb3Details } from "common-util/Contracts";
import { notifySuccess } from "common-util/functions";
import { get } from "lodash";
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

const delegateeAddress = "0x04C06323Fe3D53Deb7364c0055E1F68458Cc2570";
const serviceEndpoint = "https://gateway.autonolas.tech/governatoooorr/api";

const getTokenContractAbi = async (tokenAddress) => {
  // TODO: Get new API key
  const response = await axios.get(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=2IWNZ26ZKHK5UXVUUV2JQ9N75XSMSBBTJV`
  );
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
          console.log(response);
          const id = get(response, "events.Transfer.returnValues.id");
          resolve(id);
        })
        .catch((e) => {
          window.console.log("Error occurred when delegating tokens");
          reject(e);
        });
    });

  const handleDelegate = async () => {
    // const postPayload = {
    //   address: account,
    //   votingPreference,
    // };
    // axios
    //   .post(serviceEndpoint, postPayload)
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  const { data, loading, error } = useQuery(QUERY, {
    variables: { ids: [`eip155:1:${tokenAddress}`] },
    onCompleted: (data1) => handleQueryCompleted(data1),
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  return account ? (
    <div style={{ textAlign: "center" }}>
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
        COMP (0xc00e94Cb662C3520282E6f5717214004A7f26888)
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
        UNI (0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984)
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
          Good
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="evil"
            checked={votingPreference === "evil"}
            onChange={handleVotingPreferenceChange}
          />
          Evil
        </label>
      </div>

      <br />
      <br />

      <button
        className="ant-btn ant-btn-primary"
        type="submit"
        onClick={() => handleDelegate()}
      >
        Delegate
      </button>
    </div>
  ) : (
    <div style={{ textAlign: "center" }}>
      Connect wallet to delegate tokens to Governatooorr
    </div>
  );
}
