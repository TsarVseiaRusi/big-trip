import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  constructor() {
    super();
    this._currentFilter = 'everything';
  }

  getFilter() {
    return this._currentFilter;
  }

  setFilter(updateType, filter) {
    this._currentFilter = filter;
    this._notify(updateType, filter);
  }
}