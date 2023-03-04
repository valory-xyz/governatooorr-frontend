import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Login as LoginComponent } from '@autonolas/frontend-library';
import {
  setUserAccount as setUserAccountFn,
  setUserBalance as setUserBalanceFn,
  setChainId as setChainIdFn,
  setErrorMessage as setErrorMessageFn,
  setLogout as setLogoutFn,
} from 'store/setup/actions';

const Container = styled.div``;

const rpc = {
  1: process.env.NEXT_PUBLIC_MAINNET_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_URL,
  31337: process.env.NEXT_PUBLIC_AUTONOLAS_URL,
};

const Login = ({
  setUserAccount,
  setUserBalance,
  setChainId,
  setErrorMessage,
  setLogout,
}) => {
  const onConnect = (response) => {
    setUserAccount(response.address);
    setUserBalance(response.balance);
    setChainId(response.chainId);
  };

  const onDisconnect = () => {
    setLogout();
  };

  const onError = (error) => {
    setErrorMessage(error);
  };

  return (
    <Container>
      <LoginComponent
        rpc={rpc}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onError={onError}
        isDapp={false}
        backendUrl={process.env.NEXT_PUBLIC_BACKEND_URL}
      />
    </Container>
  );
};

Login.propTypes = {
  setUserAccount: PropTypes.func.isRequired,
  setUserBalance: PropTypes.func.isRequired,
  setChainId: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setLogout: PropTypes.func.isRequired,
};

Login.defaultProps = {};

const mapDispatchToProps = {
  setUserAccount: setUserAccountFn,
  setUserBalance: setUserBalanceFn,
  setChainId: setChainIdFn,
  setErrorMessage: setErrorMessageFn,
  setLogout: setLogoutFn,
};

export default connect(null, mapDispatchToProps)(Login);
