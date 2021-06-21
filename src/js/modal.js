import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
import { defaultModules } from './../../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from './../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
defaultModules.set(PNotifyMobile, {});
defaults.addClass = 'animate__animated animate__flip pnotify__position';
defaults.mode = 'dark';
defaults.sticker = false;

import EventApiService from './fetch-events.js';
import modalTemplate from '../templates/modal-card-details.hbs';
import onModalButtonMoreClick from './modal-button-more-fetch';
import filterBiggerImage from './filter-lagest-image.js';

const api = new EventApiService();

const refs = {
  eventCards: document.querySelector('.events-list'),
  modalWindow: document.querySelector('#modal-card'),
  modalBtnClose: document.querySelector('[data-modal-window-close]'),
  backdrop: document.querySelector('[data-modal-backdrop]'),
  body: document.querySelector('body'),
};

refs.eventCards.addEventListener('click', onEventCardClick);
refs.backdrop.addEventListener('click', onClickBackdrop);

export function onClickBackdrop(e) {
  if (!e.target.classList.contains('backdrop__modal')) {
    return;
  }
  // refs.modalWindow.innerHTML = '';
  refs.backdrop.classList.toggle('is--hidden');
  refs.body.classList.toggle('modal-open');
}

function onCLickBtnClose() {
  const btnRef = document.querySelector('[data-modal-window-close]');
  // refs.modalWindow.innerHTML = '';

  btnRef.addEventListener('click', () => {
    refs.modalWindow.classList.toggle('is--hidden');
    refs.body.classList.toggle('modal-open');
  });
}

function onEventCardClick(e) {
  const currentCard = e.target;
  if (!currentCard.closest('.events-list__item')) {
    return;
  }

  const eventSingleCard = currentCard.closest('.events-list__item');
  refs.modalWindow.classList.toggle('is--hidden');
  refs.body.classList.toggle('modal-open');

  if (
    e.target.nodeName === 'IMG' ||
    e.target.nodeName === 'SPAN' ||
    e.target.nodeName === 'H2' ||
    e.target.nodeName === 'P' ||
    e.target.nodeName === 'LI'
  ) {
    api
      .fetchModalDetails(eventSingleCard.id, eventSingleCard.dataset.type)
      .then(data => {
        refs.modalWindow.innerHTML = modalTemplate(data);

        onCLickBtnClose();

        const modalTitleRef = document.querySelector('.modal__text');
        modalTitleRef.textContent = `${modalTitleRef.textContent.slice(0, 150)}...`;
        // console.log(modalTitleRef.textContent);

        const modalButtonMore = document.querySelector('.modal__btn__more');
        modalButtonMore.addEventListener('click', onModalButtonMoreClick);
        // console.log(data.name);

        const imageElement = document.querySelector('.modal-img-test');

        // let lagestImage = data.images[0];

        const biggestImage = filterBiggerImage(data.images);
        if (biggestImage) {
          imageElement.setAttribute('src', biggestImage.url);
        } else {
          imageElement.setAttribute(
            'src',
            'https://image.flaticon.com/icons/png/512/4076/4076525.png',
          );
        }

        const imageElementCircle = document.querySelector('.modal__circle-img');
        if (biggestImage) {
          imageElementCircle.setAttribute('src', biggestImage.url);
        } else {
          imageElementCircle.setAttribute(
            'src',
            'https://image.flaticon.com/icons/png/512/4076/4076525.png',
          );
        }
      })
      .catch(er => {
        const myError = error({
          text: 'No matches for your query, try to enter correct data',
        });
      });
  }
}
