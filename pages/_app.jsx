/* eslint-disable jest/require-hook */
import App from "next/app";
import { createWrapper } from "next-redux-wrapper";
import PropTypes from "prop-types";

import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";

import { Web3DataProvider } from "@autonolas/frontend-library";
import Meta from "common-util/meta";
import GlobalStyle from "components/GlobalStyles";
import Layout from "components/Layout";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client.js";
import initStore from "../store";
import "../styles/global.css";

const getLibrary = (provider) => new Web3(provider);

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ApolloProvider client={client}>
        <GlobalStyle />
        <Meta />
        <Web3DataProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Web3ReactProvider>
        </Web3DataProvider>
      </ApolloProvider>
    );
  }
}

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

/* MyApp.defaultProps = {
  resetOnModalCloseFn: () => {},
}; */

const wrapper = createWrapper(initStore);
export default wrapper.withRedux(MyApp);
