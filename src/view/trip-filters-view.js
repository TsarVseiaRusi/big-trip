import AbstractView from './abstract-view.js';

export default class TripFiltersView extends AbstractView {
  constructor({ currentFilter = 'everything', isDisabled = false } = {}) {
    super();
    this._currentFilter = currentFilter;
    this._isDisabled = isDisabled;
  }

  getTemplate() {
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
          ${this._isDisabled ? 'disabled' : ''}
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
}