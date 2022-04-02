'use strict';

export default class View {
  renderSpinner() {
    console.log('running in', this.parentElement);
    this.parentElement.innerHTML = `
      <div class="spinner">
        <i class="fa-solid fa-spinner"></i>
      </div>
    `;
  }
}
