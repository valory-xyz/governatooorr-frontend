import { notifyError } from 'common-util/functions';
import { useEffect, useState } from 'react';

const fetchUrl = (URL) => fetch(URL).then((response) => response.json());

/**
 *
 * @param {string | Array<string>} apiEndpoints
 * @param {number} pollingInterval
 * @returns {Object} data
 */
export const useApiPolling = (apiEndpoints, pollingInterval = 60 * 1000) => {
  const [data, setData] = useState([]);

  // function to fetch data from the API
  const fetchData = async () => {
    try {
      const responses = await Promise.all(apiEndpoints.map(fetchUrl));
      const jsonData = await responses.json();
      setData(jsonData);
    } catch (error) {
      notifyError('Error fetching health checkup');
      console.error(error);
    }
  };

  // Trigger polling at the specified interval
  useEffect(() => {
    fetchData(); // Initial fetch of data (1st render)

    const pollingTimer = setInterval(async () => {
      await fetchData(); // Fetch data at the specified interval
    }, pollingInterval);

    // Cleanup the polling interval when the component unmounts
    return () => clearInterval(pollingTimer);
  }, [pollingInterval]);

  const healthyServiceCount = data.filter((x) => !!x.is_transitioning_fast);
  const isHealthy = healthyServiceCount >= 3; /** If >= 3 agents are transitioning, then healthy */

  return { isHealthy, data };
};
