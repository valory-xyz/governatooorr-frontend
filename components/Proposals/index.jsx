import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography } from 'antd/lib';
import { SERVICE_ENDPOINT } from 'util/constants';

const { Title } = Typography;

const Proposals = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`${SERVICE_ENDPOINT}/proposals`);
        setProposals(response.data ?? []);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();
  }, []);

  return (
    <Card className="content-card">
      <Title level={3}>Governance Participation</Title>
      {proposals.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="text-left">Proposal</th>
              <th className="text-left">Governor</th>
              <th className="text-left">Active?</th>
              <th className="text-left">Governatooorr Vote</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal, index) => (
              <tr key={index}>
                <td className="text-left">{proposal.title}</td>
                <td className="text-left">{proposal.governor.name}</td>
                <td>{proposal.active ? 'Pending' : 'Closed'}</td>
                <td>{proposal.vote ? proposal.vote : 'No vote yet'}</td>
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
