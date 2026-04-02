const cardTemplateElement = document.querySelector('#card-template').content.querySelector('.card');

export function createCard(cardTitle, cardImage, onDeleteCard, onImageClick) {
    const cardElement = cardTemplateElement.cloneNode(true);

    const cardImageElement = cardElement.querySelector('.card__image');
    cardImageElement.src = cardImage;
    cardImageElement.alt = cardTitle;

    cardElement.querySelector('.card__title').textContent = cardTitle;
    cardElement.querySelector('.card__like-button').addEventListener('click', handleLikeCard);
    cardElement.querySelector('.card__delete-button').addEventListener('click', onDeleteCard);
    cardImageElement.addEventListener('click', () => onImageClick(cardTitle, cardImage));

    return cardElement;
}

export function handleLikeCard(event) {
    event.target.classList.toggle('card__like-button_is-active');
}

export function deleteCard(event) {
    const card = event.target.closest('.card');
    card.remove();
}
