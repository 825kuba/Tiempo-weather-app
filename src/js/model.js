'use strict';

const API_KEY = process.env.API_KEY;

// STATE OBJECT USED TO KEEP ALL DATA
export const state = {
  search: {
    query: '',
    results: [],
  },
  firstCard: {},
};

// GET LIST OF SEARCH RESULTS BASED ON QUERY
export const getSearchData = async query => {
  try {
    // if query is shorter then 3 characters, return (API returns empty array in that case)
    if (query.length < 3) return;
    console.log('fetching');
    // get data from API
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}&days=3&aqi=no&alerts=no`
    );
    // error handling
    if (!response) throw new Error(`Error: ${response.status}`);
    // return converted response data
    const data = await response.json();
    console.log(data);
    return data;
    //error handling
  } catch (err) {
    console.error('💥', err.message);
    throw err;
  }
};

// GET FORECAST DATA BASED ON QUERY
export const getForecastData = async query => {
  try {
    // if query is shorter then 3 characters, return (API returns empty array in that case)
    if (query.length < 3) return;
    // get data from API
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=no&alerts=no`
    );
    // error handling
    if (!response) throw new Error(`💥 ${response.status}`);
    // return converted response data
    const data = await response.json();
    console.log(data);
    return data;
    //error handling
  } catch (err) {
    console.error('💥', err.message);
    throw err;
  }
};

// function getAllData() {
//   Promise.all([getData('nelson'), getData('hilo')]);
// }
