// src/view/trip-message-view.js

import AbstractView from './abstract-view.js';

/**
 * Компонент для отображения информационных сообщений
 * (загрузка, ошибка, пустой список)
 */
export default class TripMessageView extends AbstractView {
  constructor({ message }) {
    super();
    this._message = message;
  }

  getTemplate() {
    return `
      <p class="trip-events__msg">${this._message}</p>
    `;
  }
}