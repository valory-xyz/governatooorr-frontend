import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography } from 'antd/lib';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { SERVICE_ENDPOINT } from 'util/constants';

const { Title } = Typography;

const MyDelegations = () => {
  const [delegations, setDelegations] = useState([]);

  const account = useSelector((state) => get(state, 'setup.account'));

  useEffect(() => {
    const getDelegations = async () => {
      try {
        const response = await axios.get(
          `${SERVICE_ENDPOINT}/delegations/${account}`,
        );
        const { data } = response;
        setDelegations(data.data);
      } catch (error) {
        console.error('Error retrieving delegations:', error);
      }
    };

    if (account) {
      getDelegations();
    }
  }, [account]);

  return (
    <Card className="form-card">
      <Title level={3}>My Delegations</Title>
      {account ? (
        <>
          {delegations?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th className="text-left">Delegated Token</th>
                  <th className="text-left">Voting Preference</th>
                </tr>
              </thead>
              <tbody>
                {delegations.map((delegation, index) => (
                  <tr key={index}>
                    <td className="text-left">
                      <a
                        href={`https://etherscan.io/address/${delegation.delegatedToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${delegation.delegatedToken.slice(
                          0,
                          6,
                        )}...${delegation.delegatedToken.slice(-4)}`}
                      </a>
                    </td>
                    <td className="text-left">
                      {delegation.votingPreference.charAt(0).toUpperCase()
                        + delegation.votingPreference.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No delegations found for this address.</p>
          )}
        </>
      ) : (
        <div>To see your delegations, connect a wallet</div>
      )}
    </Card>
  );
};

export default MyDelegations;
