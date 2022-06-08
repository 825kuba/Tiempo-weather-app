'use strict';

// STATE OBJECT USED TO KEEP ALL DATA
export const state = {
  search: {
    query: '',
    results: [],
  },
  mainCard: {},
  favourites: [],
  settings: {
    units: {
      temp: 'c',
      wind: 'kph',
      rain: 'mm',
      time: 'h24',
    },
    smoothScroll: false,
    bgImg: true,
  },
};

// GET LIST OF SEARCH RESULTS BASED ON QUERY
export const getSearchData = async searchQuery => {
  try {
    // get data from API
    const response = await fetch(
      `/.netlify/functions/fetch-weather?searchQuery=${searchQuery}`
    );
    // error handling
    if (!response.ok) throw new Error(response.status);
    // return converted response data
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

// GET FORECAST DATA BASED ON QUERY
export const getForecastData = async query => {
  try {
    // get data from API
    const response = await fetch(
      `/.netlify/functions/fetch-weather?query=${query}`
    );
    // error handling
    if (!response.ok) throw new Error(`We couldn't find anything :(`);
    // return converted response data
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};

// GET USERS POSITION
export const getUserPosition = () =>
  // return promise
  new Promise((resolve, reject) => {
    // if device has geolocation
    if (navigator.geolocation)
      // run method for getting position
      navigator.geolocation.getCurrentPosition(
        // success - return position object as resolved promise
        // fail - return error object as rejected promise
        resolve,
        reject
      );
  });

// ADD/REMOVING CARDS TO/FROM FAVOURITES
export const addOrRemoveCard = clickedCard => {
  // determine whether card is already in favourites
  const isFavourite = state.favourites.some(card => card.id === clickedCard.id);
  // if it is, remove it from there
  if (isFavourite) {
    const index = state.favourites.findIndex(
      card => card.id === clickedCard.id
    );
    state.favourites.splice(index, 1);
    // else add it to favourites
  } else {
    state.favourites.push(clickedCard);
    state.favourites[state.favourites.length - 1].isFavourite = true;
  }
  // save favourites to local storage
  setLocalStorage();
  // return array length - value used by card's addHandlerFavouriteBtn method
  return state.favourites.length;
};

// SAVING FAVOURITE PLACES AND SETTINGS TO LOCAL STORAGE
export const setLocalStorage = () => {
  //favourites
  localStorage.setItem('tiempoFavourites', JSON.stringify(state.favourites));
  //settings
  localStorage.setItem('tiempoSettings', JSON.stringify(state.settings));
};

// GETTING FAVOURITE PLACES AND SETTINGS FROM LOCAL STORAGE
export const getLocalStorage = () => {
  //favourites
  const favourites = localStorage.getItem('tiempoFavourites');
  // if object in local storage exists, update state object
  if (favourites && favourites.length)
    state.favourites = JSON.parse(favourites);
  //settings
  const settings = localStorage.getItem('tiempoSettings');
  if (settings) state.settings = JSON.parse(settings);
};
