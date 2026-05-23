import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  constructor(apiService) {
    super();
    this._apiService = apiService;
    this._points = [];
    this._isLoading = true;
    this._error = null;
  }

  async init() {
    try {
      this._points = await this._apiService.getPoints();
      this._error = null;
    } catch (err) {
      this._error = err;
      this._points = [];
    } finally {
      this._isLoading = false;
      this._notify('INIT');
    }
  }

  getPoints() {
    return this._points;
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  async updatePoint(updatedPoint) {
    const response = await this._apiService.updatePoint(updatedPoint);
    const index = this._points.findIndex(point => point.id === updatedPoint.id);
    if (index !== -1) {
      this._points[index] = response;
      this._notify('UPDATE', response);
    }
    return response;
  }

  async addPoint(point) {
    const response = await this._apiService.addPoint(point);
    this._points.push(response);
    this._notify('ADD', response);
    return response;
  }

  async deletePoint(pointId) {
    await this._apiService.deletePoint(pointId);
    const index = this._points.findIndex(point => point.id === pointId);
    if (index !== -1) {
      this._points.splice(index, 1);
      this._notify('DELETE', pointId);
    }
  }
}