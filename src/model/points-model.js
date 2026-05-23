import Observable from '../framework/observable.js';
import { enrichPoint } from '../mock/points.js';

export default class PointsModel extends Observable {
  constructor(points) {
    super();
    this._points = points.map(point => enrichPoint(point));
  }

  getPoints() {
    return this._points;
  }

  setPoints(points) {
    this._points = points.map(point => enrichPoint(point));
    this._notify('UPDATE', this._points);
  }

  updatePoint(updatedPoint) {
    const index = this._points.findIndex(point => point.id === updatedPoint.id);
    if (index === -1) return false;

    this._points[index] = enrichPoint(updatedPoint);
    this._notify('UPDATE', this._points);
    return true;
  }

  addPoint(point) {
    const newPoint = enrichPoint(point);
    this._points.push(newPoint);
    this._notify('ADD', newPoint);
    return newPoint;
  }

  deletePoint(pointId) {
    const index = this._points.findIndex(point => point.id === pointId);
    if (index === -1) return false;

    this._points.splice(index, 1);
    this._notify('DELETE', pointId);
    return true;
  }
}