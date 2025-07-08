import { COLOR } from '@autonolas/frontend-library';
import { Card, Typography } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .ant-card {
    border: 1px solid #d62068;
    background-color rgb(5, 25, 52);
  }

  .ant-typography {
    color: ${COLOR.WHITE};
    text-align: center;
    display: block;
  }
`;

const Home = () => (
  <Container>
    <Card>
      <Typography.Title level={3}>
        This app has been deprecated and is no longer supported.
      </Typography.Title>
      <Typography.Text>
        Please head over to
        {' '}
        <a href="https://olas.network/" target="_blank" rel="noopener noreferrer">
          Olas
        </a>
        {' '}
      </Typography.Text>
    </Card>
  </Container>
);

export default Home;
