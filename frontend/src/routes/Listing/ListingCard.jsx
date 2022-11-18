import React, { useState } from 'react'
import { Card, Image, Text, Badge, NavLink, Group, Rating, Tooltip, Title, Center, Divider } from '@mantine/core';
import { IconDoor, IconBed, IconBath } from '@tabler/icons';
import { Link, useOutletContext } from 'react-router-dom';
import Publish from './Publish';
import PropTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_ROOT } from '../Root'

function ListingCard (props) {
  const [user,] = useOutletContext();

  const [showPublish, setShowPublish] = useState(false);
  const unpublish = (e) => {
    axios.put(BACKEND_ROOT + 'listings/unpublish/' + props.listing.id, {}, {
      headers: {
        Authorization: 'Bearer ' + user.token
      },
      timeout: 10000
    })
      .then(res => {
        props.loadListings();
      }).catch(err => {
        console.log(err.response.data.error);
      });
  }
  const deleteListing = (e) => {
    axios.delete(BACKEND_ROOT + 'listings/' + props.listing.id, {
      headers: {
        Authorization: 'Bearer ' + user.token
      },
      timeout: 10000
    })
      .then(res => {
        props.loadListings();
      }).catch(err => {
        console.log(err.response.data.error);
      });
  }
  const url = '/listing/view/' + props.listing?.id + (props.filters?.dates && props.filters?.dates[0] && props.filters?.dates[1] ? '?f=' + props.filters?.dates[0] + '&t=' + props.filters?.dates[1] : '');
  return (<Card shadow="sm" p="lg" radius="md" withBorder>

    <Card.Section component={Link} to={url}>
        <Image height='33vh' src={props.listing?.thumbnail} alt={props.listing?.title} />
    </Card.Section>
    <Group position="apart" mt="md" mb="xs" component={Link} to={url}>
        <Title order={4}>{props.listing?.title}</Title>
    </Group>
    <Group position="apart" mt="md" mb="xs">
        <><Rating value={props.listing?.rating} fractions={2} readOnly />
        <Text>{props.listing?.reviews.length} Reviews</Text></>

    </Group>
    <Group position="apart" mt="md" mb="xs">
        <Text>${props.listing?.price && props.listing?.price }/night</Text>
        <Text>{props.listing?.metadata?.type && props.listing?.metadata?.type }</Text>
    </Group>

    <Group position="apart" mt="md" mb="xs">
        <Text>Amenities: {props.listing?.metadata?.amenities.length === 0 ? 'None Specified' : props.listing?.metadata?.amenities.join(', ') }</Text>
    </Group>
    <Group position="apart" mt="md" mb="xs">
        <Tooltip color='blue' label='Bedrooms'><Badge sx={{ paddingLeft: 10 }} size="xl" radius="xl" color="teal" leftSection={<IconDoor alt="Bedrooms" size={18}/>} styles={{ leftSection: { marginTop: '5px' } }} >
            <Text>{props.listing?.metadata?.bedrooms && props.listing?.metadata?.bedrooms.length }</Text>
        </Badge></Tooltip>
        <Tooltip color='blue' label='Beds'><Badge sx={{ paddingLeft: 10 }} size="xl" radius="xl" color="lime" leftSection={<IconBed alt="Beds" />} styles={{ leftSection: { marginTop: '5px' } }} >
            <Text>{props.listing?.metadata?.bedrooms && props.listing?.metadata?.bedrooms.map(x => x.length).reduce((t, a) => t + a, 0) }</Text>
        </Badge></Tooltip>
        <Tooltip color='blue' label='Bathrooms'><Badge sx={{ paddingLeft: 10 }} size="xl" radius="xl" color="cyan" leftSection={<IconBath alt="Bathrooms" />} styles={{ leftSection: { marginTop: '5px' } }} >
            <Text>{props.listing?.metadata?.bathrooms && props.listing?.metadata?.bathrooms }</Text>
        </Badge></Tooltip>
    </Group>

    {user?.email === props.listing.owner &&

        <Card.Section mt={25}>
            <Divider />
            <Center><Title mt={5} order={6}>Listing Options</Title></Center>
            {props.listing.published
              ? <NavLink sx={{ textAlign: 'center' }} onClick={unpublish} active mt={10} label='Unpublish' />
              : <NavLink sx={{ textAlign: 'center' }} onClick={x => { setShowPublish(true) }} active mt={10} label='Publish' /> }
            <NavLink sx={{ textAlign: 'center' }} active mt={1} component={Link} to={'/listing/edit/' + props.listing?.id} label='Edit' />
            <NavLink sx={{ textAlign: 'center' }} active mt={1} label='Bookings' component={Link} to={'/listing/booking/' + props.listing?.id} />
            <NavLink sx={{ textAlign: 'center' }} active mt={1} label='Delete' onClick={x => { x.preventDefault(); deleteListing() }} />
            {showPublish && <Publish loadListings={props.loadListings} listing={props.listing} onClose={x => { setShowPublish(false) }} />}

        </Card.Section>
    }
  </Card>);
}

ListingCard.propTypes = {
  listing: PropTypes.object,
  filters: PropTypes.object,
  loadListings: PropTypes.func
}

export default ListingCard
