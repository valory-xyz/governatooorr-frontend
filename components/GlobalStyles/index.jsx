import { COLOR } from '@autonolas/frontend-library';
import { createGlobalStyle } from 'styled-components';

export const NEW_PRIMARY_COLOR = '#d62068';
export const NEW_SECONDARY_COLOR = '#051934';

// const GlobalStyle = styled.div`
const GlobalStyle = createGlobalStyle`
  .ant-layout-header {
    display: flex;
    position: fixed;
    z-index: 10;
    width: 100%;
    .ant-menu {
      flex: 1;
      background: transparent;

      .ant-menu-item-selected {
        font-weight: bold;
      }
    }
  }

  .ant-menu.ant-menu-dark,
  .ant-menu-dark .ant-menu-sub,
  .ant-menu.ant-menu-dark .ant-menu-sub {
    background: transparent;
  }

  .service-status-maximized {
    background: ${NEW_SECONDARY_COLOR};
    border-color: ${NEW_PRIMARY_COLOR};
    .status-sub-header {
      color: ${COLOR.WHITE};
    }
    a {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .ant-btn-link {
      color: ${NEW_PRIMARY_COLOR};
    }
  }

  // Utilities
  .mb-0 {
    margin-bottom: 0 !important;
  }
  
  .mb-12 {
    margin-bottom: 12px !important;
  }
`;

export default GlobalStyle;
