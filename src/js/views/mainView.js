'use strict';

import View from './view.js';

const allCardsBox = document.querySelector('.all-cards');
const mainBox = document.querySelector('.main-box');
const leftArrow = document.querySelector('.fa-chevron-left');
const rightArrow = document.querySelector('.fa-chevron-right');
const spinner = document.querySelector('.spinner');

class MainView {
  parentElement = allCardsBox;
  ////////////// SIDE SCROLLIING ARROWS //////////////
  ///////////////////////////////////////////////

  // side scrolling function
  // parameter is 1 or -1
  sideScroll(value) {
    // get width of card's parent element and times it with parameter - that will choose the scrolling direction
    const scrollWidth = mainBox.querySelector('.card-box').scrollWidth * value;
    // scroll main box horizontaly using that width
    mainBox.scrollLeft += scrollWidth;
  }

  // ADD EVENT LISTENERS TO ARROWS
  addHandlerSideScrollArrows() {
    rightArrow.addEventListener('click', () => this.sideScroll(1));
    leftArrow.addEventListener('click', () => this.sideScroll(-1));
  }

  // CLEAR MAIN VIEW
  clearView() {
    // clear all intervals by setting a new one and then looping through all intervals until this new one, and clearing them
    const dummyInterval = setInterval(function () {}, 1000);
    for (let i = 0; i <= dummyInterval; i++) window.clearInterval(i);
    // clear HTML
    allCardsBox.innerHTML = ``;
  }

  // RENDER SPINNER
  renderSpinner() {
    spinner.classList.toggle('active');
  }

  // RENDER GIVEN ERROR
  renderError(err) {
    const cardMarkup = `
      <div class="card-box">
        <div class="card">
          <div class="card__content">
            <p class="card__error">${err}</p>
          </div>
        </div>
      </div>
    `;
    allCardsBox.insertAdjacentHTML('beforeend', cardMarkup);
  }
}

export default new MainView();
