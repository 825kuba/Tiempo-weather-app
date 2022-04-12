'use strict';

import View from './view.js';

const allCardsBox = document.querySelector('.all-cards');
const mainBox = document.querySelector('.main-box');
const leftArrow = document.querySelector('.fa-chevron-left');
const rightArrow = document.querySelector('.fa-chevron-right');
const spinner = document.querySelector('.spinner');
const indexDots = document.querySelector('.cards-nav__index-dots');

class MainView {
  parentElement = allCardsBox;
  prevScrollIndex = 0;
  scrollIndex = 0;
  maxScrollIndex = 0;
  ////////////// SIDE SCROLLIING ARROWS //////////////
  ///////////////////////////////////////////////

  // side scrolling function
  // parameter is 1 or -1
  sideScroll(value) {
    // get width of card-box element and times it with argument - this will give us the scroll direction and also how much should the scroll be
    const scrollWidth = mainBox.querySelector('.card-box').scrollWidth;
    // make the scroll happen
    mainBox.scrollLeft += scrollWidth * value;
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
    // explanation: sometimes, especially when zooming in or making the browser window very small, the scroll index didn't end up being an integer, but somethinng like 3.0000238472. So I rounded the number, but then I had no way to stop adjustArrows function from firing A LOT of times on every scroll event. So I made prevScrollIndex variable, and the adjustArrow function only runs ONCE when the scrollIndex and prevScrollIndex aren't equal. You can see this nicely with console logging both variables and some message from the adjustArrows function
    mainBox.addEventListener('scroll', () => {
      // get horizontal scroll position
      const scrollPosition = mainBox.scrollLeft;
      // get width of card-box element
      const cardBoxWidth = mainBox.querySelector('.card-box').scrollWidth;
      // set previous scroll index to current scroll index
      this.prevScrollIndex = this.scrollIndex;
      // calculate new current scroll index
      this.scrollIndex = Math.round(scrollPosition / cardBoxWidth);
      // only after current index is different from previous index, adjust the arrows
      if (this.prevScrollIndex === this.scrollIndex) return;
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
    // remove active class from previous index dot
    document
      .querySelectorAll('.cards-nav__index-dot')
      [this.prevScrollIndex].classList.remove('active');
    // add active class to current index dot
    document
      .querySelectorAll('.cards-nav__index-dot')
      [this.scrollIndex].classList.add('active');
  }

  // INITIAL STATE OF SCROLLING - ARGUMENT IS FAVOURITE CARDS ARRAY LENGTH
  initSideScroll(num) {
    // make sure the container is scrolled all the way to the left
    mainBox.scrollLeft = 0;
    // reset scroll index
    this.scrollIndex = 0;
    // set max scroll index - array length - 1
    this.maxScrollIndex = num - 1;
    // activate arrows if there is more then 1 card
    if (this.maxScrollIndex === 0) return;
    leftArrow.classList.add('active');
    rightArrow.classList.add('active');
    // hide left arrow show right arrow (scrolling always start on left)
    leftArrow.classList.add('hidden');
    rightArrow.classList.remove('hidden');
    // render index dots
    this.renderIndexDots(num - 1);
    // set first index dot to active
    document
      .querySelectorAll('.cards-nav__index-dot')
      [this.scrollIndex].classList.add('active');
    this.addHandlerIndexDots();
  }

  renderIndexDots(num) {
    // fill idex-dots parent elements with children - the actual dots
    indexDots.innerHTML = '';
    for (let i = 0; i <= num; i++) {
      indexDots.insertAdjacentHTML(
        'beforeend',
        `
          <button class="cards-nav__index-dot"></button>
        `
      );
    }
    // set active class on the parent element - make the index dots visible
    indexDots.classList.add('active');
  }

  addHandlerIndexDots() {
    // set event listener on index-dots element
    document
      .querySelector('.cards-nav__index-dots')
      .addEventListener('click', e => {
        // if the target isn't index-dot, return
        const target = e.target.closest('.cards-nav__index-dot');
        if (!target) return;
        // get index of the clicked dot
        const clickedIndex = Array.from(
          document.querySelectorAll('.cards-nav__index-dot')
        ).indexOf(target);
        // calculate the target index: the current scrollIndex minus the clickedIndex to get the value of how muhc we need to scroll, and times it with -1 to get the correct scroll direction
        const targetIndex = (this.scrollIndex - clickedIndex) * -1;
        // scroll the mainBox element
        this.sideScroll(targetIndex);
      });
  }

  // CLEAR MAIN VIEW
  clearView() {
    // clear all intervals by setting a new one and then looping through all intervals until this new one, and clearing them
    const dummyInterval = setInterval(function () {}, 1000);
    for (let i = 0; i <= dummyInterval; i++) window.clearInterval(i);
    // clear HTML
    allCardsBox.innerHTML = ``;
    // hide arrows
    leftArrow.classList.remove('active');
    rightArrow.classList.remove('active');
    // empty index dots and hide parent element
    indexDots.innerHTML = '';
    indexDots.classList.remove('active');
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
