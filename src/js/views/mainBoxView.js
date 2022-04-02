'use strict';

import View from './view.js';

const allCardsBox = document.querySelector('.all-cards');
const mainBox = document.querySelector('.main-box');
const leftArrow = document.querySelector('.fa-chevron-left');
const rightArrow = document.querySelector('.fa-chevron-right');
const spinner = document.querySelector('.spinner');

class MainBox {
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

  // DELETE FIRST CARD'S HTML
  removeFirstCard() {
    const cards = document.querySelectorAll('.card-box');
    if (!cards.length) return;
    allCardsBox.removeChild(cards[0]);
  }

  // RENDER SPINNER
  renderSpinner() {
    spinner.classList.toggle('active');
  }
}

export default new MainBox();
