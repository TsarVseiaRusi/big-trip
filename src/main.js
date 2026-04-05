import TripPresenter from './presenter/trip-presenter.js';
import TripModel from './model/trip-model.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting application...');
  
  try {
    // Проверяем наличие контейнеров
    const tripMain = document.querySelector('.trip-main');
    const filtersContainer = document.querySelector('.trip-controls__filters');
    const tripEvents = document.querySelector('.trip-events');
    
    console.log('Containers found:', { 
      tripMain: !!tripMain, 
      filtersContainer: !!filtersContainer, 
      tripEvents: !!tripEvents 
    });

    if (!tripMain) {
      console.error('Container .trip-main not found!');
      return;
    }

    // Создаем модель с данными
    console.log('Creating TripModel...');
    const tripModel = new TripModel();
    
    const points = tripModel.getPoints();
    const destinations = tripModel.getDestinations();
    const offers = tripModel.getOffers();
    
    console.log('Model created with data:', {
      points: points.length,
      destinations: destinations.length,
      offers: offers.length
    });
    
    if (points.length === 0) {
      console.warn('No points data loaded!');
    }

    // Создаем презентер с моделью
    const presenter = new TripPresenter({ tripModel });
    
    // Инициализируем приложение
    presenter.init();
    
    console.log('Application started successfully');
  } catch (error) {
    console.error('Error starting application:', error);
  }
});