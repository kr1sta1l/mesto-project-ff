const cardTemplateElement = document.querySelector('#card-template').content.querySelector('.card');

export function createCard(card, currentUserId, onDeleteClick, onImageClick, onLikeClick) {
    const cardElement = cardTemplateElement.cloneNode(true);

    const cardImageElement = cardElement.querySelector('.card__image');
    cardImageElement.src = card.link;
    cardImageElement.alt = card.name;

    cardElement.querySelector('.card__title').textContent = card.name;

    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.card__like-count');

    likeCount.textContent = card.likes.length;

    if (card.likes.some(user => user._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    likeButton.addEventListener('click', () => onLikeClick(card._id, likeButton, likeCount));

    cardImageElement.addEventListener('click', () => onImageClick(card.name, card.link));

    const deleteButton = cardElement.querySelector('.card__delete-button');
    if (card.owner._id === currentUserId) {
        deleteButton.addEventListener('click', () => onDeleteClick(card._id, cardElement));
    } else {
        deleteButton.remove();
    }

    return cardElement;
}
