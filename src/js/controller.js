import * as model from './model.js';
import navView from './views/navView.js';
import searchView from './views/searchView.js';
import CardView from './views/cardView.js';
import mainBoxView from './views/mainBoxView.js';

// CONTROL DYNAMIC DISPLAYING OF SEARCH RESULTS IN SEARH LIST
// argument passed in in searchView file
async function getListOfSearchResults(query) {
  try {
    // if no query, return
    if (!query) return;
    searchView.renderSpinner();
    // save search query to the state object
    model.state.search.query = query;
    // get data for search query
    const results = await model.getSearchData(model.state.search.query);
    // if there's not data, return
    if (!results) return;
    // save data to state object
    model.state.search.results = results;
    // render search results
    searchView.renderSearchResults(model.state.search.results);
  } catch (err) {
    console.error('💥', err.message);
  }
}

// CONTOL GETTING FORECAST DATA AFTER CLICKING ON A SEARCH RESULT OR SUBMITING SEARCH FORM
// argument passed in in searchView file
async function getForecastData(query) {
  try {
    // show spinner
    mainBoxView.renderSpinner();
    // clear search input field and results list
    searchView.clearSearch();
    // close search bar
    searchView.toggleSearchBar();
    // get data from api
    const data = await model.getForecastData(query);
    // if there's not data, return
    // if (!data) return;
    if (data.error) {
      throw new Error(data.error.message);
    }

    // save data to state object
    model.state.firstCard = new CardView(
      data.location.name,
      data.location.region,
      data.location.country,
      data.location.localtime,
      data.current.is_day,
      data.current,
      data.forecast
    );
    // delete first card
    mainBoxView.removeFirstCard();
    // render new first card
    model.state.firstCard.renderCard();
    // hide spinner
    mainBoxView.renderSpinner();
  } catch (err) {
    console.error('💥', err.message);
  }
}

function init() {
  navView.addHandlerMobileMenu();
  mainBoxView.addHandlerSideScrollArrows();
  searchView.addHandlerSearchControls();
  searchView.addHandlerSearchInput(getListOfSearchResults);
  // model.getForecastData('nelson');
  searchView.addHandlerSearchResult(getForecastData);
  searchView.addHandlerSubmitForm(getForecastData);
}

init();
