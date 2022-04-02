'use strict';

const API_KEY = process.env.API_KEY;

// STATE OBJECT USED TO KEEP ALL DATA
export const state = {
  search: {
    query: '',
    results: [],
  },
  mainCard: {},
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
    // console.log(data);
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

// function getAllData() {
//   Promise.all([getData('nelson'), getData('hilo')]);
// }
