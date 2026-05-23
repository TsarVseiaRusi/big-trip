import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic bigtrip2024user';
const END_POINT = 'https://21.objects.pacademy.ru/big-trip';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel(apiService);
const destinationsModel = new DestinationsModel(apiService);
const offersModel = new OffersModel(apiService);
const filterModel = new FilterModel();

const tripContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({
  filterModel,
  pointsModel,
  onFilterChange: () => {
    tripPresenter._renderPoints();
  }
});
filterPresenter.init(filtersContainer);

const tripPresenter = new TripPresenter({
  pointsModel,
  filterModel,
  destinationsModel,
  offersModel
});
tripPresenter.init(tripContainer);