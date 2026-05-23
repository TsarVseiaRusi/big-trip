import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

// Подключаем плагин для работы с длительностью
dayjs.extend(duration);

export default class TripPointView extends AbstractView {
  constructor({ point, onEditClick }) {
    super();
    this._point = point;
    this._onEditClick = onEditClick;
    
    this._handleEditClick = this._handleEditClick.bind(this);
  }

  get template() {
    const { dateFrom, dateTo, type, destination, basePrice, offers, isFavorite } = this._point;
    
    const offersHtml = offers && offers.length > 0 ? `
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offers.map(offer => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `).join('')}
      </ul>
    ` : '';

    // Форматируем дату с помощью dayjs
    const formattedDate = this._formatDate(dateFrom);
    const startTime = this._formatTime(dateFrom);
    const endTime = this._formatTime(dateTo);
    const duration = this._calculateDuration(dateFrom, dateTo);

    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${formattedDate}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${this._capitalize(type)} ${destination.name}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
              &mdash;
              <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
            </p>
            <p class="event__duration">${duration}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
          </p>
          ${offersHtml}
          <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  /**
   * Форматирование даты: "MMM D"
   * Например: "MAR 18"
   */
  _formatDate(dateString) {
    return dayjs(dateString).format('MMM D').toUpperCase();
  }

  /**
   * Форматирование времени: "HH:MM"
   * Например: "10:30"
   */
  _formatTime(timeString) {
    return dayjs(timeString).format('HH:mm');
  }

  /**
   * Расчет продолжительности события
   * Форматы:
   * - менее часа: "MMM"
   * - менее суток: "HHч MMм"
   * - более суток: "DDд HHч MMм"
   */
  _calculateDuration(start, end) {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const diffMs = endDate.diff(startDate);
    
    const durationObj = dayjs.duration(diffMs);
    
    const days = Math.floor(durationObj.asDays());
    const hours = durationObj.hours();
    const minutes = durationObj.minutes();
    
    const parts = [];
    
    if (days > 0) {
      parts.push(`${days.toString().padStart(2, '0')}D`);
    }
    
    if (hours > 0 || days > 0) {
      parts.push(`${hours.toString().padStart(2, '0')}H`);
    }
    
    parts.push(`${minutes.toString().padStart(2, '0')}M`);
    
    return parts.join(' ');
  }

  _handleEditClick(evt) {
    evt.preventDefault();
    this._onEditClick();
  }

  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}