import Listings from './Listings';
import { Button, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import React from 'react';
function MyListings (props) {
  return (<>
    <Title mb={12}>My Listings</Title>
    <Button mb={12} component={Link} to='/listing/create'>Create Listing</Button>
    <Listings me />
    </>);
}

export default MyListings;
