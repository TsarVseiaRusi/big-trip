import AbstractView from '../framework/view/abstract-view.js';

export default class TripEditView extends AbstractView {
  constructor({ point, destinations = [], offersByType = {}, onSubmit, onDelete, onClose }) {
    super();
    this._point = point;
    this._destinations = destinations;
    this._offersByType = offersByType;
    this._onSubmit = onSubmit;
    this._onDelete = onDelete;
    this._onClose = onClose;
    
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._handleClose = this._handleClose.bind(this);
  }

  get template() {
    if (!this._point) {
      return this._getEmptyTemplate();
    }
    
    const { type, destination, dateFrom, dateTo, basePrice, offers = [] } = this._point;
    const availableOffers = this._offersByType[type] || [];
    const isNewPoint = !this._point.id || this._point.id.startsWith('temp-');
    
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

    const destinationHtml = destination && destination.description ? `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        ${destination.photos && destination.photos.length > 0 ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destination.photos.map(photo => `
                <img class="event__photo" src="${photo.src}" alt="${photo.description}">
              `).join('')}
            </div>
          </div>
        ` : ''}
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
                value="${destination ? destination.name : ''}" 
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
              <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._formatDateTime(dateFrom)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._formatDateTime(dateTo)}">
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice || ''}">
            </div>

            <button class="event__save-btn btn btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Close</span>
            </button>
          </header>
          <section class="event__details">
            ${offersHtml}
            ${destinationHtml}
          </section>
        </form>
      </li>
    `;
  }

  _getEmptyTemplate() {
    return `
      <li class="trip-events__item">
        <div class="event event--edit">Loading...</div>
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

  _handleSubmit(evt) {
    evt.preventDefault();
    this._onSubmit();
  }

  _handleDelete(evt) {
    evt.preventDefault();
    this._onDelete();
  }

  _handleClose(evt) {
    evt.preventDefault();
    this._onClose();
  }
}