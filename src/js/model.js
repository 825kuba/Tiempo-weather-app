'use strict';

const API_KEY = process.env.API_KEY;

// STATE OBJECT USED TO KEEP ALL DATA
export const state = {
  search: {
    query: '',
    results: [],
  },
  mainCard: {},
  favourites: [],
};

// GET LIST OF SEARCH RESULTS BASED ON QUERY
export const getSearchData = async query => {
  try {
    // get data from API
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}&days=3&aqi=no&alerts=no`
    );
    // error handling
    if (!response.ok) throw new Error(response.status);
    // return converted response data
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (err) {
    // console.error('💥', err.message);
    throw err;
  }
};

// GET FORECAST DATA BASED ON QUERY
export const getForecastData = async query => {
  try {
    // get data from API
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=no&alerts=no`
    );
    // error handling
    if (!response.ok) throw new Error(`We couldn't find anything :(`);
    // return converted response data
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    // console.error('💥', err);
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

// ADD AND REMOVING CARDS TO/FROM FAVOURITES
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

  console.log(state.favourites);
  // save favourites to local storage
  setLocalStorage();

  return state.favourites.length;
};

// SAVING FAVOURITES DATA TO LOCAL STORAGE
export const setLocalStorage = () => {
  localStorage.setItem('tiempoFavourites', JSON.stringify(state.favourites));
};

// GETTING FAVOURITES DATA FROM LOCAL STORAGE
export const getLocalStorage = () => {
  const favourites = localStorage.getItem('tiempoFavourites');
  if (favourites && favourites.length)
    state.favourites = JSON.parse(favourites);
};
