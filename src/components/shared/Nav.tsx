import { Navbar, Nav as NavBootstrap } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { navList } from '../../util/util';
import { AuthContext } from '../context/AuthContext';
import classes from './Nav.module.css';

interface NavInterface {
  children?: ReactNode;
}

const Nav: React.FC<NavInterface> = () => {
  const [scrolled, setScrolled] = useState(false);
  const { logout, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    const timerId = setTimeout(() => {
      window.addEventListener('scroll', () => {
        const offset = window.scrollY;
        if (offset > 50) setScrolled(true);
        else setScrolled(false);
      });
    }, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, [scrolled]);

  const filterNav = isAdmin
    ? navList
    : navList.filter(nav => nav.to !== '/suppliers');

  return (
    <Navbar
      className={`d-flex justify-content-around ${
        scrolled ? classes.fixed : ''
      }`}
    >
      <NavBootstrap>
        {filterNav.map(nav => (
          <NavBootstrap.Item key={nav.id}>
            <Link to={nav.to} className="nav-link custom-font-size">
              {nav.body}
            </Link>
          </NavBootstrap.Item>
        ))}
        <NavBootstrap.Item className="nav-link" onClick={logout}>
          تسجيل الخروج
        </NavBootstrap.Item>
      </NavBootstrap>
    </Navbar>
  );
};

export default Nav;
