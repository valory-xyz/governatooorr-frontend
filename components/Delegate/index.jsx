import React from "react";
import TokenAddress from "./TokenAddress";
import ClientOnly from "components/ClientOnly";

function Delegate() {
  return (
    <div>
      <ClientOnly>
        <TokenAddress />
      </ClientOnly>
    </div>
  );
}

export default Delegate;
