function enableValidation(config) {
  const formEls = [...document.querySelectorAll(config.formSelector)];

  formEls.forEach((formEl) => {
    const inputEls = [...formEl.querySelectorAll(config.inputSelector)];
    const submitButtonEl = formEl.querySelector(config.submitButtonSelector);

    toggleButtonState(inputEls, submitButtonEl, config);

    inputEls.forEach((inputEl) => {
      inputEl.addEventListener("input", () => {
        checkInputValidity(formEl, inputEl, config);
        toggleButtonState(inputEls, submitButtonEl, config);
      });
    });

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  });
}

function checkInputValidity(formEl, inputEl, config) {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);

  if (!inputEl.validity.valid) {
    errorEl.textContent = inputEl.validationMessage;
    inputEl.classList.add(config.inputErrorClass);
    errorEl.classList.add(config.errorClass);
  } else {
    errorEl.textContent = "";
    inputEl.classList.remove(config.inputErrorClass);
    errorEl.classList.remove(config.errorClass);
  }
}

function toggleButtonState(inputEls, buttonEl, config) {
  const hasInvalidInput = inputEls.some((inputEl) => !inputEl.validity.valid);
  if (hasInvalidInput) {
    buttonEl.classList.add(config.inactiveButtonClass);
    buttonEl.disabled = true;
  } else {
    buttonEl.classList.remove(config.inactiveButtonClass);
    buttonEl.disabled = false;
  }
}

const config = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(config);
