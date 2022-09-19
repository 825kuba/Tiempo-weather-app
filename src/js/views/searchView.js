'use strict';

import Spinner from './spinnerView.js';

// SELECT ELEMENTS
const logo = document.querySelector('.nav__logo');
const searchBar = document.querySelector('.nav__search');
const searchOverlay = document.querySelector('.overlay--search');
const searchBarInput = document.querySelector('.nav__search input');
const searchBtn = document.querySelector('.nav__search__btn');
const clearBtn = document.querySelector('.nav__search__clear');
const searchList = document.querySelector('.nav__search__list');
const searchResults = document.querySelector('.nav__search__results');

class SearchView extends Spinner {
  parentElement = searchResults;

  // OPEN OR CLOSE SEARCH BAR
  openSearchBar() {
    logo.classList.add('hidden');
    searchBar.classList.add('active');
    searchOverlay.classList.add('active');
  }
  closeSearchBar() {
    logo.classList.remove('hidden');
    searchBar.classList.remove('active');
    searchOverlay.classList.remove('active');
    // focus out of input field - this closes keyboard on mobile
    searchBarInput.blur();
  }

  // CLEAR INPUT FIELD AND SEARCH RESULTS LIST
  clearSearch() {
    //clear search results
    searchResults.innerHTML = '';
    // clear input field
    searchBarInput.value = '';
    // focus input field
    searchBarInput.focus();
  }

  // ADD HANDLERS TO OPEN AND CLOSE SEARCH
  addHandlerSearchControls() {
    // when search btn clicked, toggle search bar and focus input field
    searchBtn.addEventListener('click', e => {
      e.preventDefault();
      this.openSearchBar();
      searchBarInput.focus();
    });

    // when clear btn clicked
    clearBtn.addEventListener('click', e => {
      e.preventDefault();
      // if input fieldn isn't empty, clear it
      if (searchBarInput.value !== '') {
        this.clearSearch();
      } else {
        // if it is empty, close search
        this.closeSearchBar();
      }
    });

    // when overlay clicked, close search
    searchOverlay.addEventListener('click', this.closeSearchBar);

    // when escape pressed, close search ( only when search already opened)
    document.addEventListener('keydown', e => {
      if (e.key === `Escape` && searchBar.classList.contains('active'))
        this.closeSearchBar();
    });
  }

  // ADD HANDLER FOR TYPING INTO SEARCH INPUT FIELD
  // when user stops typing for the given interval, the search call to API is made (otherwise the call would be made with every single key presssed)
  addHandlerSearchInput(handler) {
    // timer variable
    let typingTimeout;
    // interval variable
    const typingInterval = 500;
    // when input field value changes run async function
    searchBarInput.addEventListener('input', async () => {
      // clear any potential timeout from before
      clearTimeout(typingTimeout);
      // get input field value
      const query = searchBarInput.value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
      // if there is any value, run timeout, when it finishes, run function
      if (query)
        typingTimeout = setTimeout(() => {
          // if query is less then 3 characters, return (API wouldn't find anything in that case)
          if (query.length < 3) return;
          // run the handler function with query as argument
          handler(query);
        }, typingInterval);
    });
  }

  // RENDER SEARCH RESULTS LIST
  renderSearchResults(array) {
    // empty elements inner HTML
    searchResults.innerHTML = '';
    // if array is empty, render message
    if (!array.length) {
      const markup = `
        <li class="nav__search__item">
          <p class="message" aria-label="Error message">We couldn't find anything :(</p>
        </li>
      `;
      searchResults.insertAdjacentHTML('beforeend', markup);
    }
    // for every item in array insert HTML markup
    array.map(item => {
      const markup = `
        <li class="nav__search__item">
          <p>${item.name}</p>
          <span>${item.region ? `${item.region}, ` : ''}${item.country}</span>
        </li>
      `;
      searchResults.insertAdjacentHTML('beforeend', markup);
    });
  }

  // ADD HANDLER FOR CLICKING 'USE MY LOCATION' BTN
  addHandlerLocationBtn(handler) {
    searchList.addEventListener('click', e => {
      // find the button
      const target = e.target.closest('.location');
      if (!target) return;
      // run handler
      handler();
    });
  }

  // ADD HANDLER FOR CLICKING ON ONE OF THE SEARCH RESULTS
  addHandlerSearchResult(handler) {
    searchResults.addEventListener('click', e => {
      // get the clicked search-item element
      const target = e.target.closest('.nav__search__item');
      if (!target) return;
      //get city name
      const city = target.querySelector('p').innerHTML;
      // get country (and region) name
      const country = target.querySelector('span').innerHTML;
      // create query string
      const query = `${city} ${country}`;
      // run handler with that query as argument
      handler(query);
    });
  }

  // ADD HANDLE RFOR SUBMITING THE FORM - PRESSING ENTER
  addHandlerSubmitForm(handler) {
    searchBar.addEventListener('submit', e => {
      e.preventDefault();
      const query = searchBarInput.value;
      // if query is less then 3 characters, return (API wouldn't find anything in that case)
      if (!query || query.length < 3) return;
      // run handler with query as argument
      handler(query);
    });
  }
}

export default new SearchView();
