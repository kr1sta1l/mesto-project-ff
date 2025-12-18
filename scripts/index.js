// Темплейт карточки
const cardTemplateElement = document.querySelector('#card-template').content.querySelector('.card');

// DOM узлы
const placesList = document.querySelector('.places__list');


// Функция создания карточки
function createCard(cardTitle, cardImage, onDeleteCard) {
    const cardElement = cardTemplateElement.cloneNode(true);
    cardElement.querySelector('.card__image').src = cardImage;
    cardElement.querySelector('.card__title').textContent = cardTitle;
    cardElement.querySelector('.card__like-button').addEventListener('click', function (event) {
        event.target.classList.toggle('card__like-button_is-active')
    });
    cardElement.querySelector('.card__delete-button').addEventListener('click', onDeleteCard);
    return cardElement;
  }


// Функция удаления карточки
function deleteCard(event) {
    const card = event.target.closest('.card');
    card.remove();
}


// Вывести карточки на страницу
initialCards.forEach(card => {
    placesList.append(createCard(card.name, card.link, deleteCard));
});
