import Listings from './Listings';
import { Grid, Button, Title, TextInput, RangeSlider, Text, Select, useMantineTheme } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import React, { useState } from 'react'

function SearchListings () {
  const filterObj = {
    term: '',
    price: [0, 1500],
    bedrooms: [0, 15],
    dates: [null, null],
    rating: [0.0, 5.0],
    isPriceSelected: false,
    isBedroomsSelected: false,
    isRatingSelected: false

  };

  const [filterForm, setFilterForm] = useState(filterObj);
  const [filter, setFilter] = useState(filterObj);
  const [sort, setSort] = useState('0');

  const theme = useMantineTheme();
  const sortDefault = (a, b) => {
    return a.title.localeCompare(b.title);
  };
  const sortRatingDsc = (a, b) => {
    return b.rating - a.rating;
  };
  const sortRatingAsc = (a, b) => {
    return a.rating - b.rating;
  };
  const sortPriceDsc = (a, b) => {
    return b.price - a.price;
  };
  const sortPriceAsc = (a, b) => {
    return a.price - b.price;
  };
  const sortFunctions = [sortDefault, sortRatingAsc, sortRatingDsc, sortPriceAsc, sortPriceDsc];

  return (
            <><Title mb={12}>Find Listings</Title>
            <Grid mb={20}>
                <Grid.Col xs={5} md={3}><TextInput
                  placeholder="Kensington"
                  label="Search Term"
                  value={filterForm.term}
                  onChange={e => setFilterForm(s => ({ ...s, term: e.target.value }))}
                /></Grid.Col>
                <Grid.Col xs={7} md={3}><DateRangePicker
                  previousMonthLabel='Previous Month' nextMonthLabel='Next Month'
                  allowLevelChange={false}
                  label="Dates"
                  placeholder="Pick dates"
                  minDate={new Date()}
                  value={[filterForm.dates[0] ? new Date(filterForm.dates[0] + new Date(filterForm.dates[0]).getTimezoneOffset() * 60 * 1000) : null,
                    filterForm.dates[1] ? new Date(filterForm.dates[1] + new Date(filterForm.dates[1]).getTimezoneOffset() * 60 * 1000) : null]}
                  onChange={dr => {
                    setFilterForm(s => ({
                      ...s,
                      dates: [
                        dr[0] ? new Date(dr[0].getTime() - dr[0].getTimezoneOffset() * 60 * 1000).getTime() : null,
                        dr[1] ? new Date(dr[1].getTime() - dr[1].getTimezoneOffset() * 60 * 1000).getTime() : null
                      ]
                    }))
                  }}
                /></Grid.Col>
                <Grid.Col xs={4} md={2}><Text size='sm' weight={500} color={theme.colorScheme === 'dark' ? 'dark.0' : 'gray.9'}>Bedrooms</Text><RangeSlider
                max={15}
                min={0}
                step={1}
                minRange={1}
              marks={[
                { value: 0, label: '0' },
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 15, label: '15+' },
              ]}
              color={filterForm.isBedroomsSelected ? 'blue' : 'gray'}
              value={filterForm.bedrooms}
              onChange={v => setFilterForm(s => ({ ...s, isBedroomsSelected: true, bedrooms: v }))}
              thumbFromLabel="Minimum bedrooms slider control" thumbToLabel="Maximum bedrooms slider control"
            /></Grid.Col>
            <Grid.Col xs={4} md={2}><Text size='sm' weight={500} color={theme.colorScheme === 'dark' ? 'dark.0' : 'gray.9'}>Price ($/night)</Text><RangeSlider
                max={1500}
                min={0}
                step={25}
                minRange={1}
              marks={[
                { value: 0, label: '0' },
                { value: 500, label: '500' },
                { value: 1000, label: '1000' },
                { value: 1500, label: '1500+' },
              ]}
              color={filterForm.isPriceSelected ? 'blue' : 'gray'}
              value={filterForm.price}
              onChange={v => setFilterForm(s => ({ ...s, isPriceSelected: true, price: v }))}
              thumbFromLabel="Minimum price slider control" thumbToLabel="Maximum price slider control"
            /></Grid.Col>
            <Grid.Col xs={4} md={2}><Text size='sm' weight={500} color={theme.colorScheme === 'dark' ? 'dark.0' : 'gray.9'}>Rating</Text><RangeSlider
                max={5.0}
                min={0.0}
                step={0.5}
                minRange={0.5}
              marks={[
                { value: 0.0, label: '0' },
                { value: 1.0, label: '1' },
                { value: 2.0, label: '2' },
                { value: 3.0, label: '3' },
                { value: 4.0, label: '4' },
                { value: 5.0, label: '5' },

              ]}
              color={filterForm.isRatingSelected ? 'blue' : 'gray'}
              value={filterForm.rating}
              onChange={v => setFilterForm(s => ({ ...s, isRatingSelected: true, rating: v }))}
              thumbFromLabel="Minimum rating slider control" thumbToLabel="Maximum rating slider control"
            /></Grid.Col>
            </Grid>

            <Grid mb={10} justify='space-between'>
            <Grid.Col xs={12} sm={6}>
            <Button mt={5} mr={10} mb={20} onClick={e => { setFilter(filterForm); if (filterForm.isRatingSelected) { setSort('2'); } } }>Apply filters</Button>
                <Button color='cyan' mt={5} mr={10} mb={20} onClick={e => { setFilter(filterObj); setFilterForm(filterObj); } }>Reset filters</Button>

            </Grid.Col>
            <Grid.Col xs={12} sm={6}>
            <Select
              mt={30}
              label="Sort By"
              data={[
                { value: '0', label: 'Name (A to Z), Booked Listings First' },
                { value: '1', label: 'Rating (Low to High)' },
                { value: '2', label: 'Rating (High to Low)' },
                { value: '3', label: 'Price (Low to High)' },
                { value: '4', label: 'Price (High to Low)' }
              ]}
              value={sort}
              onChange={v => { setSort(v); }}
            />
            </Grid.Col>
            </Grid>
            <Listings filters={filter} sort={sortFunctions[sort]} />
            </>
  );
}

export default SearchListings;
