import AbstractView from '../framework/view/abstract-view.js';

export default class TripInfoView extends AbstractView {
  constructor({ points, destinations }) {
    super();
    this._points = points;
    this._destinations = destinations;
  }

  get template() {
    const title = this._generateTitle();
    const dates = this._generateDates();
    const totalCost = this._calculateTotalCost();

    return `
      <section class="trip-main__trip-info trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${title}</h1>
          <p class="trip-info__dates">${dates}</p>
        </div>
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
        </p>
      </section>
    `;
  }

  _generateTitle() {
    if (this._points.length === 0) return '';

    const destinations = this._points
      .map(point => {
        const dest = this._destinations.find(d => d.id === point.destinationId);
        return dest ? dest.name : '';
      })
      .filter(Boolean);

    if (destinations.length <= 3) {
      return destinations.join(' — ');
    }

    return `${destinations[0]} — ... — ${destinations[destinations.length - 1]}`;
  }

  _generateDates() {
    if (this._points.length === 0) return '';

    const dates = this._points
      .map(point => new Date(point.dateFrom))
      .sort((a, b) => a - b);

    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    if (firstDate.toDateString() === lastDate.toDateString()) {
      return firstDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }

    const firstStr = firstDate.toLocaleDateString('en-US', { day: 'numeric' });
    const lastStr = lastDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    
    return `${firstStr}&nbsp;&mdash;&nbsp;${lastStr}`;
  }

  _calculateTotalCost() {
    return this._points.reduce((total, point) => {
      const offersCost = point.offers.reduce((sum, offer) => sum + offer.price, 0);
      return total + point.basePrice + offersCost;
    }, 0);
  }
}