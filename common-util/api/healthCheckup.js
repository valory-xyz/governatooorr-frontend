const URLS = [
  'https://453734f64495a98c.agent.propel.autonolas.tech/healthcheck',
  'l',
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
export const isServiceHealthy = async () => {
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

// const checkIfTransitioning = (responses) => {
//   const responseWithTransitioning = responses.filter((x) => !!x.is_transitioning_fast);
//   return responseWithTransitioning.length >= 3;
// };

// const pollUntilTransitioning = async () => {

//   try {
//   const isHealthy = await Promise.all(URLS.map(fetchUrl));

//   } catch (error) {

//   }

//   fetchAllUrls(urls).then((responses) => {
//     if (checkIfTransitioning(responses)) {
//       console.log('Transitioning');
//     } else {
//       setTimeout(pollUntilTransitioning, 5000);
//     }
//   });
// };

// pollUntilTransitioning();
