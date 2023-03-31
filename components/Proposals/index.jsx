import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import Title from "antd/lib/typography/Title";
import { useSelector } from "react-redux";
import { get } from "lodash";

const serviceEndpoint =
  "https://WrithingDependentApplicationprogram.oaksprout.repl.co";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`${serviceEndpoint}/proposals`);
        setProposals(response.data.data ?? []);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, []);

  return (
    <div className="card content-card">
      <Title className="u-color-white">Proposals</Title>
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
                  {proposal.voteStats.map((vote, index) => (
                    <span key={index}>{vote.support}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No proposals found.</p>
      )}
    </div>
  );
};

export default Proposals;
