'use strict';

import modalView from './modalView.js';

// SELECT ELEMENTS
const navLinks = document.querySelector('.nav__links');
const hamburger = document.querySelector('.nav__hamburger');
const searchBtn = document.querySelector('.nav__search__btn');
const logo = document.querySelector('.nav__logo');
const favouritesBtn = document.querySelector('.nav__item--favourites');
const favouritesBtnLink = favouritesBtn.querySelector('.nav__link');
const numBadge = document.querySelector('.nav__item__num-badge');
const infoBtn = document.querySelector('.nav__item--info');
const settingsBtn = document.querySelector('.nav__item--settings');

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

  // DISPLAY CURRENT NUMBER OF FAVOURITE CARDS
  displayNumOfFavourites(num) {
    // if favourites array length at least 1
    if (num >= 1) {
      {
        // chage favourites icon to filled version
        favouritesBtnLink.innerHTML = '<i class="fa-solid fa-star"></i>';
        // display current num of favs
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
      modalView.showInfoModal();
    });
  }

  addHandlerSettingsBtn() {
    settingsBtn.addEventListener('click', () => {
      modalView.showSettingsModal();
    });
  }
}

export default new navView();
