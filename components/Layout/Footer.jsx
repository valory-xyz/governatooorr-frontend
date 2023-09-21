import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ServiceStatusInfo } from '@autonolas/frontend-library';
import { isServiceHealthyRequest } from 'common-util/api/healthCheckup';
import { notifyError } from 'common-util/functions';

const MINUTE = 60 * 1000;

const Footer = ({ onMinimizeToggle }) => {
  const [isServiceHealthy, setIsServiceHealthy] = useState(false);

  // fetch healthcheck on first render
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await isServiceHealthyRequest();
        setIsServiceHealthy(response);
      } catch (error) {
        notifyError('Error on fetching healthcheck');
        console.error(error);
      }
    };

    getData();
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

  return (
    <ServiceStatusInfo
      appType="govkit"
      onMinimizeToggle={onMinimizeToggle}
      isHealthy={isServiceHealthy}
    />
  );
};

Footer.propTypes = {
  onMinimizeToggle: PropTypes.func.isRequired,
};

export default Footer;
