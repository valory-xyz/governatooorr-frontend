import { COLOR } from '@autonolas/frontend-library';
import { createGlobalStyle } from 'styled-components';

const NEW_COLOR = '#d62068';

// const GlobalStyle = styled.div`
const GlobalStyle = createGlobalStyle`
  .site-layout {
    padding: 0px 50px 160px;
  }

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

  .ant-menu.ant-menu-dark .ant-menu-item-selected,
  .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background: transparent;
    color: ${NEW_COLOR};
  }
  .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
    background: transparent;
    color: ${NEW_COLOR};
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
