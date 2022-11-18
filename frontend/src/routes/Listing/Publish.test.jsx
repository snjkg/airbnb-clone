import React, { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Publish from './Publish';
import axios from 'axios';
import * as rrd from 'react-router-dom';

const listing = { id: 0, availability: [] }

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock('react-router-dom');

test('attempt publish with no avilability added', async () => {
  rrd.useOutletContext.mockReturnValue([{ token: '' }, null])
  render(<Publish listing={listing} />)

  await screen.findByText('Availabilities');
  await screen.findByText('No dates selected');
  await userEvent.click(screen.getByText('Save'))

  expect(screen.getByText('At least one availability range is required')).toBeDefined();
})

test('pass callback props and add single availability and save will runs callbacks', async () => {
  rrd.useOutletContext.mockReturnValue([{ token: '' }, null])
  const refresh = jest.fn();
  const close = jest.fn();
  jest.spyOn(axios, 'put').mockResolvedValueOnce({});
  render(<Publish onClose={close} loadListings={refresh} listing={listing}/>)

  await screen.findByText('Availabilities');
  await screen.findByText('No dates selected');
  await userEvent.click(screen.getByText('Add'));
  await userEvent.click(screen.getByText('Save'));
  expect(close).toHaveBeenCalledTimes(1);
  expect(refresh).toHaveBeenCalledTimes(1);
})

test('pass  callback props and add single availability and close will only rune close callback', async () => {
  rrd.useOutletContext.mockReturnValue([{ token: '' }, null])
  const refresh = jest.fn();
  const close = jest.fn();
  render(<Publish onClose={close} loadListings={refresh} listing={listing}/>)

  await screen.findByText('Availabilities');
  await screen.findByText('No dates selected');
  await userEvent.click(screen.getByLabelText('close'));
  expect(close).toHaveBeenCalledTimes(1);
  expect(refresh).toHaveBeenCalledTimes(0);
})

test('return error if trying to add overlapping availability', async () => {
  rrd.useOutletContext.mockReturnValue([{ token: '' }, null])
  render(<Publish listing={listing} />)

  await screen.findByText('Availabilities');
  await screen.findByText('No dates selected');
  await userEvent.click(screen.getByText('Add'))
  await userEvent.click(screen.getByText('Add'))

  expect(screen.getByText('Date range overlaps with existing availability')).toBeDefined();
})
