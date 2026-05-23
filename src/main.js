import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic bigtrip2024user';
// Используем правильный адрес сервера
const END_POINT = 'https://21.objects.htmlacademy.ru/big-trip';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel(apiService);
const destinationsModel = new DestinationsModel(apiService);
const offersModel = new OffersModel(apiService);
const filterModel = new FilterModel();

const tripContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

// Убеждаемся, что контейнеры существуют
if (!tripContainer) {
  console.error('Trip container not found!');
}

if (!filtersContainer) {
  console.error('Filters container not found!');
}

const filterPresenter = new FilterPresenter({
  filterModel,
  pointsModel,
  onFilterChange: () => {
    if (tripPresenter && typeof tripPresenter._renderPoints === 'function') {
      tripPresenter._renderPoints();
    }
  }
});

if (filtersContainer) {
  filterPresenter.init(filtersContainer);
}

const tripPresenter = new TripPresenter({
  pointsModel,
  filterModel,
  destinationsModel,
  offersModel
});

if (tripContainer && tripPresenter && typeof tripPresenter.init === 'function') {
  tripPresenter.init(tripContainer);
} else {
  console.error('TripPresenter init is not a function or container not found');
}