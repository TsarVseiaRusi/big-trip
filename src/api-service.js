/**
 * Класс для отправки запросов к серверу
 */
export default class ApiService {
  /**
   * @param {string} endPoint Адрес сервера
   * @param {string} authorization Авторизационный токен
   */
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Получение всех точек маршрута
   * @returns {Promise<Array>}
   */
  async getPoints() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse)
      .then((points) => points.map(ApiService.adaptPointToClient));
  }

  /**
   * Получение всех направлений
   * @returns {Promise<Array>}
   */
  async getDestinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  /**
   * Получение всех опций
   * @returns {Promise<Array>}
   */
  async getOffers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  /**
   * Обновление точки маршрута
   * @param {Object} point
   * @returns {Promise<Object>}
   */
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

  /**
   * Добавление новой точки маршрута
   * @param {Object} point
   * @returns {Promise<Object>}
   */
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

  /**
   * Удаление точки маршрута
   * @param {string} pointId
   * @returns {Promise<void>}
   */
  async deletePoint(pointId) {
    return this._load({
      url: `points/${pointId}`,
      method: 'DELETE'
    });
  }

  /**
   * Метод для отправки запроса к серверу
   * @param {Object} config Объект с настройками
   * @returns {Promise<Response>}
   */
  async _load({
    url,
    method = 'GET',
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    const response = await fetch(
      `${this._endPoint}/${url}`,
      { method, body, headers },
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  /**
   * Адаптер: преобразует данные точки с сервера во внутренний формат
   * @param {Object} point
   * @returns {Object}
   */
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

  /**
   * Адаптер: преобразует данные точки из внутреннего формата в формат сервера
   * @param {Object} point
   * @returns {Object}
   */
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

  /**
   * Метод для обработки ответа
   * @param {Response} response Объект ответа
   * @returns {Promise}
   */
  static parseResponse(response) {
    return response.json();
  }

  /**
   * Метод для проверки ответа
   * @param {Response} response Объект ответа
   */
  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Метод для обработки ошибок
   * @param {Error} err Объект ошибки
   */
  static catchError(err) {
    throw err;
  }
}