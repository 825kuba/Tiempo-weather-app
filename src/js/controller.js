import * as model from './model.js';
import headerView from './views/headerView.js';
import searchView from './views/searchView.js';
import { CardView } from './views/cardView.js';
import mainView from './views/mainView.js';
import * as helpers from './helpers.js';
import modalView from './views/modalView.js';

// CONTROL DYNAMIC DISPLAYING OF SEARCH RESULTS IN SEARH LIST
async function controlSearchResults(query) {
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
    console.error(err.message);
    mainView.renderError(err.message);
  }
}

// CONTROL RENDERING MAIN CARD
async function controlForecastForMainCard(query) {
  // get data from api
  const data = await model.getForecastData(query);
  //check for already existing card in favourites array
  const isFavourite = model.state.favourites.some(
    card =>
      card.id ===
      helpers.generateId(
        data.location.name,
        data.location.region,
        data.location.country
      )
  );
  // save data to state object
  model.state.mainCard = new CardView(
    data.location,
    data.current,
    data.forecast,
    isFavourite,
    model.state.settings.units
  );
  // clear view
  mainView.clearView();
  // render new card
  model.state.mainCard.cardInit(model.addOrRemoveCard);
}

// CONTOL GETTING FORECAST DATA AFTER CLICKING ON A SEARCH RESULT OR SUBMITING SEARCH FORM
async function controlForecastByQuery(query) {
  try {
    // clear search input field and results list
    searchView.clearSearch();
    // close search bar
    searchView.closeSearchBar();
    // clear view
    mainView.clearView();
    // show spinner
    mainView.renderSpinner();
    // get forecast data and render card
    await controlForecastForMainCard(query);
    // change background img
    mainView.changeBackground(model.state.mainCard, model.state.settings);
  } catch (err) {
    // error handling
    mainView.clearView();
    console.error(err);
    mainView.renderError(err.message);
  }
}

// CONTORL GETTING FORECAST DATA BASED ON USER'S LOCATION
async function controlForecastByPosition() {
  try {
    // clear search input field and results list
    searchView.clearSearch();
    // close search bar
    searchView.closeSearchBar();
    // clear view
    mainView.clearView();
    // show spinner
    mainView.renderSpinner();
    // try getting coords
    const position = await model.getUserPosition();
    // save them in string
    const query = `${position.coords.latitude},${position.coords.longitude}`;
    // get forecast data and render card
    await controlForecastForMainCard(query);
    // change background img
    mainView.changeBackground(model.state.mainCard, model.state.settings);
  } catch (err) {
    // if getUserPosition function returned rejected promise, then clear view and display error based on the error object's code
    mainView.clearView();
    if (err.code === 1) {
      console.error(err.message);
      mainView.renderError('Geolocation denied :(');
    }
    if (err.code === 2) {
      console.error(err.message);
      mainView.renderError('Geolocation request failed :(');
    }
    if (err.code === 3) {
      console.error(err.message);
      mainView.renderError('Geolocation request timed out :(');
    } else {
      console.error(err.message);
      mainView.renderError(err.message);
    }
  }
}

// CONTROL GETTING FORECAST DATA FOR ALL FAVOURITE CARDS
async function controlForecastForFavourites() {
  try {
    // if there is no favourite cards, return
    if (!model.state.favourites.length) return;
    // clear search input field and results list
    searchView.clearSearch();
    // close search bar
    searchView.closeSearchBar();
    // clear main view
    mainView.clearView();
    // show spinner
    mainView.renderSpinner();
    // make array of API calls for each favourite card
    const promises = [];
    model.state.favourites.forEach(card =>
      promises.push(
        model.getForecastData(
          `${card.location.name} ${card.location.region} ${card.location.country}`
        )
      )
    );
    // fetch all data from that array
    const updatatedFavs = await Promise.all(promises);
    // clear old favourites array
    model.state.favourites.splice(0);
    // create new favourite card for each API response and push it to favourites array to update it
    updatatedFavs.forEach(data => {
      const isFavourite = true;
      const card = new CardView(
        data.location,
        data.current,
        data.forecast,
        isFavourite,
        model.state.settings.units
      );
      model.state.favourites.push(card);
    });
    // clear main view
    mainView.clearView();
    // render all favourite cards
    model.state.favourites.forEach(card => {
      card.cardInit(model.addOrRemoveCard);
    });
    // allow side scrolling
    mainView.initSideScroll(model.state.favourites.length);
    // change background img
    mainView.changeBackground(model.state.favourites[0], model.state.settings);
  } catch (err) {
    // error handling
    mainView.clearView();
    console.error(err.message);
    mainView.renderError(err.message);
  }
}

function controlSettings(newSettings) {
  // update state object
  model.state.settings = newSettings;
  // save state object to local storage
  model.setLocalStorage();
  // get number of cards being displayed
  const numOfCards = mainView.getNumberOfCardsDisplayed();
  // if there are no cards displayed, no action is needed
  if (!numOfCards) return;
  // clear view
  mainView.clearView();
  // if there is one card displayed
  if (numOfCards === 1) {
    //update settings for card
    model.state.mainCard.settings = model.state.settings.units;
    // render card again
    model.state.mainCard.cardInit(model.addOrRemoveCard);
    // change background img
    mainView.changeBackground(model.state.mainCard, model.state.settings);
  }
  // if there is more than 1 card displayed
  if (numOfCards > 1) {
    // for each card
    model.state.favourites.forEach(card => {
      //update settings for card
      card.settings = model.state.settings.units;
      // render card again
      card.cardInit(model.addOrRemoveCard);
    });
    // reset the scrolling
    mainView.initSideScroll(model.state.favourites.length);
    // switch smooth scroll on or off
    if (model.state.settings.smoothScroll) modalView.setSmoothScrollOn();
    else modalView.setSmoothScrollOff();
    // change background img
    mainView.changeBackground(model.state.favourites[0], model.state.settings);
  }
}

function controlResetSettings() {
  modalView.initSettings(model.state.settings);
}

function init() {
  model.getLocalStorage();
  headerView.addHandlerMobileMenu();
  headerView.addHandlerLogo();
  headerView.addHandlerFavouritesBtn(controlForecastForFavourites);
  headerView.displayNumOfFavourites(model.state.favourites.length);
  headerView.addHandlerInfoBtn();
  headerView.addHandlerSettingsBtn();
  modalView.initSettings(model.state.settings);
  modalView.addHandlerSettings(controlSettings);
  modalView.addHandlerModalOverlay(controlResetSettings);
  modalView.addHandlerCLoseBtn(controlResetSettings);
  modalView.addHandlerEscapeKey(controlResetSettings);
  searchView.addHandlerSearchControls();
  searchView.addHandlerSearchInput(controlSearchResults);
  searchView.addHandlerSearchResult(controlForecastByQuery);
  searchView.addHandlerSubmitForm(controlForecastByQuery);
  controlForecastByPosition();
  searchView.addHandlerLocationBtn(controlForecastByPosition);
  mainView.addHandlersSideScrolling(model.state);
}

init();
