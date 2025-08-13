import Card from "./components/Card.js";
import FormValidator from "./components/FormValidator.js";
import Section from "./components/Section.js";
import PopupWithImage from "./components/PopupWithImage.js";
import PopupWithForm from "./components/PopupWithForm.js";
import UserInfo from "./components/UserInfo.js";
import { initialCards, validationSettings } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const profileEditModal = document.querySelector("#profile-edit-modal");
  const addCardModal = document.querySelector("#add-card-modal");
  const previewImageModal = document.querySelector("#preview-image-modal");
  const profileEditForm = profileEditModal.querySelector(".popup__form");
  const addCardFormElement = addCardModal.querySelector(".popup__form");

  const profileFormValidator = new FormValidator(
    validationSettings,
    profileEditForm
  );
  profileFormValidator.enableValidation();

  const cardFormValidator = new FormValidator(
    validationSettings,
    addCardFormElement
  );
  cardFormValidator.enableValidation();
  //* ---------Elements--------- *//

  const profileEditButton = document.querySelector("#profile-edit-button");
  const addCardButton = document.querySelector("#add-card-button");

  const profileTitleInput = document.querySelector("#profile-title-input");
  const profileDescriptionInput = document.querySelector(
    "#profile-description-input"
  );

  const userInfo = new UserInfo({
    nameSelector: ".profile__title",
    aboutSelector: ".profile__description",
  });

  const profileFormPopup = new PopupWithForm(
    "#profile-edit-modal",
    (formData) => {
      userInfo.setUserInfo({
        name: formData.name,
        about: formData.about,
      });
    }
  );

  profileFormPopup.setEventListeners();

  const addCardPopup = new PopupWithForm("#add-card-modal", (formData) => {
    const newCardData = {
      name: formData.name,
      link: formData.link,
    };
    const cardElement = createCard(newCardData);
    cardSection.addItem(cardElement);
  });

  addCardPopup.setEventListeners();

  const imagePopup = new PopupWithImage("#preview-image-modal");
  imagePopup.setEventListeners();

  function handleCardClick({ name, link }) {
    imagePopup.open({ name, link });
  }

  function createCard(cardData) {
    console.log("Creating card for:", cardData.name);
    const card = new Card(cardData, "#card-template", handleCardClick);
    return card.generateCard();
  }

  const cardSection = new Section(
    {
      items: initialCards,
      renderer: (cardData) => {
        return createCard(cardData);
      },
    },
    ".cards__list"
  );

  cardSection.renderItems = function () {
    console.log("Rendering cards...");
    this._items.forEach((item) => {
      console.log("adding card:", item.name);
      const cardElement = this._renderer(item);
      this.addItem(cardElement);
    });
  };

  cardSection.renderItems();

  //* ---------Event Listeners--------- *//

  profileEditButton.addEventListener("click", () => {
    const currentUserInfo = userInfo.getUserInfo();
    profileTitleInput.value = currentUserInfo.name;
    profileDescriptionInput.value = currentUserInfo.about;
    profileFormValidator.resetValidation();
    profileFormPopup.open();
  });

  addCardButton.addEventListener("click", () => {
    cardFormValidator.resetValidation();
    addCardPopup.open();
  });
});
