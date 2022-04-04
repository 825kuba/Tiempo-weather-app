import * as model from './model.js';
import navView from './views/navView.js';
import searchView from './views/searchView.js';
import CardView from './views/cardView.js';
import mainView from './views/mainView.js';
import cardView from './views/cardView.js';

// CONTROL DYNAMIC DISPLAYING OF SEARCH RESULTS IN SEARH LIST
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
async function getForecastData(query) {
  try {
    // show spinner
    mainView.renderSpinner();
    // clear search input field and results list
    searchView.clearSearch();
    // close search bar
    searchView.closeSearchBar();
    // get data from api
    const data = await model.getForecastData(query);
    // save data to state object
    model.state.mainCard = new CardView(
      data.location.name,
      data.location.region,
      data.location.country,
      data.location.localtime,
      data.current.is_day,
      data.current,
      data.forecast
    );
    // clear view
    mainView.clearView();
    // render new first card
    model.state.mainCard.cardInit();
    // hide spinner
    mainView.renderSpinner();
  } catch (err) {
    mainView.clearView();
    mainView.renderSpinner();
    mainView.renderError(err.message);
  }
}

// CONTORL GETTING FORECAST DATA BASED ON USER'S LOCATION
async function getForecastDataByPosition() {
  try {
    // try getting coords
    const position = await model.getUserPosition();
    // save them in string
    const query = `${position.coords.latitude},${position.coords.longitude}`;
    // run function with the string as argument
    getForecastData(query);
  } catch (err) {
    // if getUserPosition function returned rejected promise, then clear view and display error based on the error object's code
    mainView.clearView();
    if (err.code === 1) mainView.renderError('Geolocation denied :(');
    if (err.code === 2) mainView.renderError('Geolocation request failed :(');
    if (err.code === 3)
      mainView.renderError('Geolocation request timed out :(');
  }
}

function init() {
  navView.addHandlerMobileMenu();
  mainView.addHandlerSideScrollArrows();
  searchView.addHandlerSearchControls();
  searchView.addHandlerSearchInput(getListOfSearchResults);
  searchView.addHandlerSearchResult(getForecastData);
  searchView.addHandlerSubmitForm(getForecastData);
  // getForecastDataByPosition();
  searchView.addHandlerLocationBtn(getForecastDataByPosition);
}

init();
