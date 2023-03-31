import { Row, Col, Card } from 'antd/lib';
import Delegate from 'components/Delegate';
import MyDelegations from 'components/MyDelegations';
import Proposals from 'components/Proposals';

const delegateeAddress = '0x94825185b1dD96918635270ddA526254a0F2fbf1';

const Home = () => (
  <>
    <Row>
      <Col xs={24} lg={10}>
        <Delegate delegateeAddress={delegateeAddress} />
        <MyDelegations />

        <Card className="form-card">
          {`Donate ETH for gas: ${delegateeAddress}`}
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
