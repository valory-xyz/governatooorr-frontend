import PropTypes from 'prop-types';

const Navbar = ({
  logo,
}) => (
  <div className="navbar">
    <div>{logo}</div>
  </div>
);

Navbar.propTypes = {
  logo: PropTypes.node.isRequired,
};

export default Navbar;
