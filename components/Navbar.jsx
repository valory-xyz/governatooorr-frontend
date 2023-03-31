import { Menu } from 'antd/lib';
import PropTypes from 'prop-types';
import Login from './Login';

const Navbar = ({
  logo, selectedMenu, handleMenuItemClick, menuItems,
}) => (
  <div className="navbar">
    <div className="navbar__logo">{logo}</div>
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[selectedMenu]}
      onClick={handleMenuItemClick}
      items={menuItems}
      className="navbar__menu"
    />
    <div className="navbar__login">
      <Login />
    </div>
  </div>
);

Navbar.propTypes = {
  logo: PropTypes.node.isRequired,
  selectedMenu: PropTypes.string.isRequired,
  handleMenuItemClick: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Navbar;
