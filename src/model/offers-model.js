import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  constructor(apiService) {
    super();
    this._apiService = apiService;
    this._offers = [];
    this._isLoading = true;
    this._error = null;
  }

  async init() {
    try {
      this._offers = await this._apiService.getOffers();
    } catch (err) {
      this._error = err;
      this._offers = [];
    } finally {
      this._isLoading = false;
      this._notify('INIT', { isLoading: false, error: this._error });
    }
  }

  getOffers() {
    return this._offers;
  }

  getOffersByType(type) {
    const offerGroup = this._offers.find(group => group.type === type);
    return offerGroup ? offerGroup.offers : [];
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }
}