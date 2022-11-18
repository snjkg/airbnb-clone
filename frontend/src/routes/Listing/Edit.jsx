import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import ListingForm from './ListingForm';
import { BACKEND_ROOT } from '../Root'

import { Title } from '@mantine/core'

function ListingCreate () {
  const [user,] = useOutletContext();
  const [error, setError] = useState(null);
  const [initListing, setInitListing] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleEdit = (listing) => {
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

    axios.put(BACKEND_ROOT + 'listings/' + id, listing, {
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
  useEffect(() => {
    axios.get(BACKEND_ROOT + 'listings/' + id, {
      headers: {
      },
      timeout: 10000
    })
      .then(res2 => {
        setInitListing(res2.data.listing);
      }).catch(err => {
        console.log(err.response.data.error);
        setError(err.response.data.error);
      });
  }, []);
  return (
        <>
        <Title>Edit Listing</Title>
        {initListing && <ListingForm listing={initListing} error={error} onSubmit={handleEdit} />}
        </>
  );
}

export default ListingCreate;
