import { notifyError } from 'common-util/functions';
import { useEffect, useState } from 'react';

const URLS = [
  'https://453734f64495a98c.agent.propel.autonolas.tech/healthcheck',
  'https://b72085557196153b.agent.propel.autonolas.tech/healthcheck',
  'https://6ac61f0440937ef2.agent.propel.autonolas.tech/healthcheck',
  'https://957d300b1f939371.agent.propel.autonolas.tech/healthcheck',
];

const fetchUrl = (URL) => fetch(URL).then((response) => response.json());

const getHealthCheckData = async () => {
  const responses = await Promise.all(URLS.map(fetchUrl));
  const responseWithTransitioning = responses.filter((x) => !!x.is_transitioning_fast);

  return {
    data: responseWithTransitioning,
    healthyAgentsCount: responseWithTransitioning.length,

    /** If 3 or more agents are transitioning, then it is healthy */
    isHealthy: responseWithTransitioning.length >= 3,
  };
};

/**
 * polling healthcheck every 2 seconds when backend is disrupted
 */
const pollHealthCheckup = async () => new Promise((resolve, reject) => {
  const interval = setInterval(async () => {
    try {
      const response = await getHealthCheckData();
      if (response.isHealthy) {
        clearInterval(interval);
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  }, 2 * 1000);
});

/**
 * checks if the service is healthy and
 * polls for healthcheck every 2 seconds when backend is disrupted
 */
export const isServiceHealthyRequest = async () => {
  const { isHealthy, healthyAgentsCount } = await getHealthCheckData();

  if (isHealthy) {
    return true;
  }

  window.console.warn(
    `Only ${healthyAgentsCount} out of ${URLS.length} agents are healthy. Polling for healthcheck...`,
  );

  const { isHealthy: isHealthyAfterPolling } = await pollHealthCheckup();
  return isHealthyAfterPolling;
};

/**
 * useHealthCheckup hook to check if the service is healthy
 * and poll for healthcheck every 2 seconds when backend is disrupted
 */
const useHealthCheckup = ({}) => {
  const [isServiceHealthy, setIsServiceHealthy] = useState(null);

  // fetch healthcheck on first render
  useEffect(() => {
    const checkServiceHealth = async () => {
      try {
        const response = await isServiceHealthyRequest();
        setIsServiceHealthy(response);
      } catch (error) {
        notifyError('Error on fetching healthcheck');
        console.error(error);
      }
    };

    checkServiceHealth();
  }, []);

  // poll healthcheck every 1 minute
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await isServiceHealthyRequest();
        setIsServiceHealthy(response);
      } catch (error) {
        notifyError('Error on fetching healthcheck');
        setIsServiceHealthy(false);
        console.error(error);
      }
    }, MINUTE);

    return () => clearInterval(interval);
  }, []);

  return isServiceHealthy;
};
