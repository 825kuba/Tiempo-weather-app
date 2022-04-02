'use strict';

import View from './view.js';

// SELECT ELEMENTS
const logo = document.querySelector('.nav__logo');
const searchBar = document.querySelector('.nav__search');
const overlay = document.querySelector('.overlay');
const searchBarInput = document.querySelector('.nav__search input');
const searchBtn = document.querySelector('.nav__search__btn');
const clearBtn = document.querySelector('.nav__search__clear');
const searchResults = document.querySelector('.nav__search__results');

class SearchView extends View {
  parentElement = searchResults;
  // TOGGLE SEARCH BAR AND SEARCH LIST
  toggleSearchBar() {
    logo.classList.toggle('hidden');
    searchBar.classList.toggle('active');
    overlay.classList.toggle('active');
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
      this.toggleSearchBar();
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
        this.toggleSearchBar();
      }
    });

    // when overlay clicked, close search
    overlay.addEventListener('click', this.toggleSearchBar);

    // when escape pressed, close search ( only when search already opened)
    document.addEventListener('keydown', e => {
      if (e.key === `Escape` && searchBar.classList.contains('active'))
        this.toggleSearchBar();
    });
  }

  // ADD HANDLER FOR TYPING INTO SEARCH INPUT FIELD
  // when user stops typing for the given interval, the search call to API is made (otherwise the call would be made with every single key presssed)
  addHandlerSearchInput(handler) {
    // timer variable
    let typingTimeout;
    // interval variable
    const typingInterval = 1000;
    // when input field value changes run async function
    searchBarInput.addEventListener('input', async () => {
      // clear any potential timeout from before
      clearTimeout(typingTimeout);
      // get input field value
      const query = searchBarInput.value;
      // if there is any value, run timeout, when it finishes, run function
      if (query)
        typingTimeout = setTimeout(() => {
          // if query is less then 3 characters, return (API doesnt find anything in that case)
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
        <li class="nav__search-item">
          <p class="message">We couldn't find anything :(</p>
        </li>
      `;
      searchResults.insertAdjacentHTML('beforeend', markup);
    }
    // for every item in array insert HTML markup
    array.map(item => {
      const markup = `
        <li class="nav__search-item">
          <p>${item.name}</p>
          <span>${item.region ? `${item.region}, ` : ''}${item.country}</span>
        </li>
      `;
      searchResults.insertAdjacentHTML('beforeend', markup);
    });
  }

  // ADD HANDLER FOR CLICKING ON ONE OF THE SEARCH RESULTS
  addHandlerSearchResult(handler) {
    searchResults.addEventListener('click', e => {
      // get the clicked search result's name
      const target = e.target
        .closest('.nav__search-item')
        .querySelector('p').innerHTML;
      if (!target) return;
      // run handler with that name as argument
      handler(target);
      // focus out of input field - this closes keyboard on mobile
      searchBarInput.blur();
    });
  }

  addHandlerSubmitForm(handler) {
    searchBar.addEventListener('submit', e => {
      e.preventDefault();
      const query = searchBarInput.value;
      if (!query || query.length < 3) return;
      // run handler with query as argument
      handler(query);
      // focus out of input field - this closes keyboard on mobile
      searchBarInput.blur();
    });
  }
}

export default new SearchView();
