import { Navbar, Nav as NavBootstrap } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { navList } from '../util/util';

interface NavInterface {
  children?: ReactNode;
}

const Nav: React.FC<NavInterface> = () => {
  return (
    <Navbar className="d-flex justify-content-around">
      <NavBootstrap>
        {navList.map(nav => (
          <NavBootstrap.Item key={nav.id}>
            <Link to={nav.to} className="nav-link">
              {nav.body}
            </Link>
          </NavBootstrap.Item>
        ))}
        <NavBootstrap.Item className="nav-link">تسجيل الخروج</NavBootstrap.Item>
      </NavBootstrap>
    </Navbar>
  );
};

export default Nav;
