import AbstractView from './abstract-view.js';

export default class TripSortView extends AbstractView {
  constructor({ currentSort = 'day' } = {}) {
    super();
    this._currentSort = currentSort;
  }

  getTemplate() {
    const sorts = [
      { id: 'day', label: 'Day', isDisabled: false },
      { id: 'event', label: 'Event', isDisabled: true },
      { id: 'time', label: 'Time', isDisabled: false },
      { id: 'price', label: 'Price', isDisabled: false },
      { id: 'offer', label: 'Offers', isDisabled: true }
    ];

    const sortsHtml = sorts.map(sort => `
      <div class="trip-sort__item trip-sort__item--${sort.id}">
        <input 
          id="sort-${sort.id}" 
          class="trip-sort__input visually-hidden" 
          type="radio" 
          name="trip-sort" 
          value="sort-${sort.id}"
          ${this._currentSort === sort.id ? 'checked' : ''}
          ${sort.isDisabled ? 'disabled' : ''}
        >
        <label class="trip-sort__btn" for="sort-${sort.id}">${sort.label}</label>
      </div>
    `).join('');

    return `
      <form class="trip-events__trip-sort trip-sort" action="#" method="get">
        ${sortsHtml}
      </form>
    `;
  }
}