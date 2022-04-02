'use strict';

// SELECT ELEMENTS
const navLinks = document.querySelector('.nav__links');
const hamburger = document.querySelector('.nav__hamburger');
const searchBtn = document.querySelector('.nav__search__btn');

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
}

export default new navView();
