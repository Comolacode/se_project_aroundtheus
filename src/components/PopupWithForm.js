import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit, submitButtonText = "Save") {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".popup__form");
    this._inputList = Array.from(this._form.querySelectorAll(".popup__input"));
    this._submitButton = this._form.querySelector(".popup__button");
    this._defaultButtonText = submitButtonText;
  }
  _getInputValues() {
    const formValues = {};
    this._inputList.forEach((input) => {
      formValues[input.name] = input.value;
    });
    return formValues;
  }

  _renderLoading(isloading) {
    if (isloading) {
      this._submitButton.textContent = "Saving...";
    } else {
      this._submitButton.textContent = this._defaultButtonText;
    }
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      this._renderLoading(true);

      this._handleFormSubmit(this._getInputValues())
        .then(() => {
          this.close();
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this._renderLoading(false);
        });
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}
