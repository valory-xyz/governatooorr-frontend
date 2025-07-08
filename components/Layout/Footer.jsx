import { COLOR } from '@autonolas/frontend-library';
import { Card, Typography } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  margin-bottom: 1rem;

  .ant-card {
    border: 1px solid #d62068;
    background-color rgb(5, 25, 52);
  }

  .ant-card-body {
    padding: 1rem;
  }

  .ant-typography {
    color: ${COLOR.WHITE};
    margin: 0;
  }
`;

const Footer = () => (
  <Container>
    <Card>
      <Typography.Paragraph>
        {`© Olas (aka Autonolas) DAO ${new Date().getFullYear()}`}
        {' '}
      </Typography.Paragraph>
    </Card>
  </Container>
);

export default Footer;
