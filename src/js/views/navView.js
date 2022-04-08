'use strict';

// SELECT ELEMENTS
const navLinks = document.querySelector('.nav__links');
const hamburger = document.querySelector('.nav__hamburger');
const searchBtn = document.querySelector('.nav__search__btn');
const logo = document.querySelector('.nav__logo');
const favouritesBtn = document.querySelector('.nav__link--favourites');

class navView {
  //  OPEN AND CLOSE MOBILE MENU
  toggleMobileMenu() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    searchBtn.classList.toggle('hidden');
  }

  // ADD EVENT LISTENERS
  addHandlerMobileMenu() {
    // hamburger button
    hamburger.addEventListener('click', this.toggleMobileMenu);
    // all mobile menu buttons
    Array.from(document.querySelectorAll('.nav__item')).map(item =>
      item.addEventListener('click', this.toggleMobileMenu)
    );
  }

  // ADD HANDLER TO LOGO
  addHandlerLogo() {
    logo.addEventListener('click', e => {
      e.preventDefault();
      // reload page when clicked
      location.reload();
    });
  }

  // ADD HANDLER TO FAVOURITES BTN IN NAV
  addHandlerFavouritesBtn(handler) {
    favouritesBtn.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }

  displayNumOfFavourites(num) {
    console.log(num);
    if (num >= 1)
      favouritesBtn.innerHTML = `
    <i class="fa-solid fa-star"></i
    >
    `;
    else
      favouritesBtn.innerHTML = `
    <i class="fa-regular fa-star"></i
    >
    `;
  }
}

export default new navView();
