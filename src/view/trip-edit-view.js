import AbstractView from './abstract-view.js';

export default class TripEditView extends AbstractView {
  constructor({ point, destinations = [], offersByType = {} } = {}) {
    super();
    this._point = point;
    this._destinations = destinations;
    this._offersByType = offersByType;
  }

  getTemplate() {
    if (!this._point) return '<div></div>';
    
    const { type, destination, startTime, endTime, price, offers = [] } = this._point;
    const availableOffers = this._offersByType[type] || [];
    
    const offersHtml = availableOffers.length > 0 ? `
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${availableOffers.map(offer => `
            <div class="event__offer-selector">
              <input 
                class="event__offer-checkbox visually-hidden" 
                id="event-offer-${offer.id}-1" 
                type="checkbox" 
                name="event-offer-${offer.id}"
                ${offers.some(o => o.id === offer.id) ? 'checked' : ''}
              >
              <label class="event__offer-label" for="event-offer-${offer.id}-1">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>
          `).join('')}
        </div>
      </section>
    ` : '';

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
              ${this._getTypeListHtml(type)}
            </div>

            <div class="event__field-group event__field-group--destination">
              <label class="event__label event__type-output" for="event-destination-1">
                ${this._capitalize(type)}
              </label>
              <input 
                class="event__input event__input--destination" 
                id="event-destination-1" 
                type="text" 
                name="event-destination" 
                value="${destination || ''}" 
                list="destination-list-1"
              >
              <datalist id="destination-list-1">
                ${this._destinations.map(dest => `
                  <option value="${dest.name}"></option>
                `).join('')}
              </datalist>
            </div>

            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._formatDateTime(startTime)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._formatDateTime(endTime)}">
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${price || ''}">
            </div>

            <button class="event__save-btn btn btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          <section class="event__details">
            ${offersHtml}
          </section>
        </form>
      </li>
    `;
  }

  _getTypeListHtml(currentType) {
    const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
    
    return `
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${types.map(type => `
            <div class="event__type-item">
              <input 
                id="event-type-${type}-1" 
                class="event__type-input visually-hidden" 
                type="radio" 
                name="event-type" 
                value="${type}"
                ${type === currentType ? 'checked' : ''}
              >
              <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">
                ${this._capitalize(type)}
              </label>
            </div>
          `).join('')}
        </fieldset>
      </div>
    `;
  }

  _formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    }).replace(',', '');
  }

  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}