import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography } from 'antd/lib';

const { Title } = Typography;

const serviceEndpoint = 'https://WrithingDependentApplicationprogram.oaksprout.repl.co';

const Proposals = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`${serviceEndpoint}/proposals`);
        setProposals(response.data.data ?? []);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();
  }, []);

  return (
    <Card className="content-card">
      <Title level={2}>Past Votes</Title>
      {proposals.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="text-left">Title</th>
              <th className="text-left">Governor</th>
              <th className="text-left">Support</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal, index) => (
              <tr key={index}>
                <td className="text-left">{proposal.title}</td>
                <td className="text-left">{proposal.governor.name}</td>
                <td>
                  {proposal.voteStats.map((vote, otherIndex) => (
                    <span key={otherIndex}>{vote.support}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No proposals found.</p>
      )}
    </Card>
  );
};

export default Proposals;
