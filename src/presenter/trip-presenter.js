import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/trip-filters-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripEditView from '../view/trip-edit-view.js';
import { mockData } from '../mock/trip-data.js';

export default class TripPresenter {
  constructor() {
    this._tripInfoComponent = null;
    this._filtersComponent = null;
    this._sortComponent = null;
    this._listComponent = null;
    this._editComponent = null;
    this._pointComponents = [];
  }

  init() {
    this._renderTripInfo();
    this._renderFilters();
    this._renderSort();
    this._renderList();
    this._renderEditForm();
    this._renderPoints();
  }

  _renderTripInfo() {
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      this._tripInfoComponent = new TripInfoView(mockData.tripInfo);
      tripMain.insertBefore(this._tripInfoComponent.getElement(), tripMain.firstChild);
    }
  }

  _renderFilters() {
    const filtersContainer = document.querySelector('.trip-controls__filters');
    if (filtersContainer) {
      this._filtersComponent = new TripFiltersView(mockData.filters);
      filtersContainer.appendChild(this._filtersComponent.getElement());
    }
  }

  _renderSort() {
    const tripEvents = document.querySelector('.trip-events');
    if (tripEvents) {
      this._sortComponent = new TripSortView(mockData.sort);
      tripEvents.insertBefore(this._sortComponent.getElement(), tripEvents.querySelector('h2').nextSibling);
    }
  }

  _renderList() {
    const tripEvents = document.querySelector('.trip-events');
    if (tripEvents) {
      this._listComponent = new TripListView();
      tripEvents.appendChild(this._listComponent.getElement());
    }
  }

  _renderEditForm() {
    const listContainer = this._listComponent.getElement();
    if (listContainer) {
      this._editComponent = new TripEditView({
        point: mockData.editPoint,
        destinations: mockData.destinations,
        offersByType: mockData.offersByType
      });
      listContainer.insertBefore(this._editComponent.getElement(), listContainer.firstChild);
    }
  }

  _renderPoints() {
    const listContainer = this._listComponent.getElement();
    if (listContainer) {
      mockData.points.forEach(point => {
        const pointComponent = new TripPointView({ point });
        this._pointComponents.push(pointComponent);
        listContainer.appendChild(pointComponent.getElement());
      });
    }
  }
}