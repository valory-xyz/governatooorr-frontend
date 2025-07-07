import styled from 'styled-components';
import { Layout } from 'antd/lib';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';

export const CustomLayout = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .site-layout {
    padding: 0px 50px 160px;
  }

  .site-layout-background {
    height: 100%;
  }

  .registry-tabs {
    .ant-tabs-extra-content {
      &:not(:last-child) {
        .ant-typography {
          color: ${COLOR.PRIMARY};
          margin: 0 12px 0 0;
        }
      }
      &:last-child {
        gap: 12px;
        display: flex;
      }
    }
    .ant-tabs-nav-wrap {
      padding-left: 16px;
    }
  }
  .footer-left-content {
    width: 100%;
  }
  .footer-center {
    display: none !important;
  }
`;

export const Logo = styled.div`
  width: 260px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-left: 0.5rem;
  span {
    margin-left: 0.5rem;
  }
`;

export const RightMenu = styled.div`
  display: flex;
  align-items: center;

  ${MEDIA_QUERY.tablet} {
    line-height: normal;
  }
`;

export const LoginXsContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const SupportOnlyDesktop = styled.div`
  margin: 4rem 0;
`;

export const NextUpdateTimer = styled.div`
  display: inline-flex;
  align-items: center;
  .ant-statistic {
    color: inherit;
  }
  .ant-statistic-content {
    font-weight: inherit;
    font-size: inherit;
    color: inherit;
  }
`;
