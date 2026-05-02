import TripPresenter from './presenter/trip-presenter.js';
import TripModel from './model/trip-model.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting application...');
  
  try {
    // Создаем модель с данными
    const tripModel = new TripModel();
    
    // Создаем презентер с моделью
    const presenter = new TripPresenter({ tripModel });
    
    // Инициализируем приложение
    presenter.init();
    
    console.log('Application started successfully');
  } catch (error) {
    console.error('Error starting application:', error);
  }
});