import * as model from './model.js';
import navView from './views/navView.js';
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
    console.error('💥', err.message);
  }
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
      data.location.name,
      data.location.region,
      data.location.country,
      data.location.localtime,
      data.current.is_day,
      data.current,
      data.forecast,
      isFavourite
    );
    // clear view
    mainView.clearView();
    // render new card
    model.state.mainCard.cardInit(model.addOrRemoveCard);
  } catch (err) {
    // error handling
    mainView.clearView();
    mainView.renderError(err.message);
  }
}

// CONTORL GETTING FORECAST DATA BASED ON USER'S LOCATION
async function controlForecastByPosition() {
  try {
    // clear view
    mainView.clearView();
    // show spinner
    mainView.renderSpinner();
    // try getting coords
    const position = await model.getUserPosition();
    // save them in string
    const query = `${position.coords.latitude},${position.coords.longitude}`;
    // run function with the string as argument
    controlForecastByQuery(query);
  } catch (err) {
    // if getUserPosition function returned rejected promise, then clear view and display error based on the error object's code
    mainView.clearView();
    if (err.code === 1) mainView.renderError('Geolocation denied :(');
    if (err.code === 2) mainView.renderError('Geolocation request failed :(');
    if (err.code === 3)
      mainView.renderError('Geolocation request timed out :(');
  }
}

// CONTROL GETTING FORECAST DATA FOR ALL FAVOURITE CARDS
async function controlForecastForFavourites() {
  try {
    // if there is no favourite card, return
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
        model.getForecastData(`${card.city} ${card.region} ${card.country}`)
      )
    );
    // fetch all data from that array
    const updatatedFavs = await Promise.all(promises);
    // clear old favourites array
    model.state.favourites.splice(0);
    // create new favourite card for each API response and push it to favourites array to keep it updated
    updatatedFavs.forEach(data => {
      const isFavourite = true;
      const card = new CardView(
        data.location.name,
        data.location.region,
        data.location.country,
        data.location.localtime,
        data.current.is_day,
        data.current,
        data.forecast,
        isFavourite
      );
      model.state.favourites.push(card);
    });
    // clear main view
    mainView.clearView();
    // render all favourite cards
    model.state.favourites.forEach(card => {
      card.cardInit(model.addOrRemoveCard);
    });
    mainView.initSideScroll(model.state.favourites.length);
  } catch (err) {
    // error handling
    mainView.clearView();
    mainView.renderError(err.message);
  }
}

function init() {
  model.getLocalStorage();
  navView.addHandlerMobileMenu();
  navView.addHandlerLogo();
  navView.addHandlerFavouritesBtn(controlForecastForFavourites);
  navView.displayNumOfFavourites(model.state.favourites.length);
  navView.addHandlerInfoBtn();
  navView.addHandlerSettingsBtn();
  modalView.addHandlerModalOverlay();
  searchView.addHandlerSearchControls();
  searchView.addHandlerSearchInput(controlSearchResults);
  searchView.addHandlerSearchResult(controlForecastByQuery);
  searchView.addHandlerSubmitForm(controlForecastByQuery);
  // controlForecastByPosition();
  searchView.addHandlerLocationBtn(controlForecastByPosition);
  mainView.addHandlersSideScrolling();

  document.querySelector('.modal__settings').addEventListener('change', e => {
    console.log(e.target.checked);
    console.log(e.target);
  });
}

init();
