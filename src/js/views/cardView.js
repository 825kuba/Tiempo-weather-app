'use strict';

import * as helpers from '../helpers.js';
import navView from './navView.js';

//SELECT ELEMENTS
const allCardsBox = document.querySelector('.all-cards');

export class CardView {
  constructor(
    city,
    region,
    country,
    localTime,
    isDay,
    current,
    forecast,
    isFavourite
  ) {
    // MAIN VARIABLES FOR CARD
    this.city = city;
    this.region = region ? region : '';
    this.country = country;
    this.localTime = localTime.replaceAll('-', '/'); // safari doesnt support yyyy-mm-dd
    this.isDay = isDay;
    this.current = current;
    this.forecast = forecast;
    this.isFavourite = isFavourite;

    // UNIQUE ID
    this.id = helpers.generateId(this.city, this.region, this.country);

    // TIME VARIABLES
    this.time = new Date(this.localTime);
    this.timeHours = this.time.getHours();
    this.timeMinutes = this.time.getMinutes();
    // this.timeHours = 23;
    // this.timeMinutes = 59;
    this.timeSeconds = new Date().getSeconds(); // use client's time for getting seconds since API always returns time with seconds set to 0
    // this.timeSeconds = 58;
    this.colon = ':';
    this.timeDayIndex = this.time.getDay();
    this.timeDay = helpers.daysOfWeek(this.timeDayIndex);
    this.timeDayFull = helpers.daysOfWeek(this.timeDayIndex, 'full');
    // this.timeDateNumber = this.time.getDate();
    // this.timeDate = helpers.dateEnding(this.timeDateNumber);
  }

  // RENDER WESTHER CARD
  renderCard() {
    // create markup for card
    const cardMarkup = `
    <div class="card-box" id="${this.id}">
      <div class="card">
        <div class="card__toolbar">
          <time class="card__time-date">
            <span class="card__time">${this.timeHours}${
      this.colon
    }${helpers.addZero(this.timeMinutes)}</span>, ${this.timeDayFull}
          </time>

          <button class="card__favourite">
            <i class="${
              this.isFavourite ? 'fa-solid' : 'fa-regular'
            } fa-star"></i>
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
  }

  renderForecastHourly() {
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
  }

  renderForecastDaily() {
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
  }

  // ALLOW HORIZONTAL SCROLLING WITH WHEEL OR TOUCHPAD IN FORECAST CONTAINERS
  addHandlerScrollForecast() {
    const allForecasts = document
      .getElementById(this.id)
      .querySelectorAll('.card__forecast');
    allForecasts.forEach(ele => {
      ele.addEventListener('wheel', e => {
        e.preventDefault();
        ele.scrollLeft += e.deltaY;
      });
    });
  }

  // CHANGE WHICH FORECAST IS DISPLAYED - this will work with any number of buttons
  addHandlerForecastBtns() {
    const allForecasts = document
      .getElementById(this.id)
      .querySelectorAll('.card__forecast');
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

  // ALGORITHM FOR UPDATING TIME AND CHANGING ':' TO ' ' WHICH GIVES THE BLINKING COLON EFFECT EVERY SECOND
  updateTime() {
    //change colon to space and vice versa
    if (this.colon === ':') this.colon = ' ';
    else if (this.colon === ' ') this.colon = ':';
    // add 1 second
    this.timeSeconds++;
    if (this.timeSeconds === 60) {
      this.timeSeconds = 0;
      // add 1 minute
      this.timeMinutes++;
      if (this.timeMinutes === 60) {
        this.timeMinutes = 0;
        // add 1 hour
        this.timeHours++;
        if (this.timeHours === 24) {
          this.timeHours = 0;
          // add day of week index
          this.timeDayIndex++;
          if (this.timeDayIndex > 6) this.timeDayIndex = 0;
          this.timeDayFull = helpers.daysOfWeek(this.timeDayIndex, 'full');
          // this.timeDateNumber++;
          // this.timeDate = helpers.dateEnding(this.timeDateNumber);
        }
      }
    }
  }

  // UPDATE TIME TEXT
  updateTimeText() {
    document
      .getElementById(this.id)
      .querySelector(
        '.card__time-date'
      ).innerHTML = `<span class="card__time">${this.timeHours}${
      this.colon
    }${helpers.addZero(this.timeMinutes)}</span>, ${this.timeDayFull}`;
  }

  // START INTERVAL
  startTime() {
    setInterval(() => {
      this.updateTime();
      this.updateTimeText();
    }, 1000);
  }

  cardInit(handler) {
    this.renderCard();
    this.renderForecastHourly();
    this.renderForecastDaily();
    this.addHandlerScrollForecast();
    this.addHandlerForecastBtns();
    this.startTime();
    this.addHandlerFavouriteBtn(handler);
  }

  // HANDLER FOR CLICKING STAR ICON ON CARD
  addHandlerFavouriteBtn(handler) {
    document
      .getElementById(this.id)
      .querySelector('.card__favourite')
      .addEventListener('click', e => {
        e.preventDefault();
        // slect the icon and toggle it's class - that changes look
        const star = e.target
          .closest('.card__favourite')
          .querySelector('.fa-star');
        if (!star) return;
        star.classList.toggle('fa-solid');
        star.classList.toggle('fa-regular');
        // THE FOLLOWING CODE (+ 2 MEXT FUNCTIONS WITH '*' MARK) WAS FOR SETTING EXACT CLASS OF BUTTON ICON INSTEAD OF JUST TOGGLING CLASSES - JUST KEEPING IT IN CASE THE TOGGLING WILL PROVE AS BUGGY
        // if (star.classList.contains('fa-regular')) {
        //   this.favouriteBtnDisplayFilled();
        // } else if (star.classList.contains('fa-solid')) {
        //   this.favouriteBtnDisplayEmpty();
        // }

        // run handler and save returned value in variable
        const favsLength = handler(this);
        // run function for displaying number badge
        navView.displayNumOfFavourites(favsLength);
      });
  }

  // '*' TEMPORARY - FOR CASE OF BUG
  // favouriteBtnDisplayFilled() {
  //   document
  //     .getElementById(this.id)
  //     .querySelector('.fa-star')
  //     .classList.remove('fa-regular');
  //   document
  //     .getElementById(this.id)
  //     .querySelector('.fa-star')
  //     .classList.add('fa-solid');
  // }

  // '*' TEMPORARY - FOR CASE OF BUG
  // favouriteBtnDisplayEmpty() {
  //   document
  //     .getElementById(this.id)
  //     .querySelector('.fa-star')
  //     .classList.remove('fa-solid');
  //   document
  //     .getElementById(this.id)
  //     .querySelector('.fa-star')
  //     .classList.add('fa-regular');
  // }
}
