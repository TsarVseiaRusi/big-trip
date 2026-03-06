import AbstractView from './abstract-view.js';

export default class TripInfoView extends AbstractView {
  constructor({ title = 'Amsterdam — Chamonix — Geneva', dates = '18 — 20 Mar', totalCost = '0' } = {}) {
    super();
    this._title = title;
    this._dates = dates;
    this._totalCost = totalCost;
  }

  getTemplate() {
    return `
      <section class="trip-main__trip-info trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${this._title}</h1>
          <p class="trip-info__dates">${this._dates}</p>
        </div>
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._totalCost}</span>
        </p>
      </section>
    `;
  }
}