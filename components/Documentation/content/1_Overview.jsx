/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import { Typography } from 'antd/lib';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

const Overview = () => (
  <>
    <Title style={{ color: 'white' }}>Docs</Title>
    <div id={DOCS_SECTIONS.overview}>
      <Title level={3}>Overview</Title>
      <p>
        Governatooorr is a revolutionary autonomous service built using
        {' '}
        <a href="https://autonolas.network">Autonolas</a>
        {' '}
        technology that
        empowers users to delegate their tokens and influence decisions in
        Decentralized Autonomous Organizations (DAOs). The platform is designed
        to provide users with a seamless experience while participating in DAO
        governance. Please note that Governatooorr is not meant to be taken too
        seriously in its current form.
      </p>

      <p>
        Users can delegate their tokens to the Governatooorr autonomous service,
        specifying their voting preference as either "good" or "evil." A "good"
        preference means the service will vote for options that are beneficial
        to the DAO, while an "evil" preference directs the service to vote for
        options that are not the most advantageous for the DAO.
      </p>

      <p>
        The Governatooorr service actively monitors relevant DAO forums for new
        proposals. Leveraging a cutting-edge Large Language Model (LLM) on the
        backend, it is able to analyze these proposals and suggest the most
        appropriate voting option based on the user's preference. The service
        then executes the vote accordingly, streamlining the decision-making
        process and ensuring that the user's voice is heard.
      </p>

      <p>
        To manage prompts and orchestrate the language processing, Governatooorr
        utilizes OpenAI's powerful API. Learn more about OpenAI at
        {' '}
        <a href="https://www.openai.com">https://www.openai.com</a>
        .
      </p>

      <p>
        In summary, Governatooorr is an innovative autonomous service that
        allows users to delegate their tokens and influence the future of DAOs
        according to their voting preferences. By employing advanced language
        models and Autonolas technology, Governatooorr simplifies the voting
        process and helps users to effectively participate in the dynamic world
        of decentralized governance. Keep in mind that this service is for
        experimental and entertainment purposes and should not be taken too
        seriously in its current form.
      </p>
    </div>
    <div id={DOCS_SECTIONS.delegate}>
      <Title level={3}>Delegate</Title>
      <Paragraph>Governatooorr supports two main governance systems:</Paragraph>
      <ul>
        <li>Governor Bravo</li>
        <li>Snapshot</li>
      </ul>
      Governatooorr simplifies voting in these systems, so it is not important
      to understand the difference. However for now, the way you delegate for a
      Governor Bravo-based DAO varies from a Snapshot-based DAO.
      <Title level={5}>Delegating with Governor Bravo</Title>
      <p>To delegate, you should:</p>
      <ol>
        <li>pick a token to delegate</li>
        <li>choose a voting preference – either Good or Evil</li>
        <li>submit</li>
        <li>sign your transaction</li>
        <li>congratolations – you have delegated to Governatooorr!</li>
      </ol>
      <Title level={5}>Delegating with Snapshot</Title>
      <Paragraph>
        Governatooorr supports a large number of tokens via Snapshot. To
        delegate via Snapshot:
      </Paragraph>
      <ol>
        <li>
          visit the
          {' '}
          <a
            href="https://snapshot.org/#/delegate"
            target="_blank"
            rel="noopener noreferrer"
          >
            Snapshot delegation page
          </a>
        </li>
        <li>
          type governatooorr.eth as the address into the box. Note you can
          choose to only delegate to some DAOs by toggling the "Limit delegation
          to a specific space" and specifying the spaces – i.e. DAOs – you want.
        </li>
        <li>
          hit confirm, follow the flow, and you've delegated to Governatooorr!
        </li>
      </ol>
      <Paragraph>
        Note that at this point, due to the complexity of supporting custom
        voting preferences on Snapshot, Governatooorr can only vote for the
        options it evaluates as "Good".
      </Paragraph>
    </div>
  </>
);

export default Overview;
