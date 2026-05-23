import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

export default class TripEditView extends AbstractStatefulView {
  constructor({ point, destinations = [], offersByType = {}, onSubmit, onDelete, onClose }) {
    super();
    
    this._destinations = destinations;
    this._offersByType = offersByType;
    this._onSubmit = onSubmit;
    this._onDelete = onDelete;
    this._onClose = onClose;
    
    this._datepickerFrom = null;
    this._datepickerTo = null;
    this._isSaving = false;
    this._isDeleting = false;
    
    this._setState(TripEditView.parsePointToState(point));
    
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
                ${this._isSaving || this._isDeleting ? 'disabled' : ''}
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

    const saveButtonText = this._isSaving ? 'Saving...' : 'Save';
    const deleteButtonText = this._isDeleting ? 'Deleting...' : (isNewPoint ? 'Cancel' : 'Delete');

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
                ${this._isSaving || this._isDeleting ? 'disabled' : ''}
              >
              <datalist id="destination-list-1">
                ${this._destinations.map(dest => `
                  <option value="${dest.name}"></option>
                `).join('')}
              </datalist>
            </div>

            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._formatDateTime(dateFrom)}" readonly ${this._isSaving || this._isDeleting ? 'disabled' : ''}>
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._formatDateTime(dateTo)}" readonly ${this._isSaving || this._isDeleting ? 'disabled' : ''}>
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice || ''}" placeholder="0" ${this._isSaving || this._isDeleting ? 'disabled' : ''}>
            </div>

            <button class="event__save-btn btn btn--blue" type="submit" ${this._isSaving || this._isDeleting ? 'disabled' : ''}>
              ${saveButtonText}
            </button>
            <button class="event__reset-btn" type="reset" ${this._isSaving || this._isDeleting ? 'disabled' : ''}>
              ${deleteButtonText}
            </button>
            <button class="event__rollup-btn" type="button" ${this._isSaving || this._isDeleting ? 'disabled' : ''}>
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
          ${this._isSaving || this._isDeleting ? 'disabled' : ''}
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

  setSavingState(isSaving) {
    this._isSaving = isSaving;
    this.updateElement({});
  }

  setDeletingState(isDeleting) {
    this._isDeleting = isDeleting;
    this.updateElement({});
  }

  async _handleSubmit(evt) {
    evt.preventDefault();
    
    const price = parseInt(this._state.basePrice, 10);
    if (isNaN(price) || price < 0) {
      this.shake();
      return;
    }
    
    if (!this._state.destination || this._state.destination.trim() === '') {
      this.shake();
      return;
    }
    
    this.setSavingState(true);
    
    try {
      await this._onSubmit(TripEditView.parseStateToPoint(this._state));
    } catch (err) {
      this.setSavingState(false);
      this.shake();
    }
  }

  async _handleDelete(evt) {
    evt.preventDefault();
    
    const isNewPoint = !this._state.id || this._state.id.startsWith('temp-');
    
    if (isNewPoint) {
      this._onClose();
      return;
    }
    
    this.setDeletingState(true);
    
    try {
      await this._onDelete(this._state.id);
    } catch (err) {
      this.setDeletingState(false);
      this.shake();
    }
  }

  _handleClose(evt) {
    evt.preventDefault();
    this._onClose();
  }

  _handleTypeChange(evt) {
    const newType = evt.target.value;
    if (newType === this._state.type) return;
    
    const typeIcon = this.element.querySelector('.event__type-icon');
    if (typeIcon) {
      typeIcon.src = `img/icons/${newType}.png`;
      typeIcon.alt = `Event type icon`;
    }
    
    const typeOutput = this.element.querySelector('.event__type-output');
    if (typeOutput) {
      typeOutput.textContent = this._capitalize(newType);
    }
    
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

  _initDatepickers() {
    if (this._isSaving || this._isDeleting) return;
    
    const dateFromInput = this.element.querySelector('#event-start-time-1');
    const dateToInput = this.element.querySelector('#event-end-time-1');
    
    if (dateFromInput && !this._datepickerFrom) {
      this._datepickerFrom = flatpickr(dateFromInput, {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._state.dateFrom).toDate(),
        onChange: ([selectedDate]) => {
          if (selectedDate) {
            const newDateFrom = selectedDate.toISOString();
            if (dayjs(newDateFrom).isAfter(dayjs(this._state.dateTo))) {
              const newDateTo = dayjs(newDateFrom).add(1, 'hour').toISOString();
              this.updateElement({
                dateFrom: newDateFrom,
                dateTo: newDateTo
              });
              if (this._datepickerTo) {
                this._datepickerTo.setDate(dayjs(newDateTo).toDate());
              }
            } else {
              this.updateElement({ dateFrom: newDateFrom });
            }
          }
        }
      });
    }
    
    if (dateToInput && !this._datepickerTo) {
      this._datepickerTo = flatpickr(dateToInput, {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._state.dateTo).toDate(),
        onChange: ([selectedDate]) => {
          if (selectedDate) {
            const newDateTo = selectedDate.toISOString();
            if (dayjs(newDateTo).isBefore(dayjs(this._state.dateFrom))) {
              const newDateFrom = dayjs(newDateTo).subtract(1, 'hour').toISOString();
              this.updateElement({
                dateFrom: newDateFrom,
                dateTo: newDateTo
              });
              if (this._datepickerFrom) {
                this._datepickerFrom.setDate(dayjs(newDateFrom).toDate());
              }
            } else {
              this.updateElement({ dateTo: newDateTo });
            }
          }
        }
      });
    }
  }

  _updateDatepickers() {
    if (this._datepickerFrom && !this._isSaving && !this._isDeleting) {
      this._datepickerFrom.setDate(dayjs(this._state.dateFrom).toDate());
    }
    if (this._datepickerTo && !this._isSaving && !this._isDeleting) {
      this._datepickerTo.setDate(dayjs(this._state.dateTo).toDate());
    }
  }

  _restoreHandlers() {
    const form = this.element.querySelector('.event--edit');
    if (form) {
      form.addEventListener('submit', this._handleSubmit);
    }
    
    const resetBtn = this.element.querySelector('.event__reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', this._handleDelete);
    }
    
    const closeBtn = this.element.querySelector('.event__rollup-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', this._handleClose);
    }
    
    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach(input => {
      input.removeEventListener('change', this._handleTypeChange);
      input.addEventListener('change', this._handleTypeChange);
    });
    
    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.removeEventListener('change', this._handleDestinationChange);
      destinationInput.addEventListener('change', this._handleDestinationChange);
    }
    
    const priceInput = this.element.querySelector('.event__input--price');
    if (priceInput) {
      priceInput.removeEventListener('input', this._handlePriceChange);
      priceInput.addEventListener('input', this._handlePriceChange);
    }
    
    const offerCheckboxes = this.element.querySelectorAll('.event__offer-checkbox');
    offerCheckboxes.forEach(checkbox => {
      checkbox.removeEventListener('change', this._handleOfferChange);
      checkbox.addEventListener('change', this._handleOfferChange);
    });
    
    if (!this._isSaving && !this._isDeleting) {
      this._initDatepickers();
    }
  }

  updateElement(update) {
    super.updateElement(update);
    this._updateDatepickers();
  }

  removeElement() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }
    super.removeElement();
  }

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