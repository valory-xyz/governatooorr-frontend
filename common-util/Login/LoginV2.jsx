/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Web3Modal, Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import {
  WagmiConfig, useAccount, useNetwork, useBalance,
} from 'wagmi';
import { COLOR } from '@autonolas/frontend-library';
import { projectId, wagmiConfig, ethereumClient } from './config';
import { LoginContainer } from './styles';

export const LoginV2 = ({
  onConnect: onConnectCb,
  onDisconnect: onDisconnectCb,
  theme = 'light',
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data } = useBalance({ address });

  const chainId = chain?.id;

  useAccount({
    onConnect: ({ address: currentAddress }) => {
      if (onConnectCb) {
        onConnectCb({
          address: address || currentAddress,
          balance: data?.formatted,
          chainId,
        });
      }
    },
    onDisconnect() {
      if (onDisconnectCb) onDisconnectCb();
    },
  });

  // console.log({
  //   wagmiConfig,
  //   ethereumClient,
  // });

  return (
    <LoginContainer>
      <WagmiConfig config={wagmiConfig}>
        <Web3NetworkSwitch />
        &nbsp;&nbsp;
        <Web3Button balance="show" avatar="hide" />
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode={theme}
        themeVariables={{
          '--w3m-button-border-radius': '5px',
          '--w3m-accent-color': COLOR.PRIMARY,
          '--w3m-background-color': COLOR.PRIMARY,
        }}
      />
    </LoginContainer>
  );
};

LoginV2.propTypes = {
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
  theme: PropTypes.string,
};

LoginV2.defaultProps = {
  onConnect: undefined,
  onDisconnect: undefined,
  theme: 'light',
};
