'use strict';

export default class View {
  renderSpinner() {
    this.parentElement.innerHTML = `
      <div class="spinner">
        <i class="fa-solid fa-spinner"></i>
      </div>
    `;
  }
}
