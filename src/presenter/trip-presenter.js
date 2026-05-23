import dayjs from 'dayjs';
import TripInfoView from '../view/trip-info-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripEditView from '../view/trip-edit-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { SortType, sort } from '../utils/sort.js';

export default class TripPresenter {
  constructor({ pointsModel, filterModel, destinations, offersByType }) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._destinations = destinations;
    this._offersByType = offersByType;
    
    this._tripInfoComponent = null;
    this._sortComponent = null;
    this._listComponent = null;
    this._pointComponents = new Map();
    this._editComponent = null;
    this._currentPointId = null;
    this._currentSortType = SortType.DAY;
    
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleNewEventClick = this._handleNewEventClick.bind(this);
    
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(container) {
    this._container = container;
    this._renderTripInfo();
    this._renderSort();
    this._renderList();
    this._renderPoints();
    
    const addButton = document.querySelector('.trip-main__event-add-btn');
    if (addButton) {
      addButton.removeEventListener('click', this._handleNewEventClick);
      addButton.addEventListener('click', this._handleNewEventClick);
    }
    
    document.addEventListener('keydown', this._handleDocumentKeydown.bind(this));
  }

  _getFilteredPoints() {
    const points = this._pointsModel.getPoints();
    const currentFilter = this._filterModel.getFilter();
    return filter[currentFilter](points);
  }

  _getSortedPoints() {
    const filteredPoints = this._getFilteredPoints();
    return sort[this._currentSortType](filteredPoints);
  }

  _handleModelEvent() {
    this._clearPointsList();
    this._renderPoints();
    this._updateTripInfo();
    this._updateSort();
  }

  _handleFilterChange() {
    this._currentSortType = SortType.DAY;
    this._handleModelEvent();
  }

  _updateSort() {
    if (this._sortComponent) {
      const newSortComponent = new TripSortView({
        currentSort: this._currentSortType,
        onSortChange: this._handleSortChange.bind(this)
      });
      replace(newSortComponent, this._sortComponent);
      this._sortComponent = newSortComponent;
    }
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) return;
    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPoints();
  }

  _updateTripInfo() {
    if (this._tripInfoComponent) {
      const points = this._pointsModel.getPoints();
      const newTripInfoComponent = new TripInfoView({ points, destinations: this._destinations });
      replace(newTripInfoComponent, this._tripInfoComponent);
      this._tripInfoComponent = newTripInfoComponent;
    }
  }

  _renderTripInfo() {
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      const points = this._pointsModel.getPoints();
      this._tripInfoComponent = new TripInfoView({ points, destinations: this._destinations });
      render(this._tripInfoComponent, tripMain, RenderPosition.AFTERBEGIN);
    }
  }

  _renderSort() {
    const tripEvents = document.querySelector('.trip-events');
    if (tripEvents) {
      this._sortComponent = new TripSortView({
        currentSort: this._currentSortType,
        onSortChange: this._handleSortChange.bind(this)
      });
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
    const points = this._getSortedPoints();
    const listContainer = this._listComponent.element;
    
    if (points.length === 0) {
      this._renderEmptyMessage();
      return;
    }
    
    points.forEach(point => {
      this._renderPoint(point, listContainer);
    });
  }

  _renderEmptyMessage() {
    const currentFilter = this._filterModel.getFilter();
    const messages = {
      everything: 'Click New Event to create your first point',
      future: 'There are no future events now',
      present: 'There are no present events now',
      past: 'There are no past events now'
    };
    
    const message = messages[currentFilter] || messages.everything;
    const emptyMessageComponent = document.createElement('p');
    emptyMessageComponent.className = 'trip-events__msg';
    emptyMessageComponent.textContent = message;
    this._listComponent.element.appendChild(emptyMessageComponent);
  }

  _renderPoint(point, container) {
    const pointComponent = new TripPointView({
      point,
      onEditClick: () => this._handleEditClick(point.id)
    });
    
    this._pointComponents.set(point.id, pointComponent);
    render(pointComponent, container);
  }

  _clearPointsList() {
    const listContainer = this._listComponent.element;
    listContainer.innerHTML = '';
    this._pointComponents.clear();
    
    if (this._editComponent) {
      remove(this._editComponent);
      this._editComponent = null;
    }
    this._currentPointId = null;
  }

  _handleEditClick(pointId) {
    const point = this._pointsModel.getPoints().find(p => p.id === pointId);
    if (!point) return;
    
    if (this._currentPointId) {
      this._closeEditForm();
    }
    
    this._currentPointId = pointId;
    this._replacePointToEditForm(point);
  }

  _replacePointToEditForm(point) {
    const oldComponent = this._pointComponents.get(point.id);
    
    this._editComponent = new TripEditView({
      point,
      destinations: this._destinations,
      offersByType: this._offersByType,
      onSubmit: (updatedPoint) => this._handleEditSubmit(updatedPoint),
      onDelete: () => this._handleEditDelete(),
      onClose: () => this._handleEditClose()
    });
    
    replace(this._editComponent, oldComponent);
  }

  _handleEditSubmit(updatedPoint) {
    this._pointsModel.updatePoint(updatedPoint);
    this._closeEditForm();
  }

  _handleEditDelete() {
    this._pointsModel.deletePoint(this._currentPointId);
    this._closeEditForm();
  }

  _handleEditClose() {
    this._closeEditForm();
  }

  _handleNewEventClick() {
    if (this._editComponent) {
      this._closeEditForm();
    }
    
    // Сбрасываем фильтр на "everything"
    this._filterModel.setFilter('UPDATE', 'everything');
    this._currentSortType = SortType.DAY;
    
    this._currentPointId = null;
    this._renderCreateForm();
  }

  _renderCreateForm() {
    const tempId = `temp-${Date.now()}`;
    const now = dayjs();
    const emptyPoint = {
      id: tempId,
      type: 'flight',
      destination: '',
      dateFrom: now.toISOString(),
      dateTo: now.add(1, 'hour').toISOString(),
      basePrice: 0,
      offers: [],
      isFavorite: false,
      destination: null
    };
    
    this._editComponent = new TripEditView({
      point: emptyPoint,
      destinations: this._destinations,
      offersByType: this._offersByType,
      onSubmit: (newPoint) => this._handleCreateSubmit(newPoint),
      onClose: () => this._handleCreateClose()
    });
    
    const listContainer = this._listComponent.element;
    listContainer.innerHTML = '';
    render(this._editComponent, listContainer);
  }

  _handleCreateSubmit(newPoint) {
    const destination = this._destinations.find(d => d.name === newPoint.destination);
    
    const pointToAdd = {
      id: `point-${Date.now()}`,
      type: newPoint.type,
      destinationId: destination?.id || '',
      dateFrom: newPoint.dateFrom,
      dateTo: newPoint.dateTo,
      basePrice: newPoint.basePrice,
      offers: newPoint.offers.map(o => o.id),
      isFavorite: false
    };
    
    this._pointsModel.addPoint(pointToAdd);
    this._closeEditForm();
  }

  _handleCreateClose() {
    this._closeEditForm();
    this._renderPoints();
  }

  _closeEditForm() {
    if (this._editComponent) {
      remove(this._editComponent);
      this._editComponent = null;
    }
    this._currentPointId = null;
    this._renderPoints();
  }

  _handleDocumentKeydown(evt) {
    if (evt.key === 'Escape' && this._editComponent) {
      evt.preventDefault();
      this._closeEditForm();
    }
  }
}