'use strict';

import modalView from './modalView.js';

// SELECT ELEMENTS
const navLinks = document.querySelector('.nav__btns');
const hamburger = document.querySelector('.nav__hamburger');
const searchBtn = document.querySelector('.nav__search__btn');
const logo = document.querySelector('.nav__logo');
const favouritesBtn = document.querySelector('.nav__btn--favourites');
const favouritesBtnLink = favouritesBtn.querySelector('.nav__link');
const numBadge = document.querySelector('.nav__btn__num-badge');
const infoBtn = document.querySelector('.nav__btn--info');
const settingsBtn = document.querySelector('.nav__btn--settings');

class HeaderView {
  //  OPEN AND CLOSE MOBILE MENU
  toggleMobileMenu() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    searchBtn.classList.toggle('hidden');
  }

  // ADD EVENT LISTENERS
  addHandlerMobileMenu() {
    // open mobile menu with hamburger button
    hamburger.addEventListener('click', this.toggleMobileMenu);
    // close mobile menu with all menu buttons
    Array.from(document.querySelectorAll('.nav__btn')).map(item =>
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

  // DISPLAY CURRENT NUMBER OF FAVOURITE CARDS
  displayNumOfFavourites(num) {
    // if favourites array length at least 1
    if (num >= 1) {
      {
        // chage favourites icon to filled version
        favouritesBtnLink.innerHTML = '<i class="fa-solid fa-star"></i>';
        // update number in badge
        numBadge.textContent = num;
        // give the num badge active class
        numBadge.classList.add('active');
      }
    } else {
      // display empty icon
      favouritesBtnLink.innerHTML = `<i class="fa-regular fa-star"></i>`;
      // update number in badge
      numBadge.textContent = num;
      // hide badge
      numBadge.classList.remove('active');
    }
  }

  addHandlerInfoBtn() {
    infoBtn.addEventListener('click', () => {
      modalView.showModal('info');
    });
  }

  addHandlerSettingsBtn() {
    settingsBtn.addEventListener('click', () => {
      modalView.showModal('settings');
    });
  }
}

export default new HeaderView();
