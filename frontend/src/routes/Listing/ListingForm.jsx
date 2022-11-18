
import React, { useState } from 'react';
import { Button, Alert, TextInput, ActionIcon, Table, Divider, Select, MultiSelect, FileButton, Image, Grid, Indicator, NumberInput, Tooltip } from '@mantine/core'
import { IconFileUpload, IconPlus, IconMinus, IconPhoto, IconCurrencyDollar } from '@tabler/icons';
// countries data from https://gist.github.com/whoisryosuke/960afd3e41b42426857f5b5aa415324f
import countryOptions from '../../countries.json';
import PropTypes from 'prop-types';

function ListingForm (props) {
  const [selectedPhotoError, setSelectedPhotoError] = useState(false);

  const [listing, setListing] = useState({
    title: props.listing?.title ?? '',
    address: {
      street: props.listing?.address.street ?? '',
      city: props.listing?.address.city ?? '',
      state: props.listing?.address.state ?? '',
      postcode: props.listing?.address.postcode ?? '',
      country: props.listing?.address.country ?? ''
    },
    price: props.listing?.price ?? '',
    thumbnail: props.listing?.thumbnail ?? '',
    metadata: { photos: [], bathrooms: 1, bedrooms: props.listing?.metadata.bedrooms ?? [['Single']], amenities: props.listing?.metadata.amneties ?? [] }
  });

  const bedOptions = [
    { key: 1, label: 'Single', value: 'Single' },
    { key: 2, label: 'Double', value: 'Double' },
    { key: 3, label: 'Queen', value: 'Queen' },
    { key: 4, label: 'King', value: 'King' }
  ]

  const amenityOptions = [
    { key: 1, label: 'Air-con', value: 'Air-con' },
    { key: 2, label: 'BBQ', value: 'BBQ' },
    { key: 3, label: 'Cot', value: 'Cot' },
    { key: 4, label: 'Fridge', value: 'Fridge' },
    { key: 5, label: 'Hair Dryer', value: 'Hair Dryer' },
    { key: 6, label: 'Iron', value: 'Iron' },
    { key: 7, label: 'Kitchen', value: 'Kitchen' },
    { key: 8, label: 'Microwave', value: 'Microwave' },
    { key: 9, label: 'Newspaper', value: 'Newspaper' },
    { key: 10, label: 'Parking', value: 'Parkng' },
    { key: 11, label: 'Pool', value: 'Pool' },
    { key: 12, label: 'Television', value: 'Television' },
    { key: 13, label: 'Video Games', value: 'Video Games' },
    { key: 14, label: 'Washing Machine', value: 'Washing Machine' },
    { key: 15, label: 'Wifi', value: 'Wifi' }
  ]

  const typeOptions = [
    { key: 1, label: 'Entire Place', value: 'Entire Place' },
    { key: 2, label: 'Room', value: 'Room' }
  ]

  const handleFileSelected = (file) => {
    setSelectedPhotoError(false);

    console.log('H');
    // provided from ass2
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
      setListing(s => ({ ...s, thumbnail: '' }))
      setSelectedPhotoError(true);
    } else {
      const reader = new FileReader();
      const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
      });
      reader.readAsDataURL(file);
      dataUrlPromise.then(fileUrl => {
        if (!listing.thumbnail) {
          setListing(s => ({ ...s, thumbnail: fileUrl }));
        } else {
          setListing(s => ({ ...s, metadata: { ...s.metadata, photos: [...s.metadata.photos, fileUrl] } }));
        }
      });
    }
  }

  const deleteThumbnail = () => {
    if (listing.metadata.photos.length > 0) {
      setListing(s => ({ ...s, thumbnail: s.metadata.photos[0], metadata: { ...s.metadata, photos: s.metadata.photos.slice(1) } }));
    } else {
      setListing(s => ({ ...s, thumbnail: '' }));
    }
  }
  return (

    <form onSubmit={e => { e.preventDefault(); props.onSubmit(listing) }} >
        {props.error && <Alert
              color='violet'
              title='Error'
            >{props.error}</Alert>}
        <TextInput id='title' name='title' label='Listing Title' placeholder='University Apartment with Ocean Views' onChange={e => setListing(s => ({ ...s, title: e.target.value }))} value={listing.title} />
        <TextInput icon={<IconCurrencyDollar size={14} />} label='Price' id='price' name='price' placeholder='199' onChange={e => setListing(s => ({ ...s, price: e.target.value }))} value={listing.price} />
        <Select
            placeholder='Entire Place'
            data={typeOptions}
            searchable
            id="type"
            label="Property Type"
            onChange={v => setListing(s => ({ ...s, metadata: { ...s.metadata, type: v } }))} value={listing.metadata.type}
            />
        <MultiSelect label='Amenities' data={amenityOptions} onChange={v => setListing(s => ({ ...s, metadata: { ...s.metadata, amenities: v } }))} />

        <Divider label='Address' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />

        <TextInput id='street' name='street' label='Street' placeholder='1 Kensington Street' onChange={e => setListing(s => ({ ...s, address: { ...s.address, street: e.target.value } }))} value={listing.address.street} />
        <TextInput id='city' name='city' label='City' placeholder='Kensington' onChange={e => setListing(s => ({ ...s, address: { ...s.address, city: e.target.value } }))} value={listing.address.city} />

        <TextInput id='state' name='state' label='State' placeholder='NSW' onChange={e => setListing(s => ({ ...s, address: { ...s.address, state: e.target.value } }))} value={listing.address.state} />
        <TextInput id='postcode' name='postcode' label='Postcode' placeholder='2033' onChange={e => setListing(s => ({ ...s, address: { ...s.address, postcode: e.target.value } }))} value={listing.address.postcode} />
        <Select
            placeholder='Australia'
            data={countryOptions}
            searchable
            id="country"
            label="Country"
            value={listing.address?.country}
            onChange={v => setListing(s => ({ ...s, address: { ...s.address, country: v } }))}
            />

        <Divider label='Photos' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
            {selectedPhotoError && <p>A photo you have selected was not valid</p> }

            <FileButton mb={15} sx={{ display: 'block' }} leftIcon={<IconFileUpload />} onChange={handleFileSelected} accept="image/png,image/jpeg,image/jpg">
              {(props) => <Button {...props}>Add photo</Button>}
            </FileButton>
            <Grid>

                {listing.thumbnail && <Grid.Col span={3}>
                <Indicator position='bottom-center' label='Thumbnail' size={16} inline><Tooltip label='Delete'>
                <Image placeholder={<IconPhoto />} fit='contain' src={listing.thumbnail} alt='Thumbnail of Listing' onClick={deleteThumbnail} />
                </Tooltip></Indicator>
                </Grid.Col>}

                {listing.metadata.photos.map((x, i) => (<Grid.Col span={3} key={i}>
                <Tooltip label='Delete'>
                <Image placeholder={<IconPhoto />} fit='contain' src={x} alt='Photo if Listing' onClick={e => setListing(s => ({ ...s, metadata: { ...s.metadata, photos: [...s.metadata.photos.slice(0, i), ...s.metadata.photos.slice(i + 1, s.metadata.photos.length)] } }))} />
                </Tooltip>
                </Grid.Col>))}
            </Grid>
        <Divider label='Rooms' mt={10} mb={10} labelPosition='center' labelProps={{ size: 'lg' }} />
        <Table >
            <thead>
              <tr>
                <th width="200px">Bedroom                     <ActionIcon ml={10} sx={{ display: 'inline-block', textAlign: 'center' }} mr={4} variant='filled' color='green' aria-label='Add Bedroom' onClick={e => { e.preventDefault(); setListing(s => ({ ...s, metadata: { ...s.metadata, bedrooms: [...s.metadata.bedrooms, ['Single']] } })) }}>
                        <IconPlus size={14}/>
                    </ActionIcon>
                    {listing.metadata.bedrooms.length > 1 && <ActionIcon sx={{ display: 'inline-block', textAlign: 'center' }} variant='filled' color='red' aria-label='Remove Bedroom' onClick={e => { e.preventDefault(); setListing(s => ({ ...s, metadata: { ...s.metadata, bedrooms: s.metadata.bedrooms.slice(0, s.metadata.bedrooms.length - 1) } })) }}>
                        <IconMinus size={14} />
                    </ActionIcon>}</th>
                <th>Beds</th>
              </tr>
            </thead>

            <tbody>
            {listing.metadata.bedrooms.map((beds, index) => (
              <tr key={index}>
                <td>
                     {'Bedroom ' + (index + 1)}
                </td>

                <td>
                    {beds.map((bed, i) => (
                        <Select
                        width={50}
                        label={'Bed ' + (i + 1)}
                        key={i}
                        data={bedOptions}
                        value={bed}
                        onChange={v => setListing(s => ({ ...s, metadata: { ...s.metadata, bedrooms: Object.assign([], s.metadata.bedrooms, { [index]: Object.assign([], s.metadata.bedrooms[index], { [i]: v }) }) } }))}
                      />
                    ))}

                    <ActionIcon sx={{ display: 'inline-block', textAlign: 'center' }} mt={4} mr={4} variant='filled' color='green' aria-label='Add Bed' onClick={e => { e.preventDefault(); console.log(listing); setListing(s => ({ ...s, metadata: { ...s.metadata, bedrooms: Object.assign([], s.metadata.bedrooms, { [index]: [...s.metadata.bedrooms[index], 'Single'] }) } })) }}>
                        <IconPlus size={14} />
                    </ActionIcon>
                    {beds.length > 1 && <ActionIcon sx={{ display: 'inline-block', textAlign: 'center' }} mt={4} variant='filled' color='red' aria-label='Remove Bed' onClick={e => { e.preventDefault(); console.log(listing); setListing(s => ({ ...s, metadata: { ...s.metadata, bedrooms: Object.assign([], s.metadata.bedrooms, { [index]: s.metadata.bedrooms[index].slice(0, s.metadata.bedrooms[index].length - 1) }) } })) }}>
                        <IconMinus size={14} />
                    </ActionIcon>}</td>

              </tr>
            ))}

              <tr>
                <td colSpan={3}>

                </td>

                </tr>
              </tbody>
        </Table>

        <NumberInput mb={10}
          defaultValue={1}
          label="Number of Bathrooms"
          onChange={v => setListing(s => ({ ...s, metadata: { ...s.metadata, bathrooms: v } }))} value={listing.metadata.bathrooms} />

        <Button type='submit'>Submit</Button>
    </form>

  );
}

ListingForm.propTypes = {
  listing: PropTypes.object,
  onSubmit: PropTypes.func,
  error: PropTypes.string
}

export default ListingForm;
