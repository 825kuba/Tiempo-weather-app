'use strict';

import View from './view.js';

const allCardsBox = document.querySelector('.all-cards');
const mainBox = document.querySelector('.main-box');
const leftArrow = document.querySelector('.fa-chevron-left');
const rightArrow = document.querySelector('.fa-chevron-right');
const spinner = document.querySelector('.spinner');

class MainView {
  parentElement = allCardsBox;
  scrollIndex = 0;
  maxScrollIndex = 0;
  ////////////// SIDE SCROLLIING ARROWS //////////////
  ///////////////////////////////////////////////

  // side scrolling function
  // parameter is 1 or -1
  sideScroll(value) {
    // get width of card-box element and times it with argument - this will give us the scroll direction and also how much should the scroll be
    const scrollWidth = mainBox.querySelector('.card-box').scrollWidth * value;
    // make the scroll happen
    mainBox.scrollLeft += scrollWidth;
  }

  // ADD ALL HANDLERS FOR SCROLLING
  addHandlersSideScrolling() {
    // 1) SET EVENT LISTENERS ON ARROW BUTTONS AND ARROW KEYS - SCROLL ON CLICK / PRESS
    leftArrow.addEventListener('click', () => {
      this.sideScroll(-1);
    });
    rightArrow.addEventListener('click', () => {
      this.sideScroll(1);
    });

    document.addEventListener('keyup', e => {
      // only run key events if the arrows have active class
      if (
        !leftArrow.classList.contains('active') &&
        !rightArrow.classList.contains('active')
      )
        return;
      if (e.key === 'ArrowLeft') {
        this.sideScroll(-1);
      }
      if (e.key === 'ArrowRight') {
        this.sideScroll(1);
      }
    });

    //2) SET EVENT LISTENER ON SCROLL EVENT
    // - calculate scroll index, which is used to make left/right arrow show/hide as needed
    mainBox.addEventListener('scroll', () => {
      // get horizontal scroll position
      const scrollPosition = mainBox.scrollLeft;
      // get width of card-box element
      const cardBoxWidth = mainBox.querySelector('.card-box').scrollWidth;
      // calculate the scroll index
      this.scrollIndex = scrollPosition / cardBoxWidth;
      // only after it's a round integer, set the arrow style
      if (this.scrollIndex % 1 !== 0) return;
      this.adjustArrows();
    });
  }

  // SHOW OR HIDE ARROW ACCORDING TO SCROLL INDEX
  adjustArrows() {
    // if true, hide left arrow
    if (this.scrollIndex === 0) {
      leftArrow.classList.add('hidden');
      rightArrow.classList.remove('hidden');
    }
    // if true, show both arrows
    if (this.scrollIndex > 0 && this.scrollIndex < this.maxScrollIndex) {
      leftArrow.classList.remove('hidden');
      rightArrow.classList.remove('hidden');
    }
    // if true, hide right arrow
    if (this.scrollIndex === this.maxScrollIndex) {
      leftArrow.classList.remove('hidden');
      rightArrow.classList.add('hidden');
    }
  }

  // INITIAL STATE OF SCROLLING - ARGUMENT IS FAVOURITE CARDS ARRAY LENGTH
  initSideScroll(num) {
    // make sure the container is scrolled all the way to the left
    mainBox.scrollLeft = 0;
    // reset scroll index
    this.scrollIndex = 0;
    // set max scroll index - array length - 1
    this.maxScrollIndex = num - 1;
    console.log(this.maxScrollIndex);
    // activate arrows if there is more then 1 card
    if (this.maxScrollIndex === 0) return;
    leftArrow.classList.add('active');
    rightArrow.classList.add('active');
    // hide left arrow show right arrow (scrolling always start on left)
    leftArrow.classList.add('hidden');
    rightArrow.classList.remove('hidden');
  }

  // CLEAR MAIN VIEW
  clearView() {
    // clear all intervals by setting a new one and then looping through all intervals until this new one, and clearing them
    const dummyInterval = setInterval(function () {}, 1000);
    for (let i = 0; i <= dummyInterval; i++) window.clearInterval(i);
    // clear HTML
    allCardsBox.innerHTML = ``;
    leftArrow.classList.remove('active');
    rightArrow.classList.remove('active');
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
