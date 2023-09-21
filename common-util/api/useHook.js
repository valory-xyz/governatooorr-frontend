import { useEffect, useState } from 'react';

const MINUTE = 60 * 1000;

/**
 *
 * @param {string | Array<string>} apiEndpoint
 * @param {number} pollingInterval
 * @returns {Object} data
 */
export const useApiPolling = (apiEndpoint, pollingInterval = MINUTE) => {
  const [data, setData] = useState(null);

  // function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(apiEndpoint);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use useEffect to trigger polling at the specified interval
  useEffect(() => {
    const pollingTimer = setInterval(async () => {
      await fetchData(); // Fetch data at the specified interval
    }, pollingInterval);

    // Initial fetch of data
    fetchData();

    // Cleanup the polling interval when the component unmounts
    return () => clearInterval(pollingTimer);
  }, [apiEndpoint, pollingInterval]);

  return data;
};
