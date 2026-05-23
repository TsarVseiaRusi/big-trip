import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import { destinations } from './mock/destinations.js';
import { offerGroups } from './mock/offers.js';
import { points } from './mock/points.js';

const offersByType = {};
offerGroups.forEach(group => {
  offersByType[group.type] = group.offers;
});

document.addEventListener('DOMContentLoaded', () => {
  const pointsModel = new PointsModel([...points]);
  const filterModel = new FilterModel();
  
  const tripContainer = document.querySelector('.trip-events');
  const filtersContainer = document.querySelector('.trip-controls__filters');
  
  const filterPresenter = new FilterPresenter({
    filterModel,
    onFilterChange: () => {}
  });
  filterPresenter.init(filtersContainer);
  
  const tripPresenter = new TripPresenter({
    pointsModel,
    filterModel,
    destinations,
    offersByType
  });
  tripPresenter.init(tripContainer);
});