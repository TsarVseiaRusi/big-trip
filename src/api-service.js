/**
 * Класс для отправки запросов к серверу
 */
export default class ApiService {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  async getPoints() {
    const response = await this._load({ url: 'points' });
    const points = await ApiService.parseResponse(response);
    return points.map(ApiService.adaptPointToClient);
  }

  async getDestinations() {
    const response = await this._load({ url: 'destinations' });
    return await ApiService.parseResponse(response);
  }

  async getOffers() {
    const response = await this._load({ url: 'offers' });
    return await ApiService.parseResponse(response);
  }

  async updatePoint(point) {
    const adaptedPoint = ApiService.adaptPointToServer(point);
    const response = await this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return ApiService.adaptPointToClient(parsedResponse);
  }

  async addPoint(point) {
    const adaptedPoint = ApiService.adaptPointToServer(point);
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return ApiService.adaptPointToClient(parsedResponse);
  }

  async deletePoint(pointId) {
    return this._load({
      url: `points/${pointId}`,
      method: 'DELETE'
    });
  }

  async _load({ url, method = 'GET', body = null, headers = new Headers() }) {
    headers.append('Authorization', this._authorization);

    const response = await fetch(`${this._endPoint}/${url}`, { method, body, headers });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static adaptPointToClient(point) {
    const adaptedPoint = {
      id: point.id,
      type: point.type,
      destinationId: point.destination,
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      basePrice: point['base_price'],
      offers: point.offers,
      isFavorite: point['is_favorite']
    };
    return adaptedPoint;
  }

  static adaptPointToServer(point) {
    const adaptedPoint = {
      id: point.id,
      type: point.type,
      destination: point.destinationId,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'base_price': point.basePrice,
      offers: point.offers,
      'is_favorite': point.isFavorite
    };
    return adaptedPoint;
  }

  static parseResponse(response) {
    return response.json();
  }
}