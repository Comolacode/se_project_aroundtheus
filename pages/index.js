import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
document.addEventListener("DOMContentLoaded", () => {
  const initialCards = [
    {
      name: "Yosemite Valley",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
    },
    {
      name: "Lake Louise",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
    },
    {
      name: "Bald Mountains",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
    },
    {
      name: "Latemar",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
    },
    {
      name: "Vanoise National Park",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
    },
    {
      name: "Lago di Braies",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
    },
  ];

  const validationSettings = {
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_active",
  };

  const profileForm = document.querySelector("#profile-form");
  const cardForm = document.querySelector("#card-form");

  const profileFormValidator = new FormValidator(
    validationSettings,
    profileForm
  );

  profileFormValidator.enableValidation();

  const cardFormValidator = new FormValidator(validationSettings, cardForm);
  cardFormValidator.enableValidation();
  //* ---------Elements--------- *//
  const profileEditModal = document.querySelector("#profile-edit-modal");
  const addCardModal = document.querySelector("#add-card-modal");
  const previewImageModal = document.querySelector("#preview-image-modal");

  const profileEditButton = document.querySelector("#profile-edit-button");
  const profileCloseModal = document.querySelector("#profile-close-modal");
  const addCardButton = document.querySelector("#add-card-button");
  const addCardCloseModal = document.querySelector("#add-card-close");
  const previewCloseButton = document.querySelector("#preview-image-close");

  const profileTitle = document.querySelector(".profile__title");
  const profileDescription = document.querySelector(".profile__description");
  const profileTitleInput = document.querySelector("#profile-title-input");
  const profileDescriptionInput = document.querySelector(
    "#profile-description-input"
  );
  const profileEditForm = profileEditModal.querySelector(".popup__form");

  const addCardFormElement = addCardModal.querySelector(".popup__form");
  const cardTitleInput = addCardFormElement.querySelector(
    ".popup__input_type_title"
  );
  const cardUrlInput = addCardFormElement.querySelector(
    ".popup__input_type_url"
  );

  const previewImage = previewImageModal.querySelector(".modal__image");
  const previewCaption = previewImageModal.querySelector(".modal__caption");

  const cardListEl = document.querySelector(".cards__list");

  //* --------Escape key---------- *//
  function handleEscapeKey(evt) {
    if (evt.key === "Escape") {
      const openedModal = document.querySelector(".modal_opened");
      if (openedModal) {
        closePopup(openedModal);
      }
    }
  }

  //* ---------Functions--------- *//
  function openPopup(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscapeKey);
  }

  function closePopup(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscapeKey);
  }

  function handleCardClick({ name, link }) {
    previewImage.src = link;
    previewImage.alt = name;
    previewCaption.textContent = name;
    openPopup(previewImageModal);
  }

  function createCard(cardData) {
    const card = new Card(cardData, "#card-template", handleCardClick);
    return card.generateCard();
  }

  //* ---------Event Handlers--------- *//

  function handleProfileEditSubmit(e) {
    e.preventDefault();
    profileTitle.textContent = profileTitleInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closePopup(profileEditModal);
  }

  function handleAddCardFormSubmit(e) {
    e.preventDefault();
    const titleValue = cardTitleInput.value;
    const urlValue = cardUrlInput.value;
    const cardData = { name: titleValue, link: urlValue };
    const cardElement = createCard(cardData);

    cardListEl.prepend(cardElement);
    addCardFormElement.reset();
    cardFormValidator.resetValidation();

    closePopup(addCardModal);
  }
  //* ---------Event Listeners--------- *//
  profileEditForm.addEventListener("submit", handleProfileEditSubmit);
  addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

  profileEditButton.addEventListener("click", () => {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    profileFormValidator.resetValidation();
    openPopup(profileEditModal);
  });

  profileCloseModal.addEventListener("click", () =>
    closePopup(profileEditModal)
  );

  addCardButton.addEventListener("click", () => {
    addCardFormElement.reset();
    cardFormValidator.resetValidation();
    openPopup(addCardModal);
  });

  addCardCloseModal.addEventListener("click", () => closePopup(addCardModal));

  previewCloseButton.addEventListener("click", () =>
    closePopup(previewImageModal)
  );

  //* ---------initialCards---------- *//

  initialCards.forEach((cardData) => {
    const cardElement = createCard(cardData);
    cardListEl.append(cardElement);
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("mousedown", (e) => {
      if (e.target === modal) {
        closePopup(modal);
      }
    });
  });
});
