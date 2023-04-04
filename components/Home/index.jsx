import { Row, Col, Card } from 'antd/lib';
import Delegate from 'components/Delegate';
import MyDelegations from 'components/MyDelegations';
import Proposals from 'components/Proposals';
import { DELEGATEE_ADDRESS } from 'util/constants';

const Home = () => (
  <>
    <Row gutter={12}>
      <Col xs={24} lg={10}>
        <Delegate />
        <MyDelegations />

        <Card className="form-card">
          {`Donate ETH for gas: ${DELEGATEE_ADDRESS}`}
        </Card>
      </Col>
      <Col xs={24} lg={14}>
        <Proposals />
      </Col>
    </Row>

    <Row>
      <Col xs={24} lg={24} />
    </Row>
  </>
);

export default Home;
