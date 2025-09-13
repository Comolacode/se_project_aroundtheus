import { initialCards } from "../utils/constants.js";
import "./index.css";
import logo from "../images/logo.svg";
import avatar from "../images/jacques-cousteau.jpg";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
//import { renderLoading } from "../utils/utils.js";
import { validationSettings } from "../utils/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "c9dbbdb6-660e-4dc9-a3a8-ec5778fc6e57",
      "Content-Type": "application/json",
    },
  });

  const headerLogo = document.querySelector(".header__logo");
  headerLogo.src = logo;
  const profileImage = document.querySelector(".profile__image");
  profileImage.src = avatar;
  const profileEditButton = document.querySelector("#profile-edit-button");
  const addCardButton = document.querySelector("#add-card-button");
  const profileEditModal = document.querySelector("#profile-edit-modal");
  const addCardModal = document.querySelector("#add-card-modal");
  const previewImageModal = document.querySelector("#preview-image-modal");
  const avatarEditModal = document.querySelector("#avatar-edit-modal");
  const profileEditForm = profileEditModal.querySelector(".popup__form");
  const avatarEditForm = avatarEditModal.querySelector(".popup__form");
  const addCardFormElement = addCardModal.querySelector(".popup__form");
  const avatarEditButton = document.querySelector("#profile-avatar-button");
  const profileTitleInput = document.querySelector("#profile-title-input");
  const profileDescriptionInput = document.querySelector(
    "#profile-description-input"
  );

  const profileFormValidator = new FormValidator(
    validationSettings,
    profileEditForm
  );

  const cardFormValidator = new FormValidator(
    validationSettings,
    addCardFormElement
  );

  const avatarFormValidator = new FormValidator(
    validationSettings,
    avatarEditForm
  );

  profileFormValidator.enableValidation();
  cardFormValidator.enableValidation();
  avatarFormValidator.enableValidation();

  //* ---------Elements--------- *//

  const userInfo = new UserInfo({
    nameSelector: ".profile__title",
    aboutSelector: ".profile__description",
    avatarSelector: ".profile__image",
  });

  const imagePopup = new PopupWithImage("#preview-image-modal");
  imagePopup.setEventListeners();

  let currentUserId;

  function handleCardClick({ name, link }) {
    imagePopup.open({ name, link });
  }

  const confirmDeletePopup = new PopupWithConfirmation("#confirm-delete-modal");
  confirmDeletePopup.setEventListeners();

  function createCard(item) {
    const card = new Card(
      { ...item, currentUserId },
      "#card-template",
      handleCardClick,
      (cardElement, cardId) => {
        confirmDeletePopup.open();
        //if (item.isDemo) {
        //cardElement.remove();
        //} else {
        //console.log("Delete handler called", cardId);
        //confirmDeletePopup.open(cardElement, cardId);

        confirmDeletePopup.setSubmitAction(() => {
          //console.log("Submit action triggered", cardId);
          if (item._id) {
            api
              .deleteCard(cardId)
              .then(() => {
                cardElement.remove();
                confirmDeletePopup.close();
              })
              .catch((err) => console.error("Error deleting card:", err));
          } else {
            cardElement.remove();
            confirmDeletePopup.close();
          }
        });
      },
      //confirmDeletePopup.open(cardElement, item._id);
      api
    );
    return card.generateCard();
  }

  //"#card-template",
  //handleCardClick,
  //api

  const cardSection = new Section(
    {
      items: [],
      renderer: (item) => {
        const cardElement = createCard(item);
        cardSection.addItem(cardElement, false);
      },
    },
    ".cards__list"
  );

  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, apiCards]) => {
      currentUserId = userData._id;

      //console.log("API cards:", userData);

      userInfo.setUserInfo({
        name: userData.name,
        about: userData.about,
        avatar: userData.avatar,
      });

      //console.log("cards from api:", cards);

      //const cardsWithUser = apiCards.map((card) => ({
      // ...card,
      // currentUserId,
      //}));
      //cardSection.setItems(cardsWithUser);

      //api.getInitialCards().then((cards) => {
      //console.log("Initial cards from API:", cards);
      //});

      //const combinedCards = [...card, ...initialCards].map((card) => ({
      //...card,
      //currentUserId,
      //}));
      //cardSection.setItems(combinedCards);
      //})

      const combinedCards = [
        ...apiCards.map((card) => ({ ...card, currentUserId, isDemo: false })),
        ...initialCards.map((card) => ({
          ...card,
          currentUserId,
          isDemo: true,
        })),
      ];

      cardSection.setItems(combinedCards);
    })

    .catch((err) => console.error("Error loading user or cards:", err));

  const profileFormPopup = new PopupWithForm(
    "#profile-edit-modal",
    (formData) => {
      return api
        .updateUserInfo({
          name: formData.name,
          about: formData.about,
        })
        .then((res) => {
          userInfo.setUserInfo({
            name: res.name,
            about: res.about,
            avatar: res.avatar,
          });
          profileFormPopup.close();
        })

        .catch((err) => console.error("Error updating user info:", err));
    }
  );

  profileFormPopup.setEventListeners();

  const addCardPopup = new PopupWithForm("#add-card-modal", (formData) => {
    return api
      .addCard({
        name: formData.name,
        link: formData.link,
      })
      .then((cardData) => {
        const element = createCard({ ...cardData, currentUserId });
        cardSection.addItem(element, true);
        addCardPopup.close();
      })
      .catch((err) => console.error("Error adding card:", err));
  });

  addCardPopup.setEventListeners();

  const avatarFormPopup = new PopupWithForm(
    "#avatar-edit-modal",
    (formData) => {
      return api
        .updateUserAvatar({
          avatar: formData.avatar,
        })
        .then((res) => {
          userInfo.setUserInfo({
            name: res.name,
            about: res.about,
            avatar: res.avatar,
          });
          avatarFormPopup.close();
        })
        .catch((err) => console.error("Error updating avatar:", err));
    }
  );
  avatarFormPopup.setEventListeners();

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

  avatarEditButton.addEventListener("click", () => {
    avatarFormValidator.resetValidation();
    avatarFormPopup.open();
  });
});
