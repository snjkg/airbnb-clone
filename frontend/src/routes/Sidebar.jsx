import React from 'react';
import { Navbar, NavLink, MediaQuery } from '@mantine/core';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Sidebar (props) {
  const location = useLocation();
  const navigate = useNavigate();

  return (<MediaQuery smallerThan="sm" styles={{ height: 'auto' }}>
  <Navbar withBorder={false} width={{ sm: 150, lg: 200 }} >
  <NavLink
    component={Link} to='/'
    active={location.pathname === '/'}
    label='Listings'
  />

  {!props.user && <NavLink
    component={Link} to='/account/login'
    active={location.pathname === '/account/login'}
    label='Login'
    />}

  {!props.user && <NavLink
    component={Link} to='/account/register'
    active={location.pathname === '/account/register'}
    label='Register'
    />}

  {props.user && <NavLink
    component={Link} to='/listing/my'
    active={location.pathname === '/listing/my'}
    label='My Listings'
    />}

  {props.user && <NavLink
    onClick={e => {
      e.preventDefault();
      props.setUser(null);
      localStorage.clear();
      navigate('/');
    }}
    label='Logout'
  />}
  </Navbar>
  </MediaQuery>);
}

Sidebar.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func
}

export default Sidebar;
