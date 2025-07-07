import { Typography } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
`;

const Footer = () => (
  <Container>
    <Typography.Paragraph>
      {`© Olas (aka Autonolas) DAO ${new Date().getFullYear()}`}
      {' '}
    </Typography.Paragraph>
  </Container>
);

export default Footer;
