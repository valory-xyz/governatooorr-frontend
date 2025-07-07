const withAntdLess = require('next-plugin-antd-less');

module.exports = {
  ...withAntdLess({
    lessVarsFilePathAppendToEndOfContent: false,
    cssLoaderOptions: { importLoaders: 1 },
    lessLoaderOptions: { javascriptEnabled: true },
    productionBrowserSourceMaps: true,
    webpack(config) {
      return config;
    },
  }),
  publicRuntimeConfig: {},
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/verification',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
