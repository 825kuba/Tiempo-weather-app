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

  // RENDER WESTHER CARD
  renderCard() {
    // create markup for card
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
              <button class="card__controll-btn   active" data-type="hourly">
                Hourly
              </button>
              <button class="card__controll-btn" data-type="daily">
                Daily
              </button>
            </div>

            <div class="card__forecast  card__forecast--hourly" data-type="hourly"></div>

            <div class="card__forecast  card__forecast--daily hidden" data-type="daily"></div>
          </div>
        </div>
      </div>
    </div>
    `;

    // insert it into parent element
    allCardsBox.insertAdjacentHTML('beforeend', cardMarkup);

    //RENDER DAILY FORECAST DATA
    this.forecast.forecastday.forEach((day, i) => {
      // get time (replaceAll necessary for Safari)
      const time = new Date(day.date.replaceAll('-', '/'));
      // get day of week name
      let dayOfWeek = helpers.daysOfWeek(time.getDay());
      // display 'today' instead of day name
      if (i === 0) dayOfWeek = 'Today';
      // create markup
      const markup = `
        <div class="card__forecast__item">
          <div class="card__forecast__name">${dayOfWeek}</div>
          <div class="card__forecast__icon">
            <img
              src=${day.day.condition.icon}
            />
          </div>
          <div class="card__forecast__temp">${Math.round(
            day.day.avgtemp_c
          )}°C</div>
        </div>
      `;
      // insert it into the parent element
      document
        .getElementById(this.id)
        .querySelector('.card__forecast--daily')
        .insertAdjacentHTML('beforeend', markup);
    });

    // RENDER HOURLY FORECAST DATA
    // first we need to create an array of the next 24 hours:
    // get index of the first hour we need - next hour from now
    const index1 = Number(this.timeHours) + 1;
    // create array of all the remaining hours of today from index1
    const todayHours = this.forecast.forecastday[0].hour.slice(
      index1,
      this.forecast.forecastday[0].hour.length
    );
    // get index of the last hour we need - 24 hours from index1
    const index2 = 24 - todayHours.length;
    // create array of hours we need from tomorrow
    const tomorrowHours = this.forecast.forecastday[1].hour.slice(0, index2);
    // create array of all 24 hours
    const allHours = todayHours.concat(tomorrowHours);
    // loop through array of hours
    allHours.forEach(hour => {
      // get time (replaceAll necessary for Safari)
      const time = new Date(hour.time.replaceAll('-', '/'));
      // get hours and minutes
      const hours = helpers.addZero(time.getHours());
      const minutes = helpers.addZero(time.getMinutes());
      //create markup
      const markup = `
        <div class="card__forecast__item">
          <div class="card__forecast__name">${hours}:${minutes}</div>
          <div class="card__forecast__icon">
            <img
              src=${hour.condition.icon}
            />
          </div>
          <div class="card__forecast__temp">${Math.round(hour.temp_c)}°C</div>
        </div>
      `;
      // insert it into the parent element
      document
        .getElementById(this.id)
        .querySelector('.card__forecast--hourly')
        .insertAdjacentHTML('beforeend', markup);
    });

    // ADD HANDLER TO FORECAST CONTAINERS SO THEY SCROLL HORIZONTALY WITH WHEEL AND TOUCHPAD
    const allForecasts = document
      .getElementById(this.id)
      .querySelectorAll('.card__forecast');
    allForecasts.forEach(ele => {
      ele.addEventListener('wheel', e => {
        e.preventDefault();
        ele.scrollLeft += e.deltaY;
      });
    });

    // ADD EVENT LISTENER TO FORECAST BUTTONS SO WE CAN CHANGE WHICH FORECAST IS DISPLAYED - this will work with any number of buttons
    const forecastBtns = document
      .getElementById(this.id)
      .querySelectorAll('.card__controll-btn');
    // loop through the btns
    forecastBtns.forEach(btn => {
      // add event listener to btn
      btn.addEventListener('click', e => {
        // if it already contains active class return
        if (e.target.classList.contains('active')) return;
        // loop through btns, remove active class from all
        forecastBtns.forEach(btn => btn.classList.remove('active'));
        // add active class to clicked btn
        e.target.classList.add('active');
        // get it's data-type
        const data = e.target.dataset.type;
        // loop through all forecast containers
        allForecasts.forEach(forc => {
          // if it's data-type matches the clicked btn data-type, remove the hidden class
          if (forc.dataset.type === data) forc.classList.remove('hidden');
          // else add the hidden class
          else forc.classList.add('hidden');
        });
      });
    });
  }
}
