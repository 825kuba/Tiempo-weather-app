'use strict';

export default class SpinnerView {
  // set inner HTML of parent element to spinner img - used by searchView and mainView
  renderSpinner() {
    this.parentElement.innerHTML = `
      <div class="spinner" aria-label="Loading">
        <i class="fa-solid fa-spinner"></i>
      </div>
    `;
  }
}
