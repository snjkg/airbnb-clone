import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams, Link, useSearchParams } from 'react-router-dom';
import { BACKEND_ROOT } from '../Root'
import { IconDoor, IconBed, IconBath, IconPhoto } from '@tabler/icons';
import { Title, Image, Group, Text, Rating, Table, Badge, Divider, Grid, Box, Modal, Anchor, Button, Center, Alert, Textarea } from '@mantine/core'
import { RangeCalendar } from '@mantine/dates';

function View () {
  const [user,] = useOutletContext();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [error, setError] = useState(null);
  const [listing, setListing] = useState({});
  const [bookings, setBookings] = useState([]);
  const [openedImage, setOpenedImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [selectedRange, setSelectedRange] = useState(() => {
    if (searchParams.get('f') && searchParams.get('t')) {
      const d0 = new Date(Number(searchParams.get('f'))).getTime();
      const d1 = new Date(Number(searchParams.get('t'))).getTime();
      return [d0, d1];
    } else {
      return [null, null];
    }
  });
  const [openedBookingConfirmation, setOpenedBookingConfirmation] = useState(false);
  const [bookingResult, setBookingResult] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(null);
  const book = (e) => {
    if (selectedRange[0] && selectedRange[1]) {
      const nights = (selectedRange[1] - selectedRange[0]) / (1000 * 3600 * 24)
      axios.post(BACKEND_ROOT + 'bookings/new/' + id, {
        dateRange: { from: selectedRange[0], to: selectedRange[1] },
        totalPrice: nights * listing.price
      }, {
        headers: {
          Authorization: 'Bearer ' + user.token
        },
        timeout: 10000
      })
        .then(res => {
          loadListing();
          setBookingResult(res.data.bookingId);
          setOpenedBookingConfirmation(true);
          loadBookings();
        }).catch(err => {
          console.log(err.response.data.error);
        });
    }
  }
  const submitReview = (e) => {
    axios.put(BACKEND_ROOT + 'listings/' + id + '/review/' + bookings.find(x => x.status === 'accepted').id, {

      review: { review, rating, date: (new Date()) }
    }, {
      headers: {
        Authorization: 'Bearer ' + user.token
      },
      timeout: 10000
    })
      .then(res => {
        loadListing();
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
        setBookings(res.data.bookings.filter(x => x.listingId === id && x.owner === user.email));
      }).catch(err => {
        console.log(err.response.data.error);
        setError(err.response.data.error);
      });
  }
  useEffect(() => {
    loadListing();
  }, []);
  useEffect(() => {
    if (user != null) {
      loadBookings();
    }
  }, [user]);
  return (
        <>
        <Title>Listing: {listing.title}</Title>
        {error && <Alert mt={15}
                    color='violet'
                    title='Error'
                  >{error}</Alert>}
        <Grid justify='space-between' mt='md' mb='xs' align='start'>
            <Grid.Col xs={6} span={12}>
                <Divider label='Details' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
                <Text weight={500}>Address:</Text>
                <Text>{listing.address?.street} {listing.address?.city} <br /> {listing.address?.state} {listing.address?.postcode} {listing.address?.country}</Text>
                <Text weight={500}>Price:</Text>
                {selectedRange[0] && selectedRange[1] && <Text>${listing.price * (selectedRange[1] - selectedRange[0]) / (1000 * 3600 * 24) } /{(selectedRange[1] - selectedRange[0]) / (1000 * 3600 * 24)} night stay</Text>}
                <Text>${listing.price && listing.price } /night</Text>
                <Text weight={500}>Type:</Text>
                <Text>{listing.metadata?.type && listing.metadata?.type }</Text>
                <Text weight={500}>Amenities:</Text>
                <Text>{listing.metadata?.amenities.length === 0 ? 'None Specified' : listing.metadata?.amenities.join(', ') }</Text>
                <Text weight={500}>Availability:</Text>
                {listing.availability?.map((x, i) => <Text key={i}>{new Date(x.start).toLocaleDateString()} - {new Date(x.end).toLocaleDateString()}</Text>) }
                <Group position="apart" mt="md" mb="xs">
                    <Box><Text weight={500}>Bedrooms</Text><Badge sx={{ paddingLeft: 10 }} size="xl" radius="xl" color="teal" leftSection={<IconDoor alt="Bedrooms" size={18}/>} styles={{ leftSection: { marginTop: '5px' } }} >
                        <Text>{listing.metadata?.bedrooms && listing.metadata?.bedrooms.length }</Text>
                    </Badge></Box>
                    <Box><Text weight={500}>Beds</Text><Badge sx={{ paddingLeft: 10 }} size="xl" radius="xl" color="lime" leftSection={<IconBed alt="Beds" />} styles={{ leftSection: { marginTop: '5px' } }} >
                        <Text>{listing.metadata?.bedrooms && listing.metadata?.bedrooms.map(x => x.length).reduce((t, a) => t + a, 0) }</Text>
                    </Badge></Box>
                    <Box><Text weight={500}>Bathrooms</Text><Badge sx={{ paddingLeft: 10 }} size="xl" radius="xl" color="cyan" leftSection={<IconBath alt="Bathrooms" />} styles={{ leftSection: { marginTop: '5px' } }} >
                        <Text>{listing.metadata?.bathrooms && listing.metadata?.bathrooms }</Text>
                    </Badge></Box>
                </Group>
            </Grid.Col>
            <Grid.Col xs={6} span={12}>
                <Divider label='Booking Request' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
                <Center><Text weight={500}>Select requested booking dates</Text></Center>

                {!user && <Center><Text>Please <Link to='/account/login'>login</Link> to book accomodation.</Text></Center>}

                {user && <><Center><RangeCalendar size='sm' allowLevelChange={false} previousMonthLabel='Previous Month' nextMonthLabel='Next Month' minDate={new Date()}
                value={[selectedRange[0] ? new Date(selectedRange[0] + new Date(selectedRange[0]).getTimezoneOffset() * 60 * 1000) : null,
                  selectedRange[1] ? new Date(selectedRange[1] + new Date(selectedRange[1]).getTimezoneOffset() * 60 * 1000) : null]}
                onChange={dr => {
                  setSelectedRange(s => ([
                    dr[0] ? new Date(dr[0].getTime() - dr[0].getTimezoneOffset() * 60 * 1000).getTime() : null,
                    dr[1] ? new Date(dr[1].getTime() - dr[1].getTimezoneOffset() * 60 * 1000).getTime() : null
                  ]))
                }} mb={5} /></Center>
                <Center><Button onClick={book} disabled={!(selectedRange[0] && selectedRange[1])}>Book Now</Button></Center></>}
            </Grid.Col>

        </Grid>

        <Divider label='Rooms' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />

        <Box size="xs" px="xs">
            <Table>
                <thead>
                  <tr>
                    <th width="200px">Bedroom</th>
                    <th>Beds</th>
                  </tr>
                </thead>

                <tbody>
                {listing.metadata?.bedrooms.map((beds, index) => (
                  <tr key={index}>
                    <td>
                         {'Bedroom ' + (index + 1)}
                    </td>

                    <td>
                        {beds.map((bed, i) => (
                            <Text key={i}>{bed}</Text>
                        ))}
                    </td>

                  </tr>
                ))}
                  </tbody>
            </Table>
        </Box>
        <Divider label='Photos' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
            <Grid>

                <Grid.Col span={3}>
                <Anchor onClick={() => { setSelectedImage(listing.thumbnail); setOpenedImage(true) }}><Image placeholder={<IconPhoto />} fit='contain' src={listing.thumbnail} alt='Thumbnail of Listing' /></Anchor>
                </Grid.Col>

                {listing.metadata?.photos.map((x, i) => (<Grid.Col span={3} key={i}>
                <Anchor onClick={() => { setSelectedImage(listing.thumbnail); setOpenedImage(true) }}><Image placeholder={<IconPhoto />} fit='contain' src={x} alt='Photo of Listing' /></Anchor>
                </Grid.Col>))}
            </Grid>

        {bookings.length > 0 && <>
            <Divider label='My Bookings' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
            <Table>
                <thead><tr><th>Booking ID</th><th>Dates</th><th>Total Price</th><th>Status</th></tr></thead>
                <tbody>
                    {bookings.map(x => <tr key={x.id}>
                        <td>{x.id}</td>
                        <td>{new Date(x.dateRange.from).toLocaleDateString()} - {new Date(x.dateRange.to).toLocaleDateString()}</td>
                        <td>{x.totalPrice}</td>
                        <td>{x.status}</td>
                        <td></td>
                    </tr>)}
                </tbody>
            </Table>

            {bookings.find(x => x.status === 'accepted') && <>
            <Divider label='Leave a review' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
            <Textarea
              placeholder="This place has amazing views. Reccomended."
              label="Review Comments"
              value={review} onChange={(event) => setReview(event.currentTarget.value)}
            />
            <Text size='sm' weight={500} mt={10}>Rating</Text>
            <Rating value={rating} onChange={(v) => setRating(v)} />
            <Button mt={10} onClick={submitReview}>Submit Review</Button>
        </>}
        </>}
        <Divider label='Reviews' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
        <Group position="apart" mt="md" mb="xs">
            <Rating value={listing.rating} fractions={2} readOnly />
            <Text>{listing.reviews?.length} Reviews</Text>
        </Group>
        {listing.reviews?.map(x => (
        <>
         <Divider mt="sm" />
         <Group position="apart" >
         <Text mb={10} size='sm'>Reviewed: {new Date(x.date).toLocaleDateString()}</Text><Rating value={x.rating} fractions={2} readOnly />
         </Group>
         <Text>{x.review}</Text>

        </>
        ))}

        <Modal
        opened={openedImage}
        onClose={() => setOpenedImage(false)}
        size="xl"
        closeButtonLabel="Close Photo Modal"
        >
            <Image src={selectedImage} alt='Listing Photo'/>
        </Modal>
        <Modal
        opened={openedBookingConfirmation}
        onClose={() => setOpenedBookingConfirmation(false)}
        title="Booking Confirmation"
        >
            <Text>Your booking has been made. Your booking ID is {bookingResult}.</Text>
        </Modal>
        </>
  );
}

export default View;
