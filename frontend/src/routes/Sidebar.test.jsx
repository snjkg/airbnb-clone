import React, { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';
import { useNavigate, useLocation, MemoryRouter } from 'react-router-dom';
afterEach(() => {
  jest.restoreAllMocks();
});
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom'); // Step 2.
  return {
    ...original,
    useNavigate: jest.fn(),
    useLocation: jest.fn()
  };
});

test('when not logged in, login & register link appears, my listings link and logout link disappears', async () => {
  useLocation.mockReturnValue('/');
  render(<MemoryRouter><Sidebar user={null} setUser={null} /></MemoryRouter>);
  expect(screen.getByText('Login')).toBeDefined();
  expect(screen.getByText('Register')).toBeDefined();
  expect(screen.queryByText('My Listings')).toBeNull();
  expect(screen.queryByText('Logout')).toBeNull();
})

test('once logged in, login & register link disappears, my listings link and logout link appears and able to logout', async () => {
  useLocation.mockReturnValue('/');
  render(<MemoryRouter><Sidebar user={{ token: 'x' }} setUser={null} /></MemoryRouter>);
  expect(screen.getByText('My Listings')).toBeDefined();
  expect(screen.getByText('Logout')).toBeDefined();
  expect(screen.queryByText('Login')).toBeNull();
  expect(screen.queryByText('Register')).toBeNull();
})

test('once logged in, login & register link disappears, my listings link and logout link appears', async () => {
  const navigate = jest.fn();
  useLocation.mockReturnValue('/');
  useNavigate.mockReturnValue(navigate);
  const setUser = jest.fn();
  render(<MemoryRouter><Sidebar user={{ token: 'x' }} setUser={setUser} /></MemoryRouter>);
  await userEvent.click(screen.getByText('Logout'));
  expect(setUser).toHaveBeenCalledWith(null);
  expect(navigate).toHaveBeenCalledWith('/');
})
