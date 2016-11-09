'use strict';

module.exports = {
  id: null,
  name: null,
  contact: {
    phone: null,
    formattedPhone: null,
    twitter: null,
    facebook: null,
    facebookUsername: null,
    facebookName: null,
  },
  location: {
    address: null,
    crossStreet: null,
    lat: null,
    lng: null,
    labeledLatLngs: [
      {
        label: null,
        lat: null,
        lng: null,
      },
    ],
    distance: null,
    postalCode: null,
    cc: null,
    city: null,
    state: null,
    country: null,
    formattedAddress: [
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    neighborhood: null,
  },
  categories: [
    {
      id: null,
      name: null,
      pluralName: null,
      shortName: null,
      icon: {
        prefix: null,
        suffix: null,
      },
      primary: true,
    },
  ],
  verified: null,
  stats: {
    checkinsCount: null,
    usersCount: null,
    tipCount: null,
  },
  url: null,
  price: {
    tier: null,
    message: null,
    currency: null,
  },
  rating: null,
  ratingColor: null,
  ratingSignals: null,
  allowMenuUrlEdit: null,
  hours: {
    status: null,
    isOpen: null,
    isLocalHoliday: null,
  },
  photos: {
    count: null,
    groups: [],
  },
  storeId: null,
  hereNow: {
    count: null,
    summary: null,
    groups: [
      {
        type: null,
        name: null,
        count: 1,
        items: [],
      },
    ],
  },
  venuePage: {
    id: null,
  },
  menu: {
    type: null,
    label: null,
    anchor: null,
    url: null,
    mobileUrl: null,
    externalUrl: null,
  },
  events: {
    count: null,
    summary: null,
    items: [
      null,
      null,
      null,
      null,
      null,
    ],
  },
  cluster: null,
  section: null,
  index: null,
  datetime: null,
};
