export default class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }
  setItems(items) {
    this._items = items;
    this.renderItems();
  }

  renderItems() {
    this._container.innerHTML = "";
    this._items.forEach((item) => {
      this._renderer(item);
      //this.addItem(element);
    });
  }

  addItem(element, prepend = true) {
    if (prepend) {
      this._container.prepend(element);
    } else {
      this._container.append(element);
    }
  }
}
