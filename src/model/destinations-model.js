import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  constructor(apiService) {
    super();
    this._apiService = apiService;
    this._destinations = [];
    this._isLoading = true;
    this._error = null;
  }

  async init() {
    try {
      this._destinations = await this._apiService.getDestinations();
    } catch (err) {
      this._error = err;
      this._destinations = [];
    } finally {
      this._isLoading = false;
      this._notify('INIT', { isLoading: false, error: this._error });
    }
  }

  getDestinations() {
    return this._destinations;
  }

  getDestinationById(id) {
    return this._destinations.find(dest => dest.id === id);
  }

  getDestinationByName(name) {
    return this._destinations.find(dest => dest.name === name);
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }
}