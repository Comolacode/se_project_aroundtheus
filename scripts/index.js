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
const cardUrlInput = addCardFormElement.querySelector(".popup__input_type_url");

//const nameInput = addCardFormElement.querySelector(".popup__input_type_name");
//const jobInput = addCardFormElement.querySelector(
// ".popup__input_type_description"
//);

const previewImage = previewImageModal.querySelector(".modal__image");
const previewCaption = previewImageModal.querySelector(".modal__caption");

const cardListEl = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

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

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;
  cardTitleEl.textContent = cardData.name;

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    previewImage.src = cardData.link;
    previewImage.alt = cardData.name;
    previewCaption.textContent = cardData.name;
    openPopup(previewImageModal);
  });

  return cardElement;
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
  const cardElement = getCardElement(cardData);
  cardListEl.prepend(cardElement);

  closePopup(addCardModal);
  addCardFormElement.reset();
}

//* ---------Event Listeners--------- *//
profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopup(profileEditModal);

  resetValidation(profileEditForm, config);
  openPopup(profileEditModal);
});

profileCloseModal.addEventListener("click", () => closePopup(profileEditModal));
addCardCloseModal.addEventListener("click", () => closePopup(addCardModal));
addCardButton.addEventListener("click", () => {
  openPopup(addCardModal);
});

previewCloseButton.addEventListener("click", () =>
  closePopup(previewImageModal)
);

//* ---------initialCards---------- *//

initialCards.forEach((cardData) => {
  const cardElement = getCardElement(cardData);
  cardListEl.append(cardElement);
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target === modal) {
      closePopup(modal);
    }
  });
});
