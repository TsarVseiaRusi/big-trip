import dayjs from 'dayjs';
import TripInfoView from '../view/trip-info-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripEditView from '../view/trip-edit-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { SortType, sort } from '../utils/sort.js';

export default class TripPresenter {
  constructor({ pointsModel, filterModel, destinationsModel, offersModel }) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    
    this._tripInfoComponent = null;
    this._sortComponent = null;
    this._listComponent = null;
    this._pointComponents = new Map();
    this._editComponent = null;
    this._loadingComponent = null;
    this._errorComponent = null;
    this._currentPointId = null;
    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._isError = false;
    
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleNewEventClick = this._handleNewEventClick.bind(this);
    
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
  }

  async init(container) {
    this._container = container;
    
    this._renderTripInfo();
    this._renderSort();
    this._renderList();
    
    // Ждем загрузки всех данных
    await Promise.all([
      this._pointsModel.init(),
      this._destinationsModel.init(),
      this._offersModel.init()
    ]);
    
    this._isLoading = this._pointsModel.isLoading || this._destinationsModel.isLoading || this._offersModel.isLoading;
    this._isError = this._pointsModel.error || this._destinationsModel.error || this._offersModel.error;
    
    this._renderPoints();
    
    const addButton = document.querySelector('.trip-main__event-add-btn');
    if (addButton) {
      addButton.removeEventListener('click', this._handleNewEventClick);
      addButton.addEventListener('click', this._handleNewEventClick);
    }
    
    document.addEventListener('keydown', this._handleDocumentKeydown.bind(this));
  }

  _handleModelEvent() {
    this._renderPoints();
  }

  _renderLoading() {
    if (this._loadingComponent) {
      remove(this._loadingComponent);
    }
    this._loadingComponent = new LoadingView();
    render(this._loadingComponent, this._listComponent.element);
  }

  _renderError() {
    if (this._errorComponent) {
      remove(this._errorComponent);
    }
    this._errorComponent = new ErrorView();
    render(this._errorComponent, this._listComponent.element);
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

  _renderPoints() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    
    if (this._isError) {
      this._renderError();
      return;
    }
    
    this._clearPointsList();
    
    const points = this._getSortedPoints();
    const destinations = this._destinationsModel.getDestinations();
    const offersByType = this._getOffersByType();
    
    if (points.length === 0) {
      this._renderEmptyMessage();
      return;
    }
    
    // Обогащаем точки данными направлений
    const enrichedPoints = points.map(point => ({
      ...point,
      destination: destinations.find(d => d.id === point.destinationId)
    }));
    
    enrichedPoints.forEach(point => {
      this._renderPoint(point, offersByType);
    });
    
    this._updateTripInfo();
  }

  _renderPoint(point, offersByType) {
    const listContainer = this._listComponent.element;
    
    const pointComponent = new TripPointView({
      point,
      onEditClick: () => this._handleEditClick(point.id)
    });
    
    this._pointComponents.set(point.id, pointComponent);
    render(pointComponent, listContainer);
  }

  _clearPointsList() {
    const listContainer = this._listComponent.element;
    listContainer.innerHTML = '';
    this._pointComponents.clear();
    
    if (this._loadingComponent) {
      remove(this._loadingComponent);
      this._loadingComponent = null;
    }
    
    if (this._errorComponent) {
      remove(this._errorComponent);
      this._errorComponent = null;
    }
    
    if (this._editComponent) {
      remove(this._editComponent);
      this._editComponent = null;
    }
    this._currentPointId = null;
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

  _updateTripInfo() {
    if (this._tripInfoComponent) {
      const points = this._pointsModel.getPoints();
      const destinations = this._destinationsModel.getDestinations();
      const enrichedPoints = points.map(point => ({
        ...point,
        destination: destinations.find(d => d.id === point.destinationId)
      }));
      
      const newTripInfoComponent = new TripInfoView({ points: enrichedPoints, destinations });
      replace(newTripInfoComponent, this._tripInfoComponent);
      this._tripInfoComponent = newTripInfoComponent;
    }
  }

  _renderTripInfo() {
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      const points = this._pointsModel.getPoints();
      const destinations = this._destinationsModel.getDestinations();
      const enrichedPoints = points.map(point => ({
        ...point,
        destination: destinations.find(d => d.id === point.destinationId)
      }));
      
      this._tripInfoComponent = new TripInfoView({ points: enrichedPoints, destinations });
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

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) return;
    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPoints();
  }

  _handleEditClick(pointId) {
    const points = this._pointsModel.getPoints();
    const point = points.find(p => p.id === pointId);
    if (!point) return;
    
    if (this._currentPointId) {
      this._closeEditForm();
    }
    
    this._currentPointId = pointId;
    this._replacePointToEditForm(point);
  }

  _replacePointToEditForm(point) {
    const destinations = this._destinationsModel.getDestinations();
    const offersByType = this._getOffersByType();
    const enrichedPoint = {
      ...point,
      destination: destinations.find(d => d.id === point.destinationId)
    };
    
    const oldComponent = this._pointComponents.get(point.id);
    
    this._editComponent = new TripEditView({
      point: enrichedPoint,
      destinations,
      offersByType,
      onSubmit: (updatedPoint) => this._handleEditSubmit(updatedPoint),
      onDelete: () => this._handleEditDelete(),
      onClose: () => this._handleEditClose()
    });
    
    replace(this._editComponent, oldComponent);
  }

  async _handleEditSubmit(updatedPoint) {
    const destinations = this._destinationsModel.getDestinations();
    const destination = destinations.find(d => d.name === updatedPoint.destination);
    
    const pointToUpdate = {
      id: this._currentPointId,
      type: updatedPoint.type,
      destinationId: destination?.id || '',
      dateFrom: updatedPoint.dateFrom,
      dateTo: updatedPoint.dateTo,
      basePrice: updatedPoint.basePrice,
      offers: updatedPoint.offers.map(o => o.id),
      isFavorite: this._pointsModel.getPoints().find(p => p.id === this._currentPointId)?.isFavorite || false
    };
    
    try {
      await this._pointsModel.updatePoint(pointToUpdate);
      this._closeEditForm();
    } catch (err) {
      this._editComponent.shake();
    }
  }

  async _handleEditDelete() {
    try {
      await this._pointsModel.deletePoint(this._currentPointId);
      this._closeEditForm();
    } catch (err) {
      this._editComponent.shake();
    }
  }

  _handleEditClose() {
    this._closeEditForm();
  }

  async _handleNewEventClick() {
    if (this._editComponent) {
      this._closeEditForm();
    }
    
    this._filterModel.setFilter('UPDATE', 'everything');
    this._currentSortType = SortType.DAY;
    
    this._currentPointId = null;
    await this._renderCreateForm();
  }

  async _renderCreateForm() {
    const destinations = this._destinationsModel.getDestinations();
    const offersByType = this._getOffersByType();
    const now = dayjs();
    
    const emptyPoint = {
      id: `temp-${Date.now()}`,
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
      destinations,
      offersByType,
      onSubmit: (newPoint) => this._handleCreateSubmit(newPoint),
      onClose: () => this._handleCreateClose()
    });
    
    const listContainer = this._listComponent.element;
    listContainer.innerHTML = '';
    render(this._editComponent, listContainer);
  }

  async _handleCreateSubmit(newPoint) {
    const destinations = this._destinationsModel.getDestinations();
    const destination = destinations.find(d => d.name === newPoint.destination);
    
    const pointToAdd = {
      type: newPoint.type,
      destinationId: destination?.id || '',
      dateFrom: newPoint.dateFrom,
      dateTo: newPoint.dateTo,
      basePrice: newPoint.basePrice,
      offers: newPoint.offers.map(o => o.id),
      isFavorite: false
    };
    
    try {
      await this._pointsModel.addPoint(pointToAdd);
      this._closeEditForm();
    } catch (err) {
      this._editComponent.shake();
    }
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

  _getOffersByType() {
    const offersByType = {};
    const offers = this._offersModel.getOffers();
    offers.forEach(group => {
      offersByType[group.type] = group.offers;
    });
    return offersByType;
  }

  _handleDocumentKeydown(evt) {
    if (evt.key === 'Escape' && this._editComponent) {
      evt.preventDefault();
      this._closeEditForm();
    }
  }
}