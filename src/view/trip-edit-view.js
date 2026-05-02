import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

export default class TripEditView extends AbstractStatefulView {
  constructor({ point, destinations = [], offersByType = {}, onSubmit, onDelete, onClose }) {
    super();
    
    this._destinations = destinations;
    this._offersByType = offersByType;
    this._onSubmit = onSubmit;
    this._onDelete = onDelete;
    this._onClose = onClose;
    
    // Инициализируем состояние
    this._setState(TripEditView.parsePointToState(point));
    
    // Привязываем обработчики
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handleTypeChange = this._handleTypeChange.bind(this);
    this._handleDestinationChange = this._handleDestinationChange.bind(this);
    this._handlePriceChange = this._handlePriceChange.bind(this);
    this._handleOfferChange = this._handleOfferChange.bind(this);
  }

  get template() {
    return this._getTemplate();
  }

  _getTemplate() {
    const { type, destination, dateFrom, dateTo, basePrice, offers } = this._state;
    const availableOffers = this._offersByType[type] || [];
    const isNewPoint = !this._state.id || this._state.id.startsWith('temp-');
    
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
                data-offer-id="${offer.id}"
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
    ` : '<div class="event__available-offers">No offers available</div>';

    const destinationData = this._getDestinationByName(destination);
    const destinationHtml = destinationData && destinationData.description ? `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationData.description}</p>
        ${destinationData.photos && destinationData.photos.length > 0 ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destinationData.photos.map(photo => `
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
              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${this._getTypeListHtml(type)}
                </fieldset>
              </div>
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
                autocomplete="off"
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
              <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice || ''}" placeholder="0">
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

  _getTypeListHtml(currentType) {
    const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
    
    return types.map(type => `
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
    `).join('');
  }

  _getDestinationByName(name) {
    return this._destinations.find(dest => dest.name === name);
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
    
    // Валидация цены
    const price = parseInt(this._state.basePrice, 10);
    if (isNaN(price) || price < 0) {
      this.shake();
      return;
    }
    
    // Валидация направления
    if (!this._state.destination || this._state.destination.trim() === '') {
      this.shake();
      return;
    }
    
    this._onSubmit(TripEditView.parseStateToPoint(this._state));
  }

  _handleDelete(evt) {
    evt.preventDefault();
    if (this._onDelete) {
      this._onDelete(this._state.id);
    }
  }

  _handleClose(evt) {
    evt.preventDefault();
    if (this._onClose) {
      this._onClose();
    }
  }

  _handleTypeChange(evt) {
    const newType = evt.target.value;
    if (newType === this._state.type) return;
    
    // При смене типа:
    // 1. Обновляем иконку в заголовке
    const typeIcon = this.element.querySelector('.event__type-icon');
    if (typeIcon) {
      typeIcon.src = `img/icons/${newType}.png`;
      typeIcon.alt = `Event type icon`;
    }
    
    // 2. Обновляем текст в label
    const typeOutput = this.element.querySelector('.event__type-output');
    if (typeOutput) {
      typeOutput.textContent = this._capitalize(newType);
    }
    
    // 3. Обновляем состояние и сбрасываем опции
    this.updateElement({
      type: newType,
      offers: []
    });
  }

  _handleDestinationChange(evt) {
    const newDestination = evt.target.value;
    if (newDestination === this._state.destination) return;
    
    this.updateElement({
      destination: newDestination
    });
  }

  _handlePriceChange(evt) {
    const newPrice = evt.target.value;
    // Разрешаем только цифры
    const numericValue = newPrice.replace(/[^\d]/g, '');
    
    this.updateElement({
      basePrice: numericValue
    });
  }

  _handleOfferChange(evt) {
    const checkbox = evt.target;
    if (!checkbox.matches('.event__offer-checkbox')) return;
    
    const offerId = checkbox.dataset.offerId;
    const availableOffers = this._offersByType[this._state.type] || [];
    const offer = availableOffers.find(o => o.id === offerId);
    
    if (!offer) return;
    
    let updatedOffers;
    if (checkbox.checked) {
      updatedOffers = [...this._state.offers, offer];
    } else {
      updatedOffers = this._state.offers.filter(o => o.id !== offerId);
    }
    
    this.updateElement({
      offers: updatedOffers
    });
  }

  _restoreHandlers() {
    // Восстанавливаем обработчик отправки формы
    const form = this.element.querySelector('.event--edit');
    if (form) {
      form.addEventListener('submit', this._handleSubmit);
    }
    
    // Восстанавливаем обработчик кнопки Delete/Cancel
    const resetBtn = this.element.querySelector('.event__reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', this._handleDelete);
    }
    
    // Восстанавливаем обработчик кнопки Close
    const closeBtn = this.element.querySelector('.event__rollup-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', this._handleClose);
    }
    
    // Восстанавливаем обработчики для изменения типа
    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach(input => {
      input.removeEventListener('change', this._handleTypeChange);
      input.addEventListener('change', this._handleTypeChange);
    });
    
    // Восстанавливаем обработчик для изменения направления
    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.removeEventListener('change', this._handleDestinationChange);
      destinationInput.addEventListener('change', this._handleDestinationChange);
    }
    
    // Восстанавливаем обработчик для изменения цены
    const priceInput = this.element.querySelector('.event__input--price');
    if (priceInput) {
      priceInput.removeEventListener('input', this._handlePriceChange);
      priceInput.addEventListener('input', this._handlePriceChange);
    }
    
    // Восстанавливаем обработчики для изменения опций
    const offerCheckboxes = this.element.querySelectorAll('.event__offer-checkbox');
    offerCheckboxes.forEach(checkbox => {
      checkbox.removeEventListener('change', this._handleOfferChange);
      checkbox.addEventListener('change', this._handleOfferChange);
    });
  }

  /**
   * Статический метод для преобразования точки маршрута в состояние
   * @param {Object} point - точка маршрута
   * @returns {Object} состояние
   */
  static parsePointToState(point) {
    return {
      id: point.id,
      type: point.type,
      destination: point.destination ? point.destination.name : '',
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      basePrice: point.basePrice,
      offers: [...point.offers],
      isFavorite: point.isFavorite
    };
  }

  /**
   * Статический метод для преобразования состояния в точку маршрута
   * @param {Object} state - состояние
   * @returns {Object} точка маршрута
   */
  static parseStateToPoint(state) {
    return {
      id: state.id,
      type: state.type,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
      basePrice: parseInt(state.basePrice, 10) || 0,
      offers: [...state.offers],
      isFavorite: state.isFavorite,
      destination: state.destination
    };
  }
}