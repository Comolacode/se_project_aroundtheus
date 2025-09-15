import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup.querySelector(".popup__form");
    this._cardElement = null;
    this.cardId = null;
    this._handleConfirm = () => {};
  }

  open(cardElement, cardId) {
    this._cardElement = cardElement;
    this._cardId = cardId;
    super.open();
  }

  setSubmitAction(action) {
    this._handleConfirm = action;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleConfirm();
    });
  }
}
