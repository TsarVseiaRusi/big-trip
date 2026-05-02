import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/trip-filters-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripEditView from '../view/trip-edit-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';

export default class TripPresenter {
  constructor({ tripModel }) {
    this._tripModel = tripModel;
    
    this._tripInfoComponent = null;
    this._filtersComponent = null;
    this._sortComponent = null;
    this._listComponent = null;
    this._pointComponents = new Map(); // Map для хранения компонентов точек
    this._editComponent = null;
    this._currentPointId = null; // ID текущей редактируемой точки
  }

  init() {
    this._renderTripInfo();
    this._renderFilters();
    this._renderSort();
    this._renderList();
    this._renderPoints();
    
    // Добавляем глобальные обработчики
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
    
    // Закрываем любую открытую форму редактирования
    if (this._currentPointId) {
      this._closeEditForm();
    }
    
    this._currentPointId = pointId;
    this._replacePointToEditForm(point);
  }

  _replacePointToEditForm(point) {
    const destinations = this._tripModel.getDestinations();
    
    // Создаем объект offersByType
    const offersByType = {};
    this._tripModel.getOffers().forEach(group => {
      offersByType[group.type] = group.offers;
    });

    const oldComponent = this._pointComponents.get(point.id);
    const container = oldComponent.element.parentElement;
    
    this._editComponent = new TripEditView({
      point,
      destinations,
      offersByType,
      onSubmit: () => this._handleEditSubmit(),
      onDelete: () => this._handleEditDelete(),
      onClose: () => this._handleEditClose()
    });
    
    replace(this._editComponent, oldComponent);
  }

  _closeEditForm() {
    if (!this._currentPointId) return;
    
    const point = this._tripModel.getPointById(this._currentPointId);
    const oldComponent = this._editComponent;
    const container = oldComponent.element.parentElement;
    
    // Создаем новый компонент точки
    const newPointComponent = new TripPointView({
      point,
      onEditClick: () => this._handleEditClick(point.id)
    });
    
    replace(newPointComponent, oldComponent);
    
    // Обновляем Map
    this._pointComponents.set(point.id, newPointComponent);
    this._editComponent = null;
    this._currentPointId = null;
    
    // Удаляем старый компонент
    remove(oldComponent);
  }

  _handleEditSubmit() {
    // Здесь будет логика сохранения
    console.log('Submit form');
    this._closeEditForm();
  }

  _handleEditDelete() {
    // Здесь будет логика удаления
    console.log('Delete form');
    this._closeEditForm();
  }

  _handleEditClose() {
    console.log('Close form');
    this._closeEditForm();
  }

  _handleDocumentKeydown(evt) {
    if (evt.key === 'Escape' && this._currentPointId) {
      evt.preventDefault();
      this._closeEditForm();
    }
  }
}