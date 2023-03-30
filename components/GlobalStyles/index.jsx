import { COLOR } from '@autonolas/frontend-library';
import { createGlobalStyle } from 'styled-components';

const NEW_COLOR = '#d62068';

const GlobalStyle = createGlobalStyle`
  .site-layout {
    padding: 0px 50px 160px;
  }
  .service-status-maximized {
    background: ${COLOR.BLACK};
    .status-sub-header {
      color: ${COLOR.WHITE};
    }
    a {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .ant-btn-link {
      color: ${NEW_COLOR};
    }
  }

`;

export default GlobalStyle;
