/**
 * Абстрактный базовый класс для всех компонентов View
 */
export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Abstract class cannot be instantiated');
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = this._createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  _createElement(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template.trim();
    return wrapper.firstElementChild;
  }
}