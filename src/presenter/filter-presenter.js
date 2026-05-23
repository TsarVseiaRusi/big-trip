import TripFiltersView from '../view/trip-filters-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class FilterPresenter {
  constructor({ filterModel, pointsModel, onFilterChange }) {
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._onFilterChange = onFilterChange;
    this._filterComponent = null;
    this._container = null;
  }

  init(container) {
    this._container = container;
    this._renderFilter();
  }

  _renderFilter() {
    const prevFilterComponent = this._filterComponent;
    const currentFilter = this._filterModel.getFilter();

    this._filterComponent = new TripFiltersView({
      currentFilter,
      onFilterChange: this._handleFilterChange.bind(this)
    });

    if (prevFilterComponent === null) {
      render(this._filterComponent, this._container);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleFilterChange(filterType) {
    if (this._filterModel.getFilter() === filterType) return;
    
    this._filterModel.setFilter('UPDATE', filterType);
    if (this._onFilterChange) {
      this._onFilterChange();
    }
  }
}