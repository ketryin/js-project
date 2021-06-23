import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
import { defaultModules } from './../../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from './../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
defaultModules.set(PNotifyMobile, {});
defaults.addClass = 'animate__animated animate__pulse pnotify__position';
defaults.mode = 'dark';
defaults.sticker = false;

import ApiService from './fetch-events.js';
import cardTpl from './../templates/event-card.hbs';
import animateLoader from './show-loader';
import removeLoader from './remove-loader';
import filterBiggerImage from './filter-lagest-image.js';

const paginationContainer = document.querySelector('#pagenumbers');
const favoriteStorageBtn = document.querySelector('.header-my-favorites-btn');

export default function handleFormChange(form, list, select, input) {
  const api = new ApiService();

  select.addEventListener('change', handleSelect);
  form.addEventListener('submit', handleFormChange);

  function handleFormChange(event) {
    animateLoader();
    event.preventDefault();
    api.apiQuery = input.value;
    handleFetch();
  }

  function handleSelect() {
    animateLoader();
    api.apiCountry = select.value;

    handleFetch();
  }

  function handleFetch() {
    api.resetPage();
    initPagination();
  }

  function populatePage() {
    animateLoader();
    initPagination();
  }

  function initPagination() {
    $('#pagenumbers').pagination({
      ajax: function (options, refresh, $target) {
        api.page = options.current - 1;
        api
          .fetchEvents()
          .then(function (data) {
            refresh({
              total: data.page.totalElements,
              length: data.page.size,
            });
            const insertData = data._embedded.events.map(event => {
              const eventImage = filterBiggerImage(event.images);
              event.images = [eventImage];

              paginationContainer.classList.remove('hiden');
              return cardTpl(event);
            });
            list.innerHTML = insertData.join('');
            favoriteStorageBtn.removeAttribute('on-fav-btn-click');

            const eventDates = document.querySelectorAll('.event-date');
            const eventLocations = document.querySelectorAll('.event-location');
            const themeSwitcher = document.querySelector('#theme-switch-toggle');
            const paginationPages = document.querySelectorAll('[data-page]');

            if (localStorage.theme === 'light-theme') {
              eventDates.forEach(eventDate => {
                eventDate.classList.add('dark-text');
                // localStorage.currentTextColor = 'dark';
              });
              eventLocations.forEach(eventLocation => {
                eventLocation.classList.add('dark-text');
                // localStorage.currentTextColor = 'dark';
              });
              paginationPages.forEach(pagPage => {
                pagPage.classList.add('dark-text');
              });
            }

            themeSwitcher.addEventListener('change', event => {
              if (event.currentTarget.checked) {
                eventDates.forEach(eventDate => {
                  eventDate.classList.add('dark-text');
                });
                eventLocations.forEach(eventLocation => {
                  eventLocation.classList.add('dark-text');
                });
                paginationPages.forEach(pagPage => {
                  pagPage.classList.add('dark-text');
                });
              } else {
                eventDates.forEach(eventDate => {
                  eventDate.classList.remove('dark-text');
                });
                eventLocations.forEach(eventLocation => {
                  eventLocation.classList.remove('dark-text');
                });
                paginationPages.forEach(pagPage => {
                  pagPage.classList.remove('dark-text');
                });
              }
            });

            // changeAllColorTitle(dates, locations);
          })
          .catch(er => {
            const myError = error({
              text: er,
              // text: 'Incorrect query parameters, please, try again!',
            });
            paginationContainer.classList.add('hiden');
            list.innerHTML = '';
          })
          .finally(() => {
            removeLoader();
          });
      },
    });
  }

  populatePage();
}
