import PropTypes from 'prop-types';
import { ServiceStatusInfo } from '@autonolas/frontend-library';
import { useApiPolling } from 'common-util/api/useHook';

const MINUTE = 60 * 1000;

const URLS = [
  'https://453734f64495a98c.agent.propel.autonolas.tech/healthcheck',
  'https://b72085557196153b.agent.propel.autonolas.tech/healthcheck',
  'https://6ac61f0440937ef2.agent.propel.autonolas.tech/healthcheck',
  'https://957d300b1f939371.agent.propel.autonolas.tech/healthcheck',
];

const Footer = ({ onMinimizeToggle }) => {
  const { isHealthy } = useApiPolling(URLS, MINUTE);

  return (
    <ServiceStatusInfo
      appType="govkit"
      onMinimizeToggle={onMinimizeToggle}
      isHealthy={isHealthy}
    />
  );
};

Footer.propTypes = {
  onMinimizeToggle: PropTypes.func.isRequired,
};

export default Footer;
