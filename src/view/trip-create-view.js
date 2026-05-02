import TripEditView from './trip-edit-view.js';

export default class TripCreateView extends TripEditView {
  constructor({ destinations = [], offersByType = {}, onSubmit, onClose }) {
    // Создаем пустую точку с значениями по умолчанию
    const defaultPoint = {
      id: `temp-${Date.now()}`,
      type: 'flight',
      destination: '',
      dateFrom: new Date().toISOString(),
      dateTo: new Date(Date.now() + 3600000).toISOString(),
      basePrice: 0,
      offers: [],
      isFavorite: false
    };
    
    super({
      point: defaultPoint,
      destinations,
      offersByType,
      onSubmit,
      onDelete: null, // Для создания нет кнопки удаления
      onClose
    });
  }
  
  _handleDelete(evt) {
    evt.preventDefault();
    // Для формы создания, кнопка "Cancel" просто закрывает форму
    if (this._onClose) {
      this._onClose();
    }
  }
}