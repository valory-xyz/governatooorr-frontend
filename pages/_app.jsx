/* eslint-disable jest/require-hook */
import App from 'next/app';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

import Meta from 'common-util/meta';
import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';

/* eslint-disable-next-line import/no-extraneous-dependencies */
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import initStore from '../store';

require('../styles/antd.less');

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
        <Layout>
          <Component {...pageProps} />
        </Layout>
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
