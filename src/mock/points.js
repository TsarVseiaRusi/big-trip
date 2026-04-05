import { getDestinationById } from './destinations.js';
import { getOfferById } from './offers.js';

/**
 * Структура данных для точки маршрута
 * @typedef {Object} Point
 * @property {string} id - Уникальный идентификатор
 * @property {string} type - Тип события (taxi, bus, flight и т.д.)
 * @property {string} destinationId - ID пункта назначения
 * @property {string} dateFrom - Дата и время начала (ISO string)
 * @property {string} dateTo - Дата и время окончания (ISO string)
 * @property {number} basePrice - Базовая цена
 * @property {Array<string>} offers - Массив ID выбранных опций
 * @property {boolean} isFavorite - Избранное
 */

export const points = [
  {
    id: 'point-1',
    type: 'taxi',
    destinationId: 'dest-1', // Amsterdam
    dateFrom: '2025-03-18T10:30',
    dateTo: '2025-03-18T11:00',
    basePrice: 20,
    offers: ['taxi-1'], // Order Uber
    isFavorite: true
  },
  {
    id: 'point-2',
    type: 'flight',
    destinationId: 'dest-3', // Chamonix
    dateFrom: '2025-03-18T12:25',
    dateTo: '2025-03-18T13:35',
    basePrice: 160,
    offers: ['flight-1', 'flight-2'], 
    isFavorite: false
  },
  {
    id: 'point-3',
    type: 'drive',
    destinationId: 'dest-3', // Chamonix
    dateFrom: '2025-03-18T14:30',
    dateTo: '2025-03-18T16:05',
    basePrice: 160,
    offers: ['drive-1'], // Rent a car
    isFavorite: true
  },
  {
    id: 'point-4',
    type: 'check-in',
    destinationId: 'dest-3', // Chamonix
    dateFrom: '2025-03-18T16:20',
    dateTo: '2025-03-18T17:00',
    basePrice: 600,
    offers: ['check-in-1'], 
    isFavorite: true
  },
  {
    id: 'point-5',
    type: 'sightseeing',
    destinationId: 'dest-3', // Chamonix
    dateFrom: '2025-03-19T11:20',
    dateTo: '2025-03-19T13:00',
    basePrice: 50,
    offers: ['sightseeing-1', 'sightseeing-2'], 
    isFavorite: false
  },
  {
    id: 'point-6',
    type: 'drive',
    destinationId: 'dest-2', // Geneva
    dateFrom: '2025-03-19T16:00',
    dateTo: '2025-03-19T17:00',
    basePrice: 20,
    offers: [],
    isFavorite: false
  },
  {
    id: 'point-7',
    type: 'flight',
    destinationId: 'dest-2', // Geneva
    dateFrom: '2025-03-19T18:00',
    dateTo: '2025-03-19T19:00',
    basePrice: 20,
    offers: ['flight-1', 'flight-2'], 
    isFavorite: false
  },
  {
    id: 'point-8',
    type: 'drive',
    destinationId: 'dest-2', // Geneva
    dateFrom: '2025-03-20T08:25',
    dateTo: '2025-03-20T09:25',
    basePrice: 20,
    offers: [],
    isFavorite: false
  },
  {
    id: 'point-9',
    type: 'sightseeing',
    destinationId: 'dest-2', // Geneva
    dateFrom: '2025-03-20T11:15',
    dateTo: '2025-03-20T12:15',
    basePrice: 180,
    offers: [],
    isFavorite: false
  }
];

/**
 * Получить все точки маршрута
 * @returns {Array<Point>}
 */
export const getPoints = () => [...points];

/**
 * Получить точку маршрута по ID
 * @param {string} id
 * @returns {Point|undefined}
 */
export const getPointById = (id) => points.find(point => point.id === id);

/**
 * Получить обогащенные данные для точки (с полными объектами destination и offers)
 * @param {Point} point
 * @returns {Object}
 */
export const enrichPoint = (point) => {
  const destination = getDestinationById(point.destinationId);
  const offers = point.offers.map(offerId => getOfferById(offerId)).filter(Boolean);
  
  return {
    ...point,
    destination: destination || { name: 'Unknown', description: '', photos: [] },
    offers
  };
};