import { Popup } from './modules/Popup';
import { Api, SERVER_URL, GROUP, TOKEN } from './modules/Api';
import { CardList } from './modules/CardList';
import { checkFormValidness, validateInput } from './services/validateService';
import '../pages/index.css';

const api = new Api(GROUP, SERVER_URL, TOKEN);

// USER INFO SERVICE

let userId = null;

const nameElement = document.querySelector('.user-info__name');
const aboutElement = document.querySelector('.user-info__job');
const avatarElement = document.querySelector('.user-info__photo');
const changeAvatarPopup = document.querySelector('.popup_type_change-avatar');
const changeAvatarPopupClose = changeAvatarPopup.querySelector('.popup__close');
const avatarForm = changeAvatarPopup.querySelector('.popup__form');
const avatarLink = changeAvatarPopup.querySelector('.popup__input_type_link-url');
const changeAvatarSubmit = changeAvatarPopup.querySelector('.popup__button');

const changeAvatarModal = new Popup(changeAvatarPopup);

api.getUserInfo()
    .then(result => {
        const { name, about, avatar, _id } = result;

        nameElement.textContent = name;
        aboutElement.textContent = about;
        avatarElement.style.backgroundImage = `url(${avatar})`;

        userId = _id;
    });

function handleChangeAvatar(event) {
    event.preventDefault();

    changeAvatarSubmit.textContent = 'Загрузка...';

    api.changeAvatar(avatarLink.value)
        .then(result => {
            avatarForm.reset();

            avatarElement.style.backgroundImage = `url(${result.avatar})`;

            changeAvatarModal.close();
        })
        .finally(() => {
            changeAvatarSubmit.textContent = 'Сохранить';
        });
}

function hadleInputAvatar(event) {
    checkFormValidness(avatarForm, changeAvatarSubmit);
    validateInput(event.target);
}

avatarLink.addEventListener('input', hadleInputAvatar);
avatarElement.addEventListener('click', changeAvatarModal.open.bind(changeAvatarModal));
changeAvatarPopupClose.addEventListener('click', changeAvatarModal.close.bind(changeAvatarModal));
avatarForm.addEventListener('submit', handleChangeAvatar);

// CARD SERVICE

const listElement = document.querySelector('.places-list');
const addButton = document.querySelector('.user-info__button');
const addCardPopup = document.querySelector('.popup_type_add-card');
const addCardPopupClose = addCardPopup.querySelector('.popup__close');
const newCardForm = addCardPopup.querySelector('.popup__form');
const newCardName = addCardPopup.querySelector('.popup__input_type_name');
const newCardLink = addCardPopup.querySelector('.popup__input_type_link-url');
const addCardSubmit = addCardPopup.querySelector('.popup__button');

const newCardModal = new Popup(addCardPopup);
let cardList = [];
setInitialCards();

function setInitialCards() {
    api.getInitialCards()
        .then(result => {
            cardList = new CardList(listElement, result, userId);
        });
}

function hadleInputNewCard(event) {
    checkFormValidness(newCardForm, addCardSubmit);
    validateInput(event.target);
}

function handleAddCard(event) {
    event.preventDefault();

    addCardSubmit.textContent = 'Загрузка...';

    api.addCard(newCardName.value, newCardLink.value)
        .then(result => {
            newCardForm.reset();
        
            cardList.addCard(result);

            newCardModal.close();
        })
        .finally(() => {
            addCardSubmit.textContent = 'Сохранить';
        });
}

newCardName.addEventListener('input', hadleInputNewCard);
newCardLink.addEventListener('input', hadleInputNewCard);
addButton.addEventListener('click', newCardModal.open.bind(newCardModal));
addCardPopupClose.addEventListener('click', newCardModal.close.bind(newCardModal));
newCardForm.addEventListener('submit', handleAddCard);

// EDIT PROFILE SERVICE

const editButton = document.querySelector('.user-info__edit');
const editProfilePopup = document.querySelector('.popup_type_edit_profile');
const editProfilePopupClose = editProfilePopup.querySelector('.popup__close');
const editUserForm = editProfilePopup.querySelector('.popup__form');
const newUserName = editProfilePopup.querySelector('.popup__input_type_user-name');
const newUserAbout = editProfilePopup.querySelector('.popup__input_type_about');
const userNameElement = document.querySelector('.user-info__name');
const userAboutElement = document.querySelector('.user-info__job');
const editProfileSubmit = editProfilePopup.querySelector('.popup__button');

const editProfileModal = new Popup(editProfilePopup);

function handleOpenModal() {
    newUserName.value = userNameElement.textContent;
    newUserAbout.value = userAboutElement.textContent;

    editProfileModal.open();
}

function handleSaveUserInfo(event) {
    event.preventDefault();

    editProfileSubmit.textContent = 'Загрузка...';

    api.editUserInfo(newUserName.value, newUserAbout.value)
        .then(result => {
            const { name, about } = result;

            userNameElement.textContent = name;
            userAboutElement.textContent = about;
    
            editUserForm.reset();
    
            editProfileModal.close();
        })
        .finally(() => {
            editProfileSubmit.textContent = 'Сохранить';
        });
}

function hadleInputUserInfo(event) {
    checkFormValidness(editUserForm, editProfileSubmit);
    validateInput(event.target);
}

newUserName.addEventListener('input', hadleInputUserInfo);
newUserAbout.addEventListener('input', hadleInputUserInfo);
editButton.addEventListener('click', handleOpenModal);
editProfilePopupClose.addEventListener('click', editProfileModal.close.bind(editProfileModal));
editUserForm.addEventListener('submit', handleSaveUserInfo);

// IMAGE POPUP

const list = document.querySelector('.places-list');
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const imagePopupClose = imagePopup.querySelector('.popup__image-close');

function openImageModal(clickedElement) {
    imagePopup.classList.add('popup_is-opened');
    const { backgroundImage } = clickedElement.style;
    const url = backgroundImage.slice(5, backgroundImage.length - 2);
    popupImage.src = url;
}

function closeImageModal() {
    imagePopup.classList.remove('popup_is-opened');
    popupImage.style.backGroundImage = '';
}

function handleClickList(event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('place-card__delete-icon')) {
        return;
    } else if (clickedElement.classList.contains('place-card__image')) {
        openImageModal(clickedElement);
    }
}

imagePopupClose.addEventListener('click', closeImageModal);
list.addEventListener('click', handleClickList);
