export default class Card {
  constructor(data, cardSelector, handleImageClick, handleDeleteClick, api) {
    this._name = data.name;
    this._link = data.link;
    this._isLiked = data.isLiked || false;

    this._id = data._id;
    this._ownerId = data.owner?._id || data._ownerId;
    this._currentUserId = data.currentUserId;

    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._api = api;
  }

  _getTemplate() {
    return document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  generateCard() {
    this._element = this._getTemplate();
    this._imageElement = this._element.querySelector(".card__image");
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");
    this._titleElement = this._element.querySelector(".card__title");

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._titleElement.textContent = this._name;

    this._updateLikeView();

    this._setEventListeners();

    return this._element;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => this.handleLikeClick());
    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this._element, this._id);
    });
    this._imageElement.addEventListener("click", () => {
      this._handleImageClick({ name: this._name, link: this._link });
    });
  }

  _isLikedByCurrentUser() {
    return this._isLiked;
  }

  _updateLikeView() {
    if (this._isLikedByCurrentUser()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  handleLikeClick() {
    if (!this._api || !this._id) {
      this._likeButton.classList.toggle("card__like-button_active");
      return;
    }

    const isLiked = this._isLikedByCurrentUser();

    const request = isLiked
      ? this._api.removeLike(this._id)
      : this._api.addLike(this._id);

    request
      .then((updatedCard) => {
        this._isLiked = updatedCard.isLiked;
        this._updateLikeView();
      })
      .catch((err) => console.error("Error toggling like:", err));
  }

  removeCard() {
    this._element.remove();
    this._element = null;
  }
}
