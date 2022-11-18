import React, { useState } from 'react'
import { Modal, Button, Group, Text, Tooltip, Alert, Center, Box } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_ROOT } from '../Root'
import PropTypes from 'prop-types';

function Publish (props) {
  const [user,] = useOutletContext();

  const [availability, setAvailability] = useState(props.listing?.availability.map(x => ({ start: new Date(x.start), end: new Date(x.end) })) ?? []);
  const [error, setError] = useState('');
  const [dr, setDr] = useState(x => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return [
      today,
      tomorrow,
    ]
  });

  const addAvailability = () => {
    setError('');
    const d0 = new Date(dr[0].getTime() - dr[0].getTimezoneOffset() * 60 * 1000).getTime();
    const d1 = new Date(dr[1].getTime() - dr[1].getTimezoneOffset() * 60 * 1000).getTime();
    for (const a of availability) {
      if (Math.max(a.start, d0) < Math.min(a.end, d1) && !(a.end === d0)) {
        setError('Date range overlaps with existing availability');
        return;
      }
    }

    setAvailability([...availability, { start: d0, end: d1 }]);
  }
  const saveAvailability = () => {
    if (availability.length === 0) {
      setError('At least one availability range is required');
    } else {
      axios.put(BACKEND_ROOT + 'listings/publish/' + props.listing.id, { availability }, {
        headers: {
          Authorization: 'Bearer ' + user.token
        },
        timeout: 10000
      })
        .then(res => {
          props.loadListings();
          props.onClose();
        }).catch(err => {
          console.log(err.response.data.error);
          setError(err.response.data.error);
        });
    }
  }
  return (<Modal closeButtonLabel="close" onClose={props.onClose} opened={true} title='Availabilities'>
  {availability && availability.length === 0 && <Text>No dates selected</Text>}
  {availability && availability.map((x, i) => (<Tooltip key={i} label='Delete'><Box pl={5} sx={{ border: 'solid gray 1px' }} onClick={x => setAvailability(s => [...s.slice(0, i), ...s.slice(i + 1, s.length)])}><Text>
        {new Date(x.start).toLocaleDateString()} - {new Date(x.end).toLocaleDateString()}
    </Text></Box></Tooltip>
  ))}

    {error && <Alert mt={15}
        color='violet'
        title='Error'
      >{error}</Alert>}
    <Group position="apart" mt="md" mb="md">
        <DateRangePicker styles={{ wrapper: { width: '300px' } }}
          minDate={new Date()}
          label="Availability"
          placeholder="Pick dates range"
          value={dr}
          onChange={setDr}
          previousMonthLabel='Previous Month' nextMonthLabel='Next Month'
          allowLevelChange={false}
            />
        <Button color='cyan' sx={{ alignSelf: 'flex-end' }} onClick={addAvailability}>Add</Button>
    </Group>
    <Center>
     <Button onClick={saveAvailability}>Save</Button>
    </Center>
  </Modal>);
}

Publish.propTypes = {
  listing: PropTypes.object,
  loadListings: PropTypes.func,
  onClose: PropTypes.func
}

export default Publish;
