'use strict';

export default class SpinnerView {
  renderSpinner() {
    this.parentElement.innerHTML = `
      <div class="spinner" aria-label="Loading">
        <i class="fa-solid fa-spinner"></i>
      </div>
    `;
  }
}
