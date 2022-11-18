import React from 'react';
import ReactDOM from 'react-dom';
import Root from './routes/Root';

import Login from './routes/Account/Login';
import Register from './routes/Account/Register';

import Create from './routes/Listing/Create';
import Edit from './routes/Listing/Edit';
import View from './routes/Listing/View';
import MyListings from './routes/Listing/MyListings';
import SearchListings from './routes/Listing/SearchListings';
import Booking from './routes/Listing/Booking';

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <SearchListings />,
      },
      {
        path: 'account/register',
        element: <Register />,
      },
      {
        path: 'account/login',
        element: <Login />,
      },
      {
        path: 'listing/create',
        element: <Create />,
      },
      {
        path: 'listing/my',
        element: <MyListings />,
      },
      {
        path: 'listing/edit/:id',
        element: <Edit />,
      },
      {
        path: 'listing/view/:id',
        element: <View />,
      },
      {
        path: 'listing/booking/:id',
        element: <Booking />,
      }
    ],
  },
]);

ReactDOM.render(

    <RouterProvider router={router} />

    , document.getElementById('root'));
