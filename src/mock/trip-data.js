export const mockData = {
  tripInfo: {
    title: 'Amsterdam — Chamonix — Geneva',
    dates: '18 — 20 Mar',
    totalCost: '1230'
  },
  
  filters: {
    current: 'everything',
    isDisabled: false
  },
  
  sort: {
    current: 'day'
  },
  
  destinations: [
    { name: 'Amsterdam' },
    { name: 'Geneva' },
    { name: 'Chamonix' }
  ],
  
  offersByType: {
    flight: [
      { id: 'luggage', title: 'Add luggage', price: 30 },
      { id: 'comfort', title: 'Switch to comfort class', price: 100 },
      { id: 'meal', title: 'Add meal', price: 15 },
      { id: 'seats', title: 'Choose seats', price: 5 }
    ],
    taxi: [
      { id: 'uber', title: 'Order Uber', price: 20 }
    ],
    drive: [
      { id: 'rent', title: 'Rent a car', price: 200 }
    ]
  },
  
  points: [
    {
      id: '1',
      date: '2019-03-18',
      type: 'taxi',
      destination: 'Amsterdam',
      startTime: '2019-03-18T10:30',
      endTime: '2019-03-18T11:00',
      duration: '30M',
      price: 20,
      offers: [
        { id: 'uber', title: 'Order Uber', price: 20 }
      ],
      isFavorite: true
    },
    {
      id: '2',
      date: '2019-03-18',
      type: 'flight',
      destination: 'Chamonix',
      startTime: '2019-03-18T12:25',
      endTime: '2019-03-18T13:35',
      duration: '01H 10M',
      price: 160,
      offers: [
        { id: 'luggage', title: 'Add luggage', price: 50 },
        { id: 'comfort', title: 'Switch to comfort', price: 80 }
      ],
      isFavorite: false
    },
    {
      id: '3',
      date: '2019-03-18',
      type: 'drive',
      destination: 'Chamonix',
      startTime: '2019-03-18T14:30',
      endTime: '2019-03-18T16:05',
      duration: '01H 35M',
      price: 160,
      offers: [
        { id: 'rent', title: 'Rent a car', price: 200 }
      ],
      isFavorite: true
    }
  ],
  
  editPoint: {
    id: 'edit-1',
    date: '2019-03-18',
    type: 'flight',
    destination: 'Chamonix',
    startTime: '2019-03-18T12:25',
    endTime: '2019-03-18T13:35',
    duration: '01H 10M',
    price: 160,
    offers: [
      { id: 'luggage', title: 'Add luggage', price: 50 },
      { id: 'comfort', title: 'Switch to comfort', price: 80 }
    ],
    isFavorite: false
  }
};