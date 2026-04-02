import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, deleteCard } from './scripts/card.js';
import { openModal, closeModal, handleOverlayClose } from './scripts/modal.js';

const placesList = document.querySelector('.places__list');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const formElement = document.querySelector('[name="edit-profile"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

const newCardForm = document.querySelector('[name="new-place"]');
const cardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardForm.querySelector('.popup__input_type_url');

const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');


function handleCardImageClick(cardTitle, cardImage) {
    popupImageElement.src = '';
    popupImageElement.alt = cardTitle;
    popupCaption.textContent = cardTitle;
    openModal(popupImage);
    popupImageElement.src = cardImage;
}

function handleFormSubmit(event) {
    event.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(popupEdit);
}

function handleNewCardSubmit(event) {
    event.preventDefault();
    placesList.prepend(createCard(cardNameInput.value, cardLinkInput.value, deleteCard, handleCardImageClick));
    newCardForm.reset();
    closeModal(popupNewCard);
}


document.querySelectorAll('.popup').forEach(popup => {
    popup.addEventListener('click', handleOverlayClose);
    popup.querySelector('.popup__close').addEventListener('click', () => closeModal(popup));
});

editButton.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    openModal(popupEdit);
});

addButton.addEventListener('click', () => openModal(popupNewCard));

formElement.addEventListener('submit', handleFormSubmit);
newCardForm.addEventListener('submit', handleNewCardSubmit);


initialCards.forEach(card => {
    placesList.append(createCard(card.name, card.link, deleteCard, handleCardImageClick));
});
