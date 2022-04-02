'use strict';

import * as helpers from '../helpers.js';

//SELECT ELEMENTS
const allCardsBox = document.querySelector('.all-cards');

export default class {
  constructor(city, region, country, localTime, isDay, current, forecast) {
    // MAIN VARIABLES FOR CARD
    this.city = city;
    this.region = region ? region : '';
    this.country = country;
    this.localTime = localTime.replaceAll('-', '/'); // safari doesnt support yyyy-mm-dd
    this.isDay = isDay;
    this.current = current;
    this.forecast = forecast;

    // UNIQUE ID
    this.id = Math.round(Math.random() * Date.now());

    // TIME VARIABLES
    this.time = new Date(this.localTime);
    this.timeHours = helpers.addZero(this.time.getHours());
    this.timeMinutes = helpers.addZero(this.time.getMinutes());
    this.timeDay = helpers.daysOfWeek(this.time.getDay());
    this.timeDayFull = helpers.daysOfWeek(this.time.getDay(), 'full');
    this.timeDate = helpers.dateEnding(this.time.getDate());
  }

  renderCard() {
    const hourlyMarkup = ``;

    const cardMarkup = `
    <div class="card-box" id="${this.id}">
      <div class="card">
        <div class="card__toolbar">
          <p class="card__time-date">
            <span class="card__time">${this.timeHours}:${
      this.timeMinutes
    }</span>, ${this.timeDayFull} ${this.timeDate}
          </p>

          <button class="card__favourite">
            <i class="fa-regular fa-star"></i>
          </button>
        </div>

        <div class="card__content">
          <div class="card__current">
            <div class="card__name">
              <p class="card__city">${this.city}</p>
              <p class="card__country">${
                this.region ? `${this.region}, ` : ``
              }${this.country}</p>
            </div>

            <div class="card__conditions">
              <div class="card__temp">${Math.round(
                this.current.temp_c
              )}&deg;C</div>
              <img
                class="card__icon"
                src="${this.current.condition.icon}"
              />
            </div>

            <div class="card__descr">${this.current.condition.text}</div>

            <div class="card__details">
              <div class="card__details   card__details--weather">
                <div class="card__detail  card__detail--rain">
                  <i class="fa-solid fa-droplet"></i>
                  ${this.current.precip_mm.toFixed(1)} mm
                </div>
                <div class="card__detail  card__detail--wind">
                  <i class="fa-solid fa-wind"></i>
                  ${Math.round(this.current.wind_kph)} km/h
                </div>
              </div>
              <div class="card__details   card__details--sun">
                <div class="card__detail  card__detail--sunrise">
                  <i class="fa-solid fa-up-long"></i>
                  <i class="fa-solid fa-sun"></i>
                  ${this.forecast.forecastday[0].astro.sunrise}
                </div>
                <div class="card__detail  card__detail--sunset">
                  <i class="fa-solid fa-down-long"></i>
                  <i class="fa-solid fa-sun"></i>
                  ${this.forecast.forecastday[0].astro.sunset}
                </div>
              </div>
            </div>
          </div>

          <div class="card__all-forecasts">
            <div class="card__controlls">
              <button class="card__controll-btn   active">Hourly</button>
              <button class="card__controll-btn">Daily</  button>
            </div>

            <div class="card__forecast  card__forecast--hourly"></div>

            <div class="card__forecast  card__forecast--daily"></div>
          </div>
        </div>
      </div>
    </div>
    `;
    allCardsBox.insertAdjacentHTML('beforeend', cardMarkup);
  }
}
