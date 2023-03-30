import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Layout, Menu, Grid, Result } from "antd/lib";
import PropTypes from "prop-types";
import get from "lodash/get";
import { setIsVerified } from "store/setup/actions";
import Image from "next/image";
import { DiscordLink } from "../Home/common";
import Login from "../Login";
import Footer from "./Footer";
import { getAddressStatus } from "./utils";
import {
  CustomLayout,
  Logo,
  RightMenu,
  LoginXsContainer,
  SupportOnlyDesktop,
} from "./styles";

const LogoSvg = dynamic(() => import("common-util/SVGs/logo"));

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: "homepage", label: "Governatooorr" },
  { key: "docs", label: "Docs" },
];

const NavigationBar = ({ children }) => {
  const screens = useBreakpoint();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState("homepage");
  const { pathname } = router;

  const dispatch = useDispatch();
  const account = useSelector((state) => get(state, "setup.account"));
  const chainId = useSelector((state) => get(state, "setup.chainId"));

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
      const name = pathname.split("/")[1];
      setSelectedMenu(name || "homepage");
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    router.push(key === "homepage" ? "/" : `/${key}`);
    setSelectedMenu(key);
  };

  const logo = (
    <Logo onClick={() => router.push("/")}>
      <LogoSvg />
    </Logo>
  );

  if (screens.xs) {
    return (
      <CustomLayout hasSider>
        <Header>{logo}</Header>
        <SupportOnlyDesktop>
          <Result
            status="warning"
            title="Not supported on mobile, please switch to desktop"
          />
        </SupportOnlyDesktop>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout>
      {/* <Header>
        {logo}

        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={handleMenuItemClick}
        />

        {!screens.xs && (
          <RightMenu>
          </RightMenu>
        )}
      </Header> */}

      <Link href="/">
        <div style={{ marginBottom: "2rem", margin: "0 auto 2rem auto" }}>
          <Image src="/images/governatooorr.png" width={600} height={350} />
        </div>
      </Link>
      <div style={{ margin: "0 auto" }}>
        <Login />
      </div>
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

      {/* <Footer /> */}
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
