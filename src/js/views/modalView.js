'use strict';

const modalOverlay = document.querySelector('.overlay--modal');
const infoModal = document.querySelector('.modal--info');
const settingsModal = document.querySelector('.modal--settings');

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

  addHandlerModalOverlay() {
    modalOverlay.addEventListener('click', () => {
      this.hideInfoModal();
      this.hideSettingsModal();
    });
  }
}

export default new ModalView();
