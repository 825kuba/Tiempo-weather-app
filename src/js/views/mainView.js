'use strict';

import SpinnerView from './spinnerView.js';

const allCardsBox = document.querySelector('.all-cards');
const mainBox = document.querySelector('.main-box');
const leftArrow = document.querySelector('.scroll-arrow--left');
const rightArrow = document.querySelector('.scroll-arrow--right');
const indexDots = document.querySelector('.cards-nav__index-dots');

class MainView extends SpinnerView {
  parentElement = allCardsBox;
  prevScrollIndex = 0;
  scrollIndex = 0;
  maxScrollIndex = 0;
  index = 0;
  backgroundTimer;

  // side scrolling function
  // argument is 1 or -1
  sideScroll(value) {
    // get width of card-box element and times it with argument - this will give us the scroll direction and also how much should the scroll be
    const scrollWidth = mainBox.querySelector('.card-box').scrollWidth;
    // make the scroll happen
    mainBox.scrollLeft += scrollWidth * value;
  }

  // ADD ALL HANDLERS FOR SCROLLING
  addHandlersSideScrolling(state) {
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
      // make sure there are cards before doing any scrolling
      const cardBoxes = document.querySelectorAll('.card-box');
      if (!cardBoxes.length) return;
      // get horizontal scroll position
      const scrollPosition = mainBox.scrollLeft;
      // get width of card-box element
      const cardBoxWidth = mainBox.querySelector('.card-box').scrollWidth;
      // set previous scroll index to current scroll index
      this.prevScrollIndex = this.scrollIndex;
      // calculate new current scroll index
      this.scrollIndex = Math.round(scrollPosition / cardBoxWidth);
      // only after current index is different from previous index, do the rest of stuff
      if (this.prevScrollIndex === this.scrollIndex) return;
      // adjust arrows
      this.adjustArrows();
      // if smooth scroll is on, set background image after timeout (to prevent changing picture X amount of times, i.e. when scrolling over 4 cards, the image would change 4 times)
      if (state.settings.smoothScroll) {
        clearTimeout(this.backgroundTimer);
        this.backgroundTimer = setTimeout(() => {
          this.changeBackground(state.favourites[this.scrollIndex]);
        }, 200);
        // if smooth scroll is off, just change the background without any timer
      } else this.changeBackground(state.favourites[this.scrollIndex]);
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
    // get all index dots
    const indexDots = document.querySelectorAll('.cards-nav__index-dot');
    // if there is none, return
    if (!indexDots.length) return;
    // remove active class from previous index dot
    indexDots[this.prevScrollIndex].classList.remove('active');
    // add active class to current index dot
    indexDots[this.scrollIndex].classList.add('active');
  }

  // INITIAL STATE OF SCROLLING - ARGUMENT IS FAVOURITE CARDS ARRAY LENGTH
  initSideScroll(num) {
    // make sure the container is scrolled all the way to the left
    mainBox.scrollLeft = 0;
    // reset scroll index
    this.scrollIndex = 0;
    this.prevScrollIndex = 0;
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
          <button class="cards-nav__index-dot" aria-label="Favourite place ${
            i + 1
          }, button"></button>
        `
      );
    }
    // set active class on the parent element - make the index dots visible
    indexDots.classList.add('active');
  }

  // WHAT HAPPENS WHEN DOTS ARE CLICKED
  indexDotsHandler(e) {
    // if the target isn't index-dot, return
    const target = e.target.closest('.cards-nav__index-dot');
    if (!target) return;
    // get index of the clicked dot
    const clickedIndex = Array.from(
      document.querySelectorAll('.cards-nav__index-dot')
    ).indexOf(target);
    // calculate the scroll value: the current scrollIndex minus the clickedIndex to get the value of how much we need to scroll, and times it with -1 to get the correct scroll direction
    const scrollValue = (this.scrollIndex - clickedIndex) * -1;
    // scroll the mainBox element
    this.sideScroll(scrollValue);
  }

  // we have to create this variable to be able to add AND remove event listener on index dots
  boundIndexDotsHandler = this.indexDotsHandler.bind(this);

  addHandlerIndexDots() {
    // set event listener on index-dots element
    indexDots.addEventListener('click', this.boundIndexDotsHandler);
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
    // remove event listener from dots, empty and hide the element
    indexDots.removeEventListener('click', this.boundIndexDotsHandler);
    indexDots.innerHTML = '';
    indexDots.classList.remove('active');
  }

  // RENDER GIVEN ERROR
  renderError(err) {
    const cardMarkup = `
      <div class="card-box">
        <div class="card">
          <div class="card__content">
            <p class="card__error" aria-label="Error message">${err}</p>
          </div>
        </div>
      </div>
    `;
    allCardsBox.insertAdjacentHTML('beforeend', cardMarkup);
  }

  getNumberOfCardsDisplayed() {
    return Array.from(allCardsBox.querySelectorAll('.card-box')).length;
  }

  changeBackground(card) {
    // get screen size
    const res = window.innerWidth;
    let size;
    if (res <= 600) size = 'small';
    if (res > 600 && res <= 1400) size = 'medium';
    if (res > 1400) size = 'large';
    // find out if it's day or night
    const isDay = card.current.is_day ? 'day' : 'night';
    // get image name based on weather code
    const bgUrl = `../../img/bg/${size}/${isDay}/${card.backgroundCode}.jpg`;
    // set background img
    document.body.style.backgroundImage = `
      linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 70%,
        rgba(0, 0, 0, 0.9) 100%
      ),
      url(${bgUrl})
    `;
  }
}

export default new MainView();
