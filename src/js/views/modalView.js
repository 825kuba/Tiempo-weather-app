'use strict';

import mainView from './mainView.js';

const modalOverlay = document.querySelector('.overlay--modal');
const infoModal = document.querySelector('.modal--info');
const settingsModal = document.querySelector('.modal--settings');
const settingsForm = document.querySelector('.modal__settings');
const settingsFormSubmitBtn = document.querySelector('.modal__submit');
const closeBtns = document.querySelectorAll('.modal__close');
const mainBox = document.querySelector('.main-box');

class ModalView {
  showInfoModal() {
    modalOverlay.classList.add('active');
    infoModal.classList.add('active');
  }

  hideInfoModal() {
    modalOverlay.classList.remove('active');
    infoModal.classList.remove('active');
  }

  showSettingsModal() {
    modalOverlay.classList.add('active');
    settingsModal.classList.add('active');
  }

  hideSettingsModal() {
    modalOverlay.classList.remove('active');
    settingsModal.classList.remove('active');
  }

  addHandlerModalOverlay(handler) {
    modalOverlay.addEventListener('click', () => {
      this.hideInfoModal();
      this.hideSettingsModal();
      handler();
    });
  }

  // INITIAL SETTINGS ON LOAD
  initSettings(settings) {
    console.log(settings);
    // loop through the value of unit settings
    Object.values(settings.units).forEach(value => {
      // for each value select the radio input with the same value and set it as checked
      document
        .querySelector('.modal__settings')
        .querySelector(`input[value=${value}]`).checked = true;
    });

    // check value of smoothScrollinng in settings
    // if true, set the check input as checked
    if (settings.smoothScroll) {
      document
        .querySelector('.modal__settings')
        .querySelector(`input[name=smoothScroll]`).checked = true;
      mainView.setSmoothScrollOn();
    }
    // otherwise set as not checked
    else {
      document
        .querySelector('.modal__settings')
        .querySelector(`input[name=smoothScroll]`).checked = false;
      mainView.setSmoothScrollOff();
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
      // settingsFormSubmitBtn.disabled = true;
      // hide settings modal window again
      this.hideSettingsModal();
    });
  }

  addHandlerCLoseBtn(handler) {
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.hideInfoModal();
        this.hideSettingsModal();
        handler();
      });
    });
  }

  addHandlerEscapeKey(handler) {
    document.addEventListener('keydown', e => {
      if (e.key === `Escape`)
        if (
          infoModal.classList.contains('active') ||
          settingsModal.classList.contains('active')
        ) {
          this.hideInfoModal();
          this.hideSettingsModal();
          handler();
        }
    });
  }
}

export default new ModalView();
