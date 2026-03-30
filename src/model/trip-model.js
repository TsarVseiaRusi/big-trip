import { getPoints, enrichPoint } from '../mock/points.js';
import { destinations, getDestinationById } from '../mock/destinations.js';
import { offerGroups, getOffersByType } from '../mock/offers.js';

/**
 * Модель данных приложения
 * Хранит и управляет всеми данными
 */
export default class TripModel {
  constructor() {
    this._points = []; // Точки маршрута
    this._destinations = []; // Пункты назначения
    this._offers = []; // Группы опций
    
    this._init();
  }

  /**
   * Инициализация моковыми данными
   * @private
   */
  _init() {
    console.log('Initializing TripModel with mock data');
    this._destinations = [...destinations];
    this._offers = [...offerGroups];
    this._points = getPoints().map(point => {
      console.log('Enriching point:', point.id);
      return enrichPoint(point);
    });
    console.log('Model initialized with', this._points.length, 'points');
  }

  /**
   * Получить все точки маршрута
   * @returns {Array}
   */
  getPoints() {
    return [...this._points];
  }

  /**
   * Получить все пункты назначения
   * @returns {Array}
   */
  getDestinations() {
    return [...this._destinations];
  }

  /**
   * Получить все группы опций
   * @returns {Array}
   */
  getOffers() {
    return [...this._offers];
  }

  /**
   * Получить пункт назначения по ID
   * @param {string} id
   * @returns {Object|undefined}
   */
  getDestinationById(id) {
    return getDestinationById(id);
  }

  /**
   * Получить опции по типу события
   * @param {string} type
   * @returns {Array}
   */
  getOffersByType(type) {
    return getOffersByType(type);
  }

  /**
   * Получить точку маршрута по ID
   * @param {string} id
   * @returns {Object|undefined}
   */
  getPointById(id) {
    return this._points.find(point => point.id === id);
  }

  /**
   * Обновить точку маршрута
   * @param {string} id
   * @param {Object} updatedPoint
   */
  updatePoint(id, updatedPoint) {
    const index = this._points.findIndex(point => point.id === id);
    if (index !== -1) {
      this._points[index] = enrichPoint(updatedPoint);
    }
  }

  /**
   * Добавить новую точку маршрута
   * @param {Object} point
   */
  addPoint(point) {
    const newPoint = {
      id: `point-${Date.now()}`,
      ...point
    };
    this._points.push(enrichPoint(newPoint));
  }

  /**
   * Удалить точку маршрута
   * @param {string} id
   */
  deletePoint(id) {
    this._points = this._points.filter(point => point.id !== id);
  }
}