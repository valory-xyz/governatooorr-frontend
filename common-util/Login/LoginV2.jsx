import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
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

  const { connector } = useAccount({
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

  useEffect(async () => {
    try {
      // This is the initial `provider` that is returned when
      // using web3Modal to connect. Can be MetaMask or WalletConnect.
      const modalProvider = connector?.options?.getProvider?.()
        || (await connector?.getProvider?.());

      if (modalProvider) {
        // We plug the initial `provider` and get back
        // a Web3Provider. This will add on methods and
        // event listeners such as `.on()` will be different.
        const wProvider = new Web3(modalProvider);

        // *******************************************************
        // ************ setting to the window object! ************
        // *******************************************************
        window.MODAL_PROVIDER = modalProvider;
        window.WEB3_PROVIDER = wProvider;

        if (modalProvider?.on) {
          // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
          const handleChainChanged = () => {
            window.location.reload();
          };

          modalProvider.on('chainChanged', handleChainChanged);

          // cleanup
          return () => {
            if (modalProvider.removeListener) {
              modalProvider.removeListener('chainChanged', handleChainChanged);
            }
          };
        }
      }

      return undefined;
    } catch (error) {
      console.error(error);
    }

    return undefined;
  }, [connector]);

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
