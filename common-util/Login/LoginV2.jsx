/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Web3Modal, Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { useAccount, useNetwork, useBalance } from 'wagmi';
import { NEW_PRIMARY_COLOR } from '../../components/GlobalStyles';
import { projectId, ethereumClient } from './config';
import { LoginContainer } from './styles';

export const LoginV2 = ({
  onConnect: onConnectCb,
  onDisconnect: onDisconnectCb,
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

  return (
    <LoginContainer>
      <Web3NetworkSwitch />
      &nbsp;&nbsp;
      <Web3Button balance="show" avatar="hide" />
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        themeVariables={{
          '--w3m-button-border-radius': '5px',
          '--w3m-accent-color': NEW_PRIMARY_COLOR,
          '--w3m-background-color': NEW_PRIMARY_COLOR,
        }}
      />
    </LoginContainer>
  );
};

LoginV2.propTypes = {
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
};

LoginV2.defaultProps = {
  onConnect: undefined,
  onDisconnect: undefined,
};
