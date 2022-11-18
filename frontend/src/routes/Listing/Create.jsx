import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ListingForm from './ListingForm';
import { BACKEND_ROOT } from '../Root'

import { Title } from '@mantine/core'
function Create () {
  const [user,] = useOutletContext();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ((!user) && !localStorage.getItem('user')) {
      navigate('/');
    }
  }, [user]);

  const handleCreate = (listing) => {
    const requiredFields = {
      title: listing.title,
      price: listing.price,
      street: listing.address.street,
      city: listing.address.city,
      state: listing.address.state,
      postcode: listing.address.postcode,
      country: listing.address.country
    };

    for (const [k, v] of Object.entries(requiredFields)) {
      if (!v) {
        setError('Please fill in the ' + k + ' field');
        return;
      }
    }
    if (!listing.thumbnail) {
      setError('Please select a thumbnail');
      return;
    }

    axios.post(BACKEND_ROOT + 'listings/new', listing, {
      headers: {
        Authorization: 'Bearer ' + user.token
      },
      timeout: 10000
    })
      .then(res => {
        navigate('/listing/my');
      }).catch(err => {
        console.log(err.response.data.error);
        setError(err.response.data.error);
      });
  }

  return (
        <>
        <Title>Create Listing</Title>
        <ListingForm error={error} onSubmit={handleCreate} />
        </>
  );
}

export default Create;
