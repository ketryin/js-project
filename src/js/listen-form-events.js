import ApiService from './fetch-events.js';
import cardTpl from './../templates/event-card.hbs';
import debounce from 'lodash.debounce';
import animateLoader from './show-loader';
import removeLoader from './remove-loader';

export default function handleFormChange(form, list, select, input, loader) {
  const api = new ApiService();

  input.addEventListener('input', debounce(handleInput, 500));

  select.addEventListener('change', handleSelect);

  // form.addEventListener('change', handleFormChange);
  function handleFormChange(event) {
    event.preventDefault();
    if (event.target.nodeName === 'INPUT') {
      api.apiQuery = event.target.value;
    }
    if (event.target.nodeName === 'SELECT') {
      api.apiCountry = event.target.value;
    }
    populatePage();
  }

  function handleInput(event) {
    animateLoader();
    if (event.target.value === '') {
      removeLoader();
      return;
    }
    api.apiQuery = event.target.value;
    populatePage();
  }

  function handleSelect() {
    animateLoader();
    api.apiCountry = select.options[select.selectedIndex].value;
    populatePage();
  }
  
  function populatePage() {
    api
      .fetchEvents()
      .then(data => {
        updatePaginator(data._embedded.events);
      })
      .catch(alert)
      .finally(() => {
        removeLoader();
      });
  }

  function updatePaginator(data) {
    $('.pagenumbers').pagination({
      dataSource: data,
      pageSize: 20,
      showPrevious: false,
      showNext: false,
      callback: function (data, pagination) {
        list.innerHTML = cardTpl(data)
      }
    });
  }
}

/* 
function updatePaginator(data) {
  $('.pagenumbers').pagination({
    dataSource: api.fetchEvents(),
    locator: data, или такая запись '_embeded.events'
    totalNumberLocator: function(response) {  //Это у меня page data.page
        // you can return totalNumber by analyzing response content
        return Math.floor(Math.random() * (1000 - 100)) + 100;
    },
    pageSize: 20,
    showPrevious: false,
    showNext: false,
    ajax: {  // тут не совсем понял
        beforeSend: function() {
            dataContainer.html('Loading data from flickr.com ...');
        }
    },
      callback: function (data, pagination) {
        list.innerHTML = cardTpl(data)
      }
  })
}
*/