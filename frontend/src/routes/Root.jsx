import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MantineProvider, AppShell, Header, NavLink, LoadingOverlay, Box, Grid, ActionIcon } from '@mantine/core';

import { IconTent, IconMoon, IconSun } from '@tabler/icons';
import Sidebar from './Sidebar';
import configData from '../config.json';

function Root () {
  const [loading, setLoading] = useState(0);
  const [user, setUser] = useState(null);
  const [colorScheme, setColorScheme] = useState('light');

  useEffect(() => {
    // Load login from localStorage - same pattern as I am using in COMP9900 course
    if (!user && localStorage.getItem('user')) {
      const u = JSON.parse(localStorage.getItem('user'));
      // test token is valid
      axios.get(BACKEND_ROOT + 'bookings', {
        headers: {
          Authorization: 'Bearer ' + u.token
        },
        timeout: 10000
      })
        .then(res => {
          setUser(u);
        }).catch(err => {
          console.log(err.response.data.error);
          localStorage.clear();
        });
    }

    // Using request interceptor, keep a count of number of pending axios requests - same pattern as I am using in COMP9900 course
    axios.interceptors.request.use(function (config) {
      setLoading(loading + 1);
      return config;
    }, function (error) {
      setLoading(loading - 1);
      return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
      setLoading(loading - 1);
      return response;
    }, function (error) {
      setLoading(loading - 1);
      return Promise.reject(error);
    });
  }, []);

  const toggleColorScheme = (value) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  return (
        <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>

            <AppShell
                key={user}
                fixed={false}
                header={<Header height={60} p="xs">
                            <Grid mb={20} justify='space-between'>
                                <Grid.Col span={6}>
                                <NavLink
                                component={Link} to='/' label="AirBrB"
                                icon={<IconTent />} />
                                </Grid.Col>
                                <Grid.Col span={1}>
                                <ActionIcon sx={{ float: 'right' }} variant="default" onClick={() => toggleColorScheme()} size={30}>
                                  {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                                </ActionIcon>
                                </Grid.Col>
                            </Grid>
                        </Header>}
                navbar={<Sidebar user={user} setUser={u => setUser(u)} />}
                navbarOffsetBreakpoint="xs"
                styles={
                    (theme) => ({
                      body: {

                        // Media query with value from theme
                        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                          flexDirection: 'column',
                        },

                      },
                      main: {
                        maxWidth: 1368,
                        width: '96vw'
                      }
                    })
                }>
                <LoadingOverlay visible={loading > 0} />

                <Box mr={40}>
                    <Outlet context={[user, setUser]} />
                </Box>
            </AppShell>

        </MantineProvider>

  );
}

export default Root;
export const BACKEND_ROOT = window.location.protocol + '//' + window.location.hostname + ':' + configData.BACKEND_PORT + '/';
