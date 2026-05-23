import AbstractView from '../framework/view/abstract-view.js';

export default class TripFiltersView extends AbstractView {
  constructor({ currentFilter, onFilterChange }) {
    super();
    this._currentFilter = currentFilter;
    this._onFilterChange = onFilterChange;
    this._handleFilterChange = this._handleFilterChange.bind(this);
  }

  get template() {
    const filters = [
      { id: 'everything', label: 'Everything' },
      { id: 'future', label: 'Future' },
      { id: 'present', label: 'Present' },
      { id: 'past', label: 'Past' }
    ];

    const filtersHtml = filters.map(filter => `
      <div class="trip-filters__filter">
        <input 
          id="filter-${filter.id}" 
          class="trip-filters__filter-input visually-hidden" 
          type="radio" 
          name="trip-filter" 
          value="${filter.id}"
          ${this._currentFilter === filter.id ? 'checked' : ''}
        >
        <label class="trip-filters__filter-label" for="filter-${filter.id}">
          ${filter.label}
        </label>
      </div>
    `).join('');

    return `
      <form class="trip-filters" action="#" method="get">
        ${filtersHtml}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }

  _handleFilterChange(evt) {
    evt.preventDefault();
    const filterInput = evt.target.closest('.trip-filters__filter')?.querySelector('.trip-filters__filter-input');
    if (filterInput && filterInput.checked) {
      this._onFilterChange(filterInput.value);
    }
  }
}