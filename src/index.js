import './pages/index.css';
import { createCard } from './scripts/card.js';
import { openModal, closeModal, handleOverlayClose } from './scripts/modal.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { getUserInfo, getCards, updateUserInfo, addCard, deleteCard, likeCard, unlikeCard, updateAvatar } from './scripts/api.js';

const placesList = document.querySelector('.places__list');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupDelete = document.querySelector('.popup_type_delete');
const popupAvatar = document.querySelector('.popup_type_avatar');

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const profileFormElement = document.querySelector('[name="edit-profile"]');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');

const newCardForm = document.querySelector('[name="new-place"]');
const cardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardForm.querySelector('.popup__input_type_url');

const avatarForm = document.querySelector('[name="edit-avatar"]');
const avatarInput = avatarForm.querySelector('.popup__input_type_url');
const avatarEditButton = document.querySelector('.profile__image-edit');

const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

const confirmDeleteButton = popupDelete.querySelector('.popup__button_type_confirm');

let currentUserId = null;
let pendingDeleteCardId = null;
let pendingDeleteCardElement = null;

function renderLoading(isLoading, button, defaultText = 'Сохранить') {
    button.textContent = isLoading ? 'Сохранение...' : defaultText;
}

function handleCardImageClick(cardTitle, cardImage) {
    popupImageElement.src = '';
    popupImageElement.alt = cardTitle;
    popupCaption.textContent = cardTitle;
    openModal(popupImage);
    popupImageElement.src = cardImage;
}

function handleAvatarFormSubmit(event) {
    event.preventDefault();
    const button = event.submitter;
    renderLoading(true, button);
    updateAvatar(avatarInput.value)
      .then(user => {
        profileImage.style.backgroundImage = `url(${user.avatar})`;
        closeModal(popupAvatar);
        avatarForm.reset();
        clearValidation(avatarForm, validationConfig);
      })
      .catch(err => console.error(err))
      .finally(() => renderLoading(false, button));
}

function handleLikeClick(cardId, likeButton, likeCount) {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const request = isLiked ? unlikeCard(cardId) : likeCard(cardId);
    request
      .then(card => {
        likeButton.classList.toggle('card__like-button_is-active');
        likeCount.textContent = card.likes.length;
      })
      .catch(err => console.error(err));
}

function handleDeleteClick(cardId, cardElement) {
    pendingDeleteCardId = cardId;
    pendingDeleteCardElement = cardElement;
    openModal(popupDelete);
}

function handleProfileFormSubmit(event) {
    event.preventDefault();
    const button = event.submitter;
    renderLoading(true, button);
    updateUserInfo(nameInput.value, jobInput.value)
      .then(user => {
        profileTitle.textContent = user.name;
        profileDescription.textContent = user.about;
        closeModal(popupEdit);
        clearValidation(profileFormElement, validationConfig);
      })
      .catch(err => console.error(err))
      .finally(() => renderLoading(false, button));
}

function handleNewCardSubmit(event) {
    event.preventDefault();
    const button = event.submitter;
    renderLoading(true, button, 'Создать');
    addCard(cardNameInput.value, cardLinkInput.value)
      .then(card => {
        placesList.prepend(createCard(card, currentUserId, handleDeleteClick, handleCardImageClick, handleLikeClick));
        closeModal(popupNewCard);
        newCardForm.reset();
        clearValidation(newCardForm, validationConfig);
      })
      .catch(err => console.error(err))
      .finally(() => renderLoading(false, button, 'Создать'));
}


document.querySelectorAll('.popup').forEach(popup => {
    popup.addEventListener('click', handleOverlayClose);
    popup.querySelector('.popup__close').addEventListener('click', () => closeModal(popup));
});

confirmDeleteButton.addEventListener('click', () => {
    deleteCard(pendingDeleteCardId)
      .then(() => {
        pendingDeleteCardElement.remove();
        closeModal(popupDelete);
      })
      .catch(err => console.error(err));
});

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

editButton.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    clearValidation(profileFormElement, validationConfig);
    openModal(popupEdit);
});

addButton.addEventListener('click', () => {
    clearValidation(newCardForm, validationConfig);
    openModal(popupNewCard);
});

avatarEditButton.addEventListener('click', () => {
    clearValidation(avatarForm, validationConfig);
    openModal(popupAvatar);
});

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
newCardForm.addEventListener('submit', handleNewCardSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);


enableValidation(validationConfig);

Promise.all([getUserInfo(), getCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;
    profileTitle.textContent = user.name;
    profileDescription.textContent = user.about;
    profileImage.style.backgroundImage = `url(${user.avatar})`;

    cards.forEach(card => {
      placesList.append(createCard(card, currentUserId, handleDeleteClick, handleCardImageClick, handleLikeClick));
    });
  })
  .catch(err => console.error(err));
