const GROUP = 'cohort4';
const BASE_URL = 'http://95.216.175.5/';
const TOKEN = '92287dd9-da1e-4d69-917d-e8545246257c';

class Api {
    constructor(group, url, token) {
        this.baseUrl = `${url}${group}`;
        this.token = token;
    }
  
    // CARDS
    getInitialCards() {
        return this.request({ path: '/cards' });
    }
  
    addCard(name, link) {
        const requestConfig = {
            method: 'POST',
            path: '/cards',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, link }),
        };

        return this.request(requestConfig);
    }

    deleteCard(cardId) {
        const requestConfig = {
            method: 'DELETE',
            path: `/cards/${cardId}`,
        };

        return this.request(requestConfig);
    }
  
    likeCard(cardId) {
        const requestConfig = {
            method: 'PUT',
            path: `/cards/like/${cardId}`,
        };

        return this.request(requestConfig);
    }
  
    dislikeCard(cardId) {
        const requestConfig = {
            method: 'DELETE',
            path: `/cards/like/${cardId}`,
        };

        return this.request(requestConfig);
    }
  
    // USER INFO
    getUserInfo() {
        return this.request({ path: '/users/me' });
    }
  
    editUserInfo(name, about) {
        const requestConfig = {
            method: 'PATCH',
            path: '/users/me',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, about }),
        };

        return this.request(requestConfig);
    }
  
    changeAvatar(avatar) {
        const requestConfig = {
            method: 'PATCH',
            path: '/users/me/avatar',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar }),
        };

        return this.request(requestConfig);
    }
    
    request({ path, method = 'GET', headers = {}, body }) {
        return fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                authorization: this.token,
                ...headers,
            },
            body,
        })
            .then(res =>  {
                return this.checkRequest(res);
            })
            .catch(err => {
                this.handleRequestError(err);
            });
    }
    
    checkRequest(res) {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
    }
    
    handleRequestError(err) {
        console.log(err);
    }
}

/**
 * Отличная работа
 * 
 * Можно лучше: лучше все js файлы переложить в отдельную папку, а то в корне не очень как-то
 * 
 * весь функционал проверил, всё работает без ошибок
 * 
 * Класс Api отлично написан, не ожидал такого.
 * 
 * файл validateService.js прям просит чтоб из него сделали validateService.js
 * 
 * норм Джокер ;)
 * 
 * Работу принимаю и жду Вас в следующих спринтах
 * 
 * @koras
 * 
 */