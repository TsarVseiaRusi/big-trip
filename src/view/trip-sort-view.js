import AbstractView from '../framework/view/abstract-view.js';

export default class TripSortView extends AbstractView {
  constructor({ currentSort, onSortChange }) {
    super();
    this._currentSort = currentSort;
    this._onSortChange = onSortChange;
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  get template() {
    const sorts = [
      { id: 'day', label: 'Day', isDisabled: false },
      { id: 'time', label: 'Time', isDisabled: false },
      { id: 'price', label: 'Price', isDisabled: false }
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

  _handleSortChange(evt) {
    evt.preventDefault();
    const sortInput = evt.target.closest('.trip-sort__item')?.querySelector('.trip-sort__input');
    if (sortInput && sortInput.checked) {
      const sortValue = sortInput.value.replace('sort-', '');
      this._onSortChange(sortValue);
    }
  }
}