'use strict';

const modalOverlay = document.querySelector('.overlay--modal');
const infoModal = document.querySelector('.modal--info');
const settingsModal = document.querySelector('.modal--settings');
const settingsForm = document.querySelector('.modal__settings');
const settingsFormSubmitBtn = document.querySelector('.modal__submit');
const closeBtns = document.querySelectorAll('.modal__close');
const mainBox = document.querySelector('.main-box');

class ModalView {
  // show modal with given class name
  showModal(name) {
    // show overlay
    modalOverlay.classList.add('active');
    // show modal
    document.querySelector(`.modal--${name}`).classList.add('active');
    // prevent scrolling in main container
    document.body.style.overflow = 'hidden';
  }

  // hide modal with given class name
  hideModal(name) {
    // hide overlay
    modalOverlay.classList.remove('active');
    // hide modal
    document.querySelector(`.modal--${name}`).classList.remove('active');
    // allow scrolling in main container
    document.body.style.overflow = 'initial';
  }

  // hide both modals when clicking on overlay
  addHandlerModalOverlay(handler) {
    modalOverlay.addEventListener('click', () => {
      this.hideModal('info');
      this.hideModal('settings');
      handler();
    });
  }

  setSmoothScrollOn() {
    mainBox.classList.add('smooth-scroll');
  }

  setSmoothScrollOff() {
    mainBox.classList.remove('smooth-scroll');
  }

  // INITIAL SETTINGS OF ELEMENTS IN THE SETTINGS MODAL
  initSettings(settings) {
    // units radio buttons
    // loop through the values of unit settings
    Object.values(settings.units).forEach(value => {
      // for each value select the radio input with the same value and set it as checked
      document
        .querySelector('.modal__settings')
        .querySelector(`input[value=${value}]`).checked = true;
    });

    // smooth scrolling switch button
    // check value of smoothScrollinng in settings
    // if true, set the check input as checked
    if (settings.smoothScroll) {
      document
        .querySelector('.modal__settings')
        .querySelector(`input[name=smoothScroll]`).checked = true;
      this.setSmoothScrollOn();
    }
    // otherwise set as not checked
    else {
      document
        .querySelector('.modal__settings')
        .querySelector(`input[name=smoothScroll]`).checked = false;
      this.setSmoothScrollOff();
    }

    // background images switch button
    // check value of bgImg in settings
    // if true, set the check input as checked
    if (settings.bgImg) {
      document
        .querySelector('.modal__settings')
        .querySelector(`input[name=bgImg]`).checked = true;
    }
    // otherwise set as not checked
    else {
      document
        .querySelector('.modal__settings')
        .querySelector(`input[name=bgImg]`).checked = false;
    }

    // disable save changes btn
    settingsFormSubmitBtn.disabled = true;
  }

  addHandlerSettings(handler) {
    // when any change happens in settings form, enabdle the submit btn
    settingsForm.addEventListener('change', () => {
      settingsFormSubmitBtn.disabled = false;
    });

    // on settings forms submit
    settingsForm.addEventListener('submit', e => {
      e.preventDefault();
      // create new settings object
      const newSettings = {
        units: {},
      };
      // get all the radio btns
      const radioBtns = Array.from(
        settingsModal.querySelectorAll('input[type="radio"]')
      );
      // loop through them, for each one that is checked create a key and value pair in new settings object
      radioBtns.forEach(btn => {
        if (btn.checked) {
          newSettings.units[btn.name] = btn.value;
        }
      });
      // get all checkboxes
      const checkboxes = Array.from(
        settingsModal.querySelectorAll('input[type="checkbox"]')
      );
      // loop through them, for each create a key and value pair in new settings object, and set the value to true or false based on 'checked' property
      checkboxes.forEach(box => {
        newSettings[box.name] = box.checked;
      });
      // run handler with new settings object as argument
      handler(newSettings);
      // // disable submit button again
      settingsFormSubmitBtn.disabled = true;
      // hide settings modal window again
      this.hideModal('settings');
    });
  }

  // hide modals on clicking close btn, also reset settings elements (handler)
  addHandlerCLoseBtn(handler) {
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.hideModal('info');
        this.hideModal('settings');
        handler();
      });
    });
  }

  // hide modals on pressing Escape, also reset settings elements (handler)
  addHandlerEscapeKey(handler) {
    document.addEventListener('keydown', e => {
      if (e.key === `Escape`)
        if (
          infoModal.classList.contains('active') ||
          settingsModal.classList.contains('active')
        ) {
          this.hideModal('info');
          this.hideModal('settings');
          handler();
        }
    });
  }
}

export default new ModalView();
