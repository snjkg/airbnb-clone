import React, { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListingForm from './ListingForm';

test('form is a dumb form; it runs the event handler regardless of whether all fields are filled', async () => {
  const handleCreate = jest.fn();
  render(<ListingForm onSubmit={handleCreate} />);
  await userEvent.type(screen.getByLabelText('Listing Title'), 'Modern Apartment');
  await userEvent.type(screen.getByLabelText('Price'), '100');
  // not all fields filled

  await userEvent.click(screen.getByText('Submit'));
  expect(handleCreate).toHaveBeenCalledTimes(1);
})

test('form displays whatever error is passed into it', async () => {
  render(<ListingForm error={'Sample error'} />);
  expect(screen.getByText('Sample error')).toBeDefined();
})

test('form prefills listing passed into', async () => {
  const listing = {
    title: 'My new apartment',
    address: {
      street: '1 High St',
      city: 'Kensington',
      state: 'NSW',
      postcode: '2033',
      country: 'Australia'
    },
    price: '100',
    thumbnail: null,
    metadata: { photos: [], bathrooms: 1, bedrooms: [['Single']], amenities: [] }
  };
  render(<ListingForm listing={listing} />);
  expect(screen.getByLabelText('Listing Title')).toHaveValue('My new apartment');
  expect(screen.getByLabelText('Price')).toHaveValue('100');
  expect(screen.getByLabelText('Street')).toHaveValue('1 High St');
  expect(screen.getByLabelText('City')).toHaveValue('Kensington');
  expect(screen.getByLabelText('State')).toHaveValue('NSW');
  expect(screen.getByLabelText('Postcode')).toHaveValue('2033');
  expect(screen.getByLabelText('Country')).toHaveValue('Australia');
})
