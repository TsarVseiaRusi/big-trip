// src/view/trip-create-view.js

import AbstractView from './abstract-view.js';
import TripEditView from './trip-edit-view.js';

/**
 * Компонент для создания новой точки маршрута
 * Наследуется от TripEditView, но с некоторыми отличиями
 */
export default class TripCreateView extends TripEditView {
  constructor({ destinations = [], offersByType = {} } = {}) {
    // Создаем пустую точку с значениями по умолчанию
    const defaultPoint = {
      type: 'flight',
      destination: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      price: '',
      offers: []
    };
    
    super({ point: defaultPoint, destinations, offersByType });
  }

  getTemplate() {
    return this._getCreateTemplate();
  }

  _getCreateTemplate() {
    const { type } = this._point;
    const availableOffers = this._offersByType[type] || [];
    
    const offersHtml = availableOffers.length > 0 ? `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${availableOffers.map(offer => `
            <div class="event__offer-selector">
              <input 
                class="event__offer-checkbox  visually-hidden" 
                id="event-offer-${offer.id}-1" 
                type="checkbox" 
                name="event-offer-${offer.id}"
                ${offer.checked ? 'checked' : ''}
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
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${this._getTypeListHtml(type)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${this._capitalize(type)}
            </label>
            <input 
              class="event__input  event__input--destination" 
              id="event-destination-1" 
              type="text" 
              name="event-destination" 
              value="" 
              list="destination-list-1"
            >
            <datalist id="destination-list-1">
              ${this._destinations.map(dest => `
                <option value="${dest.name}"></option>
              `).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${offersHtml}
        </section>
      </form>
    `;
  }
}