import React, { useState } from "react";
import { ethers } from "ethers";
import TokenAddress from "./TokenAddress";
import ClientOnly from "components/ClientOnly";

function Delegate() {
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleDelegateClick = async () => {
    try {
      setLoading(true);
      setError("");

      const tx = await comp.methods
        .delegate(delegateeAddress)
        .send({ from: account });

      setLoading(false);
      setAmount("");
    } catch (error) {
      console.error(error);
      setError("An error occurred while delegating tokens.");
      setLoading(false);
    }
  };

  return (
    <div>
      <ClientOnly>
        <TokenAddress />
      </ClientOnly>
      {/* {JSON.stringify(
        getGovernorContractAbi("0xc0Da02939E1441F497fd74F78cE7Decb17B66529")
      )} */}

      {/* <label>
        Token symbol:
        <input
          type="text"
          value={tokenSymbol}
          onChange={handleTokenSymbolChange}
        />
      </label>
      <label>
        Amount to delegate:
        <input type="number" value={amount} onChange={handleAmountChange} />
      </label>
      <button
        onClick={handleDelegateClick}
        disabled={!tokenAddress || !tokenSymbol || !amount || loading}
      >
        {loading ? "Loading..." : "Delegate"}
      </button>
      {error && <p>{error}</p>} */}
    </div>
  );
}

export default Delegate;
