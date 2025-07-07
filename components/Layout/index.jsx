import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Layout } from 'antd/lib';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { setIsVerified } from 'store/setup/actions';
import Navbar from '../Navbar';
import {
  CustomLayout,
  Logo,
} from './styles';

const { Content } = Layout;

const Footer = dynamic(() => import('./Footer'), {
  ssr: false,
});

const NavigationBar = ({ children }) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const account = useSelector((state) => get(state, 'setup.account'));
  const chainId = useSelector((state) => get(state, 'setup.chainId'));

  useEffect(() => {
    // on first render, if there is no account (ie. wallet not connected),
    // mark as not verified
    if (!account) {
      dispatch(setIsVerified(false));
    }
  }, []);

  /**
   * fetch if wallet is verified on page load
   */
  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        try {
          // const response = await getAddressStatus(account);
          // dispatch(setIsVerified(response));
        } catch (error) {
          window.console.error(error);
        }
      }
    };
    fn();
  }, [account, chainId]);

  const logo = (
    <Logo onClick={() => router.push('/')}>
      <img src="/images/logo.png" alt="logo" className="logo" />
    </Logo>
  );

  return (
    <CustomLayout>
      <Navbar logo={logo} />

      <Content className="site-layout">
        <div className="site-layout-background">
          {children}
        </div>
      </Content>

      <Footer />
    </CustomLayout>
  );
};

NavigationBar.propTypes = {
  children: PropTypes.element,
};

NavigationBar.defaultProps = {
  children: null,
};

export default NavigationBar;
