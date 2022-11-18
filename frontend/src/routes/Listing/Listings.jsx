import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ListingCard from './ListingCard';
import { BACKEND_ROOT } from '../Root';
import { Grid, Alert, Text, Center } from '@mantine/core';
import PropTypes from 'prop-types';

function Listings (props) {
  const [user,] = useOutletContext();
  const navigate = useNavigate()

  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  const loadListings = () => {
    setListings([]);
    if ((!user) && !localStorage.getItem('user')) {
      navigate('/');
    }

    axios.get(BACKEND_ROOT + 'listings', {
      headers: {
      },
      timeout: 10000
    })
      .then(res => {
        // console.log(res);
        res.data.listings.forEach(x => {
          axios.get(BACKEND_ROOT + 'listings/' + x.id, {
            headers: {
            },
            timeout: 10000
          })
            .then(res2 => {
              setListings(listings => [...listings, {
                id: x.id,
                rating: x.reviews.length === 0 ? 2.5 : x.reviews.map(y => y.rating).reduce((a, b) => a + b, 0) / x.reviews.length,
                ...res2.data.listing
              }]);
            }).catch(err => {
              console.log(err.response.data.error);
              setError(err.response.data.error);
            });
        });
      }).catch(err => {
        setError(err.response.data.error);
      });
  }
  useEffect(() => {
    loadListings();
  }, []);
  useEffect(() => {
    setFilteredListings(listings.filter(applyFilters));
  }, [listings, props.filters]);

  /* useEffect(()=>{
        console.log('filterprop');
        console.log(props.filters?.dates[0] ?  props.filters?.dates[0] : null);
        console.log(props.filters?.dates[1] ?  props.filters?.dates[1] : null);
        }

    ,[props.filters]); */

  const applyFilters = (x) => {
    if (props.me && user.email !== x.owner) {
      return false;
    }
    if (!props.me && user && user.email === x.owner) {
      return false;
    }
    if (!props.me && !x.published) {
      return false;
    }
    if (props.filters?.term && !x.title.toLowerCase().includes(props.filters.term.toLowerCase()) && !x.address.city.toLowerCase().includes(props.filters.term.toLowerCase())) {
      return false;
    }
    if (props.filters?.bedrooms && x.metadata.bedrooms.length < props.filters.bedrooms[0]) {
      return false;
    }
    if (props.filters?.bedrooms && x.metadata.bedrooms.length > props.filters.bedrooms[1] && props.filters.bedrooms[1] !== 15) {
      return false;
    }
    if (props.filters?.price && x.price < props.filters.price[0]) {
      return false;
    }
    if (props.filters?.price && x.price > props.filters.price[1] && props.filters.price[1] !== 1500) {
      return false;
    }
    if (props.filters?.isRatingSelected && x.rating < props.filters.rating[0]) {
      return false;
    }
    if (props.filters?.isRatingSelected && x.rating > props.filters.rating[1]) {
      return false;
    }

    if (props.filters?.dates && props.filters?.dates[0] && props.filters?.dates[1]) {
      let d = new Date(props.filters?.dates[0]);
      const d1 = new Date(props.filters?.dates[1]);
      while (d <= d1) {
        let found = false;
        for (const a of x.availability) {
          const a0 = new Date(a.start);
          const a1 = new Date(a.end);
          // exclude last day of availability, unless we are checking out that day
          if (d < props.filters?.dates[1]) {
            a1.setDate(a1.getDate() - 1);
          }
          if (d >= a0 && d <= a1) {
            found = true;
            break;
          }
        }
        if (found) {
          d = new Date(d.setDate(d.getDate() + 1));
        } else {
          return false;
        }
      }
    }

    return true;
  }

  return (

        <>
        {error && <Alert mt={15}
        color='violet'
        title='Error'
      >{error}</Alert>}
        {filteredListings.length === 0 && <Center><Text>There are no listings to show.</Text></Center>}
        <Grid>
             {filteredListings.sort(props.sort ?? ((a, b) => (b.id - a.id))).map((x, i) => (
             <Grid.Col id={x.id} key={x.id} order={i} sm={6} md={4}>
                <ListingCard filters={props.filters} listing={x} loadListings={loadListings} />
             </Grid.Col>
             ))}
        </Grid>
        </>
  );
}

Listings.propTypes = {
  filters: PropTypes.object,
  sort: PropTypes.func,
  me: PropTypes.bool
}

export default Listings;
