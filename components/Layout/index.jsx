import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Layout, Grid, Result } from 'antd/lib';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { setIsVerified } from 'store/setup/actions';
import Navbar from '../Navbar';
import Login from '../Login';
import {
  CustomLayout,
  Logo,
  LoginXsContainer,
  SupportOnlyDesktop,
} from './styles';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [{ key: 'docs', label: 'Docs' }];
const Footer = dynamic(() => import('./Footer'), {
  ssr: false,
});

const NavigationBar = ({ children }) => {
  const screens = useBreakpoint();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState('homepage');
  const [isServiceInfoMinimized, setServiceInfoMinized] = useState(true);
  const { pathname } = router;

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

  // to set default menu on first render
  useEffect(() => {
    if (pathname) {
      const name = pathname.split('/')[1];
      setSelectedMenu(name || 'homepage');
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    router.push(key === 'homepage' ? '/' : `/${key}`);
    setSelectedMenu(key);
  };

  const logo = (
    <Logo onClick={() => router.push('/')}>
      <img src="/images/logo.png" alt="logo" className="logo" />
    </Logo>
  );

  if (screens.xs) {
    return (
      <CustomLayout hasSider>
        <div className="u-text-align-center">{logo}</div>
        <SupportOnlyDesktop>
          <div className="card form-card">
            <Result
              status="warning"
              title="Not supported on mobile, please switch to desktop"
            />
          </div>
        </SupportOnlyDesktop>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout isMinimized={isServiceInfoMinimized}>
      <Navbar
        logo={logo}
        selectedMenu={selectedMenu}
        handleMenuItemClick={handleMenuItemClick}
        menuItems={menuItems}
      />

      <Content className="site-layout">
        <div className="site-layout-background">
          {!!screens.xs && (
            <LoginXsContainer>
              <Login />
            </LoginXsContainer>
          )}
          {children}
        </div>
      </Content>

      <Footer
        onMinimizeToggle={() => setServiceInfoMinized(!isServiceInfoMinimized)}
      />
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
