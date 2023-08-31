import PropTypes from 'prop-types';
import { ServiceStatusInfo } from '@autonolas/frontend-library';

const Footer = ({ onMinimizeToggle }) => (
  <ServiceStatusInfo appType="govkit" onMinimizeToggle={onMinimizeToggle} />
);

Footer.propTypes = {
  onMinimizeToggle: PropTypes.func.isRequired,
};

export default Footer;
