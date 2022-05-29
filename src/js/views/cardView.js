'use strict';

import * as helpers from '../helpers.js';
import headerView from './headerView.js';

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
    isFavourite,
    settings
  ) {
    // MAIN VARIABLES FOR CARD
    this.city = city;
    this.region = region ? region : '';
    this.country = country;
    // change time string - some browsers(safari) don't support yyyy-mm-dd
    this.localTime = localTime.replaceAll('-', '/');
    this.isDay = isDay;
    this.current = current;
    this.forecast = forecast;
    this.isFavourite = isFavourite;
    this.settings = settings;

    // UNIQUE ID
    this.id = helpers.generateId(this.city, this.region, this.country);

    // TIME VARIABLES
    this.time = new Date(this.localTime);
    this.timeHours = this.time.getHours();
    this.timeMinutes = this.time.getMinutes();
    // this.timeHours = 11;
    // this.timeMinutes = 50;
    this.timeSeconds = new Date().getSeconds(); // use client's time for getting seconds since API always returns time with seconds set to 0
    // this.timeSeconds = 58;
    this.colon = ':';
    this.timeDayIndex = this.time.getDay();
    this.timeDay = helpers.daysOfWeek(this.timeDayIndex);
    this.timeDayFull = helpers.daysOfWeek(this.timeDayIndex, 'full');

    this.backgroundCode;
  }

  updateSettings() {
    this.temp = this.settings.temp === 'c' ? 'temp_c' : 'temp_f';
    this.wind = this.settings.wind === 'kph' ? 'wind_kph' : 'wind_mph';
    this.rain = this.settings.rain === 'mm' ? 'precip_mm' : 'precip_in';
    // this.displayHours =
    //   this.settings.time === 'h24' ? this.timeHours : this.timeHours % 12;
    if (this.settings.time === 'h24') this.amPm = '';
    else this.amPm = this.timeHours < 12 ? ' AM' : ' PM';
    // sunrise / sunset time format
    // API only return 12h format of sunset / sunrise, so we have to create our own version of 24h format

    // get 24h format
    this.sunriseShort = this.getSun24format(
      this.forecast.forecastday[0].astro.sunrise
    );
    // settings for 12h format ? use original string, else use the 24h format we created
    this.sunrise =
      this.settings.time === 'h12'
        ? this.forecast.forecastday[0].astro.sunrise
        : this.sunriseShort;

    // get 24h format
    this.sunsetShort = this.getSun24format(
      this.forecast.forecastday[0].astro.sunset
    );
    // settings for 12h format ? use original string, else use the 24h format we created
    this.sunset =
      this.settings.time === 'h12'
        ? this.forecast.forecastday[0].astro.sunset
        : this.sunsetShort;
  }

  getSun24format(str) {
    // get AM/PM string
    const amPm = str.slice(-3).slice(1).toUpperCase();
    // get hours number out of string
    const hours = +str.slice(0, 2);
    // add 12 to hours if it's PM
    const formatedHours = amPm === 'PM' ? hours + 12 : hours;
    // delete AM/PM and hours from string
    const formatedStr = str.slice(0, -3).slice(2);
    // return final string
    return `${formatedHours < 10 ? '0' : ''}${formatedHours}${formatedStr}`;
  }

  // RENDER WEATHER CARD
  renderCard() {
    // create markup for card
    const cardMarkup = `
    <div class="card-box" id="${this.id}">
      <div class="card">
        <div class="card__toolbar">
          <time class="card__time-date" aria-label="Local time">
            <span class="card__time">${
              this.settings.time === 'h24'
                ? this.timeHours
                : this.timeHours % 12
            }${this.colon}${helpers.addZero(this.timeMinutes)}${
      this.amPm
    }</span>, ${this.timeDayFull}
          </time>

          <button class="card__favourite" aria-label="save to favourites, remove from favourites, button">
            <i class="${
              this.isFavourite ? 'fa-solid' : 'fa-regular'
            } fa-star"></i>
          </button>
        </div>

        <div class="card__content"> 
          <div class="card__current">
            <div class="card__name">
              <p class="card__city" aria-label="City name">${this.city}</p>
              <p class="card__country" aria-label="Region name, country name">${
                this.region ? `${this.region}, ` : ``
              }${this.country}</p>
            </div>

            <div class="card__conditions">
              <div class="card__temp" aria-label="Temperature">${Math.round(
                this.current[this.temp]
              )}&deg;${this.settings.temp.toUpperCase()}</div>
              <img
                class="card__icon"
                src="${this.current.condition.icon}"
              />
            </div>

            <div class="card__descr" aria-label="Current conditions">${
              this.current.condition.text
            }</div>

            <div class="card__details">
              <div class="card__details   card__details--weather">
                <div class="card__detail  card__detail--rain" aria-label="Rain conditions">
                  <i class="fa-solid fa-droplet"></i>
                  ${this.current[this.rain].toFixed(1)} ${this.settings.rain}
                </div>
                <div class="card__detail  card__detail--wind" aria-label="Wind conditions">
                  <i class="fa-solid fa-wind"></i>
                  ${Math.round(this.current[this.wind])} ${this.settings.wind}
                </div>
              </div>
              <div class="card__details   card__details--sun">
                <div class="card__detail  card__detail--sunrise" aria-label="Sunrise time">
                  <i class="fa-solid fa-up-long"></i>
                  <i class="fa-solid fa-sun"></i>
                  ${this.sunrise}
                </div>
                <div class="card__detail  card__detail--sunset" aria-label="Sunset time">
                  <i class="fa-solid fa-down-long"></i>
                  <i class="fa-solid fa-sun"></i>
                  ${this.sunset}
                </div>
              </div>
            </div>
          </div>

          <div class="card__all-forecasts">
            <div class="card__controlls">
              <button class="card__controll-btn   active" data-type="hourly" aria-label="Show hourly forecast">
                Hourly
              </button>
              <button class="card__controll-btn" data-type="daily" aria-label="Show daily forecast">
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
      function getAmPm(hour) {
        const str = +hour < 12 ? ' AM' : ' PM';
        if (+hour === 12 || +hour === 0) return '';
        return str;
      }
      // const amPm = hours <= 12 ? ' AM' : ' PM';
      function formatHours(hour) {
        if (+hour === 0) return 'MIDNIGHT';
        else if (+hour === 12) return 'NOON';
        else return +hour % 12;
      }
      // const formatedHours = this.settings.time === 'h24' ? hours : hours % 12;
      //create markup
      const markup = `
        <div class="card__forecast__item">
          <div class="card__forecast__name" aria-label="Forecast time">${
            this.settings.time === 'h24' ? hours : formatHours(hours)
          }${this.settings.time === 'h24' ? `:${minutes}` : ''}${
        this.settings.time === 'h24' ? '' : getAmPm(hours)
      }</div>
          <div class="card__forecast__icon" aria-label="forecast icon">
            <img
              src=${hour.condition.icon}
            />
          </div>
          <div class="card__forecast__temp" aria-label="Forecast temperature">${Math.round(
            hour[this.temp]
          )}&deg;${this.settings.temp.toUpperCase()}</div>
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
              <div class="card__forecast__name" aria-label="Forecast day">${dayOfWeek}</div>
              <div class="card__forecast__icon" aria-label="Forecast icon">
                <img
                  src=${day.day.condition.icon}
                />
              </div>
              <div class="card__forecast__temp" aria-label="Forecast temperature">${Math.round(
                day.day[`avg${this.temp}`]
              )}&deg;${this.settings.temp.toUpperCase()}</div>
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
    // get all forecast elements
    const allForecasts = document
      .getElementById(this.id)
      .querySelectorAll('.card__forecast');
    // add event listener to each
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

  // ALGORITHM FOR UPDATING TIME AND CHANGING ':' TO ' ' WHICH GIVES THE BLINKING COLON EFFECT
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
        // this.displayHours++;
        if (this.timeHours === 24) {
          this.timeHours = 0;
          // this.displayHours = 0;
          // add day of week index
          this.timeDayIndex++;
          if (this.timeDayIndex > 6) this.timeDayIndex = 0;
          this.timeDayFull = helpers.daysOfWeek(this.timeDayIndex, 'full');
        }
      }
    }
  }

  // UPDATE TIME TEXT
  updateTimeText() {
    // this.amPm = this.timeHours < 12 ? ' AM' : ' PM';
    if (this.settings.time === 'h24') this.amPm = '';
    else this.amPm = this.timeHours < 12 ? ' AM' : ' PM';

    document
      .getElementById(this.id)
      .querySelector(
        '.card__time-date'
      ).innerHTML = `<span class="card__time">${
      this.settings.time === 'h24' ? this.timeHours : this.timeHours % 12
    }${this.colon}${helpers.addZero(this.timeMinutes)}${this.amPm}</span>, ${
      this.timeDayFull
    }`;
  }

  // START INTERVAL
  startTime() {
    setInterval(() => {
      this.updateTime();
      this.updateTimeText();
    }, 1000);
  }

  // HANDLER FOR CLICKING STAR ICON ON CARD
  addHandlerFavouriteBtn(handler) {
    document
      .getElementById(this.id)
      .querySelector('.card__favourite')
      .addEventListener('click', e => {
        e.preventDefault();
        // select the icon and toggle it's class - that changes look
        const star = e.target
          .closest('.card__favourite')
          .querySelector('.fa-star');
        if (!star) return;
        star.classList.toggle('fa-solid');
        star.classList.toggle('fa-regular');
        // run handler and save returned value in variable
        const favsLength = handler(this);
        // run function for displaying number badge
        headerView.displayNumOfFavourites(favsLength);
      });
  }

  // code is used for setting background when card is being displayed
  changeBackgroundCode() {
    // se the code variable according to weather conditions
    if (this.current.condition.code === 1000) this.backgroundCode = 'clear';
    if (this.current.condition.code === 1003)
      this.backgroundCode = 'partly-cloudy';
    if (this.current.condition.code === 1006) this.backgroundCode = 'cloudy';
    if (this.current.condition.code === 1009) this.backgroundCode = 'overcast';
    if (
      this.current.condition.code === 1030 ||
      this.current.condition.code === 1135 ||
      this.current.condition.code === 1147
    )
      this.backgroundCode = 'mist';
    if (
      this.current.condition.code === 1063 ||
      this.current.condition.code === 1072 ||
      this.current.condition.code === 1150 ||
      this.current.condition.code === 1153 ||
      this.current.condition.code === 1168 ||
      this.current.condition.code === 1171 ||
      this.current.condition.code === 1180 ||
      this.current.condition.code === 1183 ||
      this.current.condition.code === 1186 ||
      this.current.condition.code === 1189 ||
      this.current.condition.code === 1192 ||
      this.current.condition.code === 1195 ||
      this.current.condition.code === 1198 ||
      this.current.condition.code === 1201 ||
      this.current.condition.code === 1240 ||
      this.current.condition.code === 1243 ||
      this.current.condition.code === 1246
    )
      this.backgroundCode = 'rain';
    if (
      this.current.condition.code === 1066 ||
      this.current.condition.code === 1114 ||
      this.current.condition.code === 1117 ||
      this.current.condition.code === 1210 ||
      this.current.condition.code === 1213 ||
      this.current.condition.code === 1216 ||
      this.current.condition.code === 1219 ||
      this.current.condition.code === 1222 ||
      this.current.condition.code === 1225 ||
      this.current.condition.code === 1255 ||
      this.current.condition.code === 1258
    )
      this.backgroundCode = 'snow';
    if (
      this.current.condition.code === 1069 ||
      this.current.condition.code === 1204 ||
      this.current.condition.code === 1207 ||
      this.current.condition.code === 1237 ||
      this.current.condition.code === 1249 ||
      this.current.condition.code === 1252 ||
      this.current.condition.code === 1261 ||
      this.current.condition.code === 1264
    )
      this.backgroundCode = 'sleet';
    if (
      this.current.condition.code === 1087 ||
      this.current.condition.code === 1273 ||
      this.current.condition.code === 1276 ||
      this.current.condition.code === 1279 ||
      this.current.condition.code === 1282
    )
      this.backgroundCode = 'thunder';
  }

  // init function for each card
  cardInit(handler) {
    this.updateSettings();
    this.renderCard();
    this.renderForecastHourly();
    this.renderForecastDaily();
    this.addHandlerScrollForecast();
    this.addHandlerForecastBtns();
    this.startTime();
    this.addHandlerFavouriteBtn(handler);
    this.changeBackgroundCode();
  }
}
