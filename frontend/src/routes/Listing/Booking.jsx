import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { BACKEND_ROOT } from '../Root'

import { Title, Text, Table, Divider, Grid, Button } from '@mantine/core'

function Booking () {
  const [user,] = useOutletContext();
  const [, setError] = useState(null);
  const [listing, setListing] = useState({});
  const [bookings, setBookings] = useState([]);
  const { id } = useParams();

  const acceptBooking = (e) => {
    axios.put(BACKEND_ROOT + 'bookings/accept/' + e, {
    }, {
      headers: {
        Authorization: 'Bearer ' + user.token
      },
      timeout: 10000
    })
      .then(res => {
        loadBookings();
      }).catch(err => {
        console.log(err.response.data.error);
      });
  }
  const declineBooking = (e) => {
    axios.put(BACKEND_ROOT + 'bookings/decline/' + e, {
    }, {
      headers: {
        Authorization: 'Bearer ' + user.token
      },
      timeout: 10000
    })
      .then(res => {
        loadBookings();
      }).catch(err => {
        console.log(err.response.data.error);
      });
  }
  const loadListing = () => {
    axios.get(BACKEND_ROOT + 'listings/' + id, {
      headers: {
      },
      timeout: 10000
    })
      .then(res2 => {
        setListing({
          id,
          rating: res2.data.listing.reviews.length === 0 ? 2.5 : res2.data.listing.reviews.map(x => x.rating).reduce((a, b) => a + b, 0) / res2.data.listing.reviews.length,
          ...res2.data.listing
        });
      }).catch(err => {
        console.log(err.response.data.error);
        setError(err.response.data.error);
      });
  }
  const loadBookings = () => {
    axios.get(BACKEND_ROOT + 'bookings', {
      headers: {
        Authorization: 'Bearer ' + user.token
      },
      timeout: 10000
    })
      .then(res => {
        setBookings(res.data.bookings.filter(x => x.listingId.toString() === id));
      }).catch(err => {
        console.log(err.response.data.error);
        setError(err.response.data.error);
      });
  }
  useEffect(() => {
    // console.log(user);
    loadListing();
  }, []);
  useEffect(() => {
    if (user != null) {
      loadBookings();
    }
  }, [user, listing]);
  return (
        <>
        <Title>Bookings: {listing.title}</Title>

        <Grid justify='space-between' mt='md' mb='xs' align='start'>
            <Grid.Col span={12}>
                <Divider label='Summary' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
            </Grid.Col>
            <Grid.Col xs={6} span={12}>
                <Text weight={500}>Address:</Text>
                <Text>{listing.address?.street} {listing.address?.city} <br /> {listing.address?.state} {listing.address?.postcode} {listing.address?.country}</Text>
                <Text weight={500}>Type:</Text>
                <Text>{listing.metadata?.type && listing.metadata?.type }</Text>
            </Grid.Col>
            <Grid.Col xs={6} span={12}>
                <Text weight={500}>Days listed:</Text>
                <Text>{ Math.floor((new Date().getTime() - new Date(listing.postedOn).getTime()) / (24 * 3600 * 1000)) }</Text>
                <Text weight={500}>Days booked this year:</Text>
                <Text>{ bookings.filter(b => (b.status === 'accepted' && new Date(b.dateRange.from)).getFullYear() === (new Date()).getFullYear()).reduce((partialSum, a) => partialSum + Math.floor((new Date(a.dateRange.to).getTime() - new Date(a.dateRange.from).getTime()) / (24 * 3600 * 1000)), 0)}</Text>
                <Text weight={500}>Revenue:</Text>
                <Text>${ bookings.filter(b => (b.status === 'accepted' && new Date(b.dateRange.from)).getFullYear() === (new Date()).getFullYear()).reduce((partialSum, a) => partialSum + a.totalPrice, 0) }</Text>
            </Grid.Col>
        </Grid>
        <Grid justify='space-between' mt='md' mb='xs' align='start'>
            <Grid.Col span={12}>
                <Divider label='Bookings' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
                <Table>
                    <thead><tr><th>Booking ID</th><th>Dates</th><th>Total Price</th><th>Booking User</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        {bookings.map(x => <tr key={x.id}>

                            <td>{x.id}</td>
                            <td>{new Date(x.dateRange.from).toLocaleDateString()} - {new Date(x.dateRange.to).toLocaleDateString()}</td>
                            <td>${x.totalPrice}</td>
                            <td>{x.owner}</td>
                            <td>{x.status}</td>
                            <td>{x.status === 'pending' && <><Button mr={3} mb={2} onClick={y => acceptBooking(x.id)}>Accept</Button><Button color='red' onClick={y => declineBooking(x.id)}>Decline</Button></>}</td>

                        </tr>)}

                    </tbody>
                </Table>
            </Grid.Col>
        </Grid>

        </>
  );
}

export default Booking;
