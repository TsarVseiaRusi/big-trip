import TripPresenter from './presenter/trip-presenter.js';

document.addEventListener('DOMContentLoaded', () => {
  const presenter = new TripPresenter();
  presenter.init();
  console.log('Application started');
});