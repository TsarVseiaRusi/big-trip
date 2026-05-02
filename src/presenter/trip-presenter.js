import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/trip-filters-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripEditView from '../view/trip-edit-view.js';
import TripCreateView from '../view/trip-create-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';

export default class TripPresenter {
  constructor({ tripModel }) {
    this._tripModel = tripModel;
    
    this._tripInfoComponent = null;
    this._filtersComponent = null;
    this._sortComponent = null;
    this._listComponent = null;
    this._pointComponents = new Map();
    this._editComponent = null;
    this._currentPointId = null;
    
    this._handleNewEventClick = this._handleNewEventClick.bind(this);
  }

  init() {
    this._renderTripInfo();
    this._renderFilters();
    this._renderSort();
    this._renderList();
    this._renderPoints();
    
    // Добавляем обработчик для кнопки New event
    const addButton = document.querySelector('.trip-main__event-add-btn');
    if (addButton) {
      addButton.removeEventListener('click', this._handleNewEventClick);
      addButton.addEventListener('click', this._handleNewEventClick);
    }
    
    document.addEventListener('keydown', this._handleDocumentKeydown.bind(this));
  }

  _renderTripInfo() {
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      const points = this._tripModel.getPoints();
      const destinations = this._tripModel.getDestinations();
      
      this._tripInfoComponent = new TripInfoView({ points, destinations });
      render(this._tripInfoComponent, tripMain, RenderPosition.AFTERBEGIN);
    }
  }

  _renderFilters() {
    const filtersContainer = document.querySelector('.trip-controls__filters');
    if (filtersContainer) {
      this._filtersComponent = new TripFiltersView({ currentFilter: 'everything' });
      render(this._filtersComponent, filtersContainer);
    }
  }

  _renderSort() {
    const tripEvents = document.querySelector('.trip-events');
    if (tripEvents) {
      this._sortComponent = new TripSortView({ currentSort: 'day' });
      render(this._sortComponent, tripEvents, RenderPosition.AFTERBEGIN);
    }
  }

  _renderList() {
    const tripEvents = document.querySelector('.trip-events');
    if (tripEvents) {
      this._listComponent = new TripListView();
      render(this._listComponent, tripEvents);
    }
  }

  _renderPoints() {
    const points = this._tripModel.getPoints();
    const listContainer = this._listComponent.element;
    
    points.forEach(point => {
      this._renderPoint(point, listContainer);
    });
  }

  _renderPoint(point, container) {
    const pointComponent = new TripPointView({
      point,
      onEditClick: () => this._handleEditClick(point.id)
    });
    
    this._pointComponents.set(point.id, pointComponent);
    render(pointComponent, container);
  }

  _handleEditClick(pointId) {
    const point = this._tripModel.getPointById(pointId);
    if (!point) return;
    
    if (this._currentPointId) {
      this._closeEditForm();
    }
    
    this._currentPointId = pointId;
    this._replacePointToEditForm(point);
  }

  _replacePointToEditForm(point) {
    const destinations = this._tripModel.getDestinations();
    const offersByType = this._getOffersByType();
    
    const oldComponent = this._pointComponents.get(point.id);
    
    this._editComponent = new TripEditView({
      point,
      destinations,
      offersByType,
      onSubmit: (updatedPoint) => this._handleEditSubmit(updatedPoint),
      onDelete: () => this._handleEditDelete(),
      onClose: () => this._handleEditClose()
    });
    
    replace(this._editComponent, oldComponent);
  }

  _handleNewEventClick() {
    if (this._currentPointId) {
      this._closeEditForm();
    }
    
    this._currentPointId = null;
    this._renderCreateForm();
  }

  _renderCreateForm() {
    const destinations = this._tripModel.getDestinations();
    const offersByType = this._getOffersByType();
    
    // Создаем временный ID
    const tempId = `temp-${Date.now()}`;
    
    // Создаем пустую точку
    const emptyPoint = {
      id: tempId,
      type: 'flight',
      destination: '',
      dateFrom: new Date().toISOString(),
      dateTo: new Date(Date.now() + 3600000).toISOString(),
      basePrice: 0,
      offers: [],
      isFavorite: false
    };
    
    this._editComponent = new TripEditView({
      point: emptyPoint,
      destinations,
      offersByType,
      onSubmit: (newPoint) => this._handleCreateSubmit(newPoint),
      onDelete: null,
      onClose: () => this._handleCreateClose()
    });
    
    // Вставляем форму в начало списка
    const listContainer = this._listComponent.element;
    render(this._editComponent, listContainer, RenderPosition.AFTERBEGIN);
  }

  _handleEditSubmit(updatedPoint) {
    // Обновляем точку в модели
    this._tripModel.updatePoint(updatedPoint.id, updatedPoint);
    
    // Обновляем компонент точки
    const oldComponent = this._pointComponents.get(updatedPoint.id);
    const newPointComponent = new TripPointView({
      point: updatedPoint,
      onEditClick: () => this._handleEditClick(updatedPoint.id)
    });
    
    replace(newPointComponent, oldComponent);
    this._pointComponents.set(updatedPoint.id, newPointComponent);
    
    // Обновляем информацию о маршруте
    this._updateTripInfo();
    
    this._editComponent = null;
    this._currentPointId = null;
  }

  _handleCreateSubmit(newPoint) {
    // Добавляем точку в модель
    this._tripModel.addPoint(newPoint);
    
    // Создаем компонент для новой точки
    const addedPoint = this._tripModel.getPointById(newPoint.id);
    
    // Удаляем форму создания
    remove(this._editComponent);
    this._editComponent = null;
    
    // Добавляем новую точку в список
    const listContainer = this._listComponent.element;
    
    // Находим правильную позицию для вставки (после формы, если есть)
    const firstItem = listContainer.firstChild;
    const newPointComponent = new TripPointView({
      point: addedPoint,
      onEditClick: () => this._handleEditClick(addedPoint.id)
    });
    
    this._pointComponents.set(addedPoint.id, newPointComponent);
    
    if (firstItem && firstItem.classList.contains('event--edit')) {
      render(newPointComponent, listContainer, RenderPosition.AFTEREND);
    } else {
      render(newPointComponent, listContainer, RenderPosition.AFTERBEGIN);
    }
    
    // Обновляем информацию о маршруте
    this._updateTripInfo();
    
    this._currentPointId = null;
  }

  _handleEditDelete() {
    if (!this._currentPointId) return;
    
    // Удаляем точку из модели
    this._tripModel.deletePoint(this._currentPointId);
    
    // Удаляем компонент
    const oldComponent = this._pointComponents.get(this._currentPointId);
    remove(oldComponent);
    this._pointComponents.delete(this._currentPointId);
    
    // Обновляем информацию о маршруте
    this._updateTripInfo();
    
    this._editComponent = null;
    this._currentPointId = null;
  }

  _handleEditClose() {
    this._closeEditForm();
  }

  _handleCreateClose() {
    // Удаляем форму создания
    remove(this._editComponent);
    this._editComponent = null;
    this._currentPointId = null;
  }

  _closeEditForm() {
    if (!this._currentPointId) {
      // Если это форма создания
      if (this._editComponent) {
        remove(this._editComponent);
        this._editComponent = null;
      }
      this._currentPointId = null;
      return;
    }
    
    const point = this._tripModel.getPointById(this._currentPointId);
    const oldComponent = this._editComponent;
    
    // Создаем новый компонент точки
    const newPointComponent = new TripPointView({
      point,
      onEditClick: () => this._handleEditClick(point.id)
    });
    
    replace(newPointComponent, oldComponent);
    this._pointComponents.set(point.id, newPointComponent);
    
    remove(oldComponent);
    this._editComponent = null;
    this._currentPointId = null;
  }

  _updateTripInfo() {
    if (this._tripInfoComponent) {
      const points = this._tripModel.getPoints();
      const destinations = this._tripModel.getDestinations();
      
      const newTripInfoComponent = new TripInfoView({ points, destinations });
      replace(newTripInfoComponent, this._tripInfoComponent);
      this._tripInfoComponent = newTripInfoComponent;
    }
  }

  _getOffersByType() {
    const offersByType = {};
    this._tripModel.getOffers().forEach(group => {
      offersByType[group.type] = group.offers;
    });
    return offersByType;
  }

  _handleDocumentKeydown(evt) {
    if (evt.key === 'Escape' && this._editComponent) {
      evt.preventDefault();
      if (this._currentPointId) {
        this._closeEditForm();
      } else {
        this._handleCreateClose();
      }
    }
  }
}