const { default: axios } = require('axios');

const handler = async event => {
  // set API key
  const API_KEY = process.env.API_KEY;
  // create url variable
  let url;

  // if there is seacrhQuery parameter
  if (event.queryStringParameters.searchQuery) {
    // set searchQuery variable
    const { searchQuery } = event.queryStringParameters;
    // set url to API for search results
    url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${searchQuery}&days=3&aqi=no&alerts=no`;
  } else {
    // set query variable
    const { query } = event.queryStringParameters;
    // set url to API for forecast data
    url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=no&alerts=no`;
  }

  try {
    // make API call
    const { data } = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
