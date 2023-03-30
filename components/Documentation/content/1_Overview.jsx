import { Typography } from 'antd/lib';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph, Text } = Typography;

const Overview = () => (
  <>
    <div id={DOCS_SECTIONS.overview}>
      <Title level={2}>Overview</Title>

      <Paragraph>Governatooorr is a revolutionary autonomous service built using Autonolas technology that empowers users to delegate their tokens and influence decisions in Decentralized Autonomous Organizations (DAOs). The platform is designed to provide users with a seamless experience while participating in DAO governance.</Paragraph>

      <Paragraph>Users can delegate their tokens to the Governatooorr autonomous service, specifying their voting preference as either "good" or "bad." A "good" preference means the service will vote for options that are beneficial to the DAO, while a "bad" preference directs the service to vote for options that are not the most advantageous for the DAO.</Paragraph>

      <Paragraph>The Governatooorr service actively monitors relevant DAO forums for new proposals. Leveraging a cutting-edge Large Language Model (LLM) on the backend, it is able to analyze these proposals and suggest the most appropriate voting option based on the user's preference. The service then executes the vote accordingly, streamlining the decision-making process and ensuring that the user's voice is heard.</Paragraph>

      <Paragraph>To manage prompts and orchestrate the language processing, Governatooorr utilizes Langchain, a powerful Python library. Learn more about Langchain at https://python.langchain.com/en/latest/.</Paragraph>

<Paragraph>In summary, Governatooorr is an innovative autonomous service that allows users to delegate their tokens and influence the future of DAOs according to their voting preferences. By employing advanced language models and Autonolas technology, Governatooorr simplifies the voting process and helps users to effectively participate in the dynamic world of decentralized governance.</Paragraph>

      <br />
      <br />
      <br />
    </div>
  </>
);

export default Overview;
