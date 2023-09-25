/*
  - Copyright (c) 2014-2023 Cloudware S.A. All rights reserved.
  -
  - This file is part of casper-toast.
  -
  - casper-toast is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - casper-toast  is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with casper-toast.  If not, see <http://www.gnu.org/licenses/>.
  -
 */

import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@cloudware-casper/casper-icons/casper-icon.js';


class CasperToast extends LitElement {
  static properties = {
    _content: {
      type: String
    },
    /* Flag used for the opening/closing transition. */
    _showDialog: {
      type: Boolean,
      attribute: 'show-dialog',
      reflect: true
    },
    /* This value must be given in milliseconds. */
    transitionDuration: {
      type: Number
    }
  };

  static styles = css`
    :host {
      --toast-background-color: var(--primary-color);
      --toast-text-color: #FFF;
      --toast-transition-duration: 300ms;

      position: fixed;
      bottom: 1rem;
      left: 1rem;
      width: calc(100% - 2rem);
      opacity: 0;
      -webkit-transform: translateY(100px);
      transform: translateY(100px);
      pointer-events: none;
      z-index: 105;
      transition: opacity var(--toast-transition-duration) ease, transform var(--toast-transition-duration) ease;
    }

    :host([show-dialog]) {
      opacity: 1;
      -webkit-transform: translateY(0);
      transform: translateY(0);
      pointer-events: auto;
    }

    .toast {
      position: static;
      box-sizing: border-box;
      width: 100%;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 1.142em;
      color: var(--toast-text-color);
      background-color: var(--toast-background-color);
      box-shadow: rgba(0, 0, 0, 15%) 0 5px 20px;
      outline: none;
      border: none;
      border-radius: 4px;
      align-items: center;
      gap: 1.142em;
      transition: filter 1s ease;
    }

    .toast:hover {
      cursor: pointer;
      filter: brightness(80%);
    }

    .toast[open] {
      display: flex;
    }

    .toast__content {
      flex-grow: 1;
      white-space: pre-line;
    }

    .toast__content a {
      display: inline-block;
      color: var(--toast-background-color);
      background-color: var(--toast-text-color);
      padding: 0.071em 0.428em;
      text-decoration: underline;
    }

    .toast__close {
      flex-shrink: 0;
    }
  `;

  
  constructor () {
    super();

    this._showDialog = false;
    this.setInitialValues();
  }



  //***************************************************************************************//
  //                              ~~~ LIT lifecycle  ~~~                                   //
  //***************************************************************************************//

  render () {
    return html`
      <dialog id="toast" class="toast" @click=${this.close.bind(this)}>
        <div class="toast__content">${unsafeHTML(this._content)}</div>
        <casper-icon class="toast__close" icon="fa-solid:times-circle"></casper-icon>
      </dialog>
    `;
  }

  willUpdate (changedProperties) {
    if (changedProperties.has('transitionDuration')) {
      this.style.setProperty('--toast-transition-duration', `${this.transitionDuration}ms`);
    }
  }

  firstUpdated () {
    this._toastEl = this.shadowRoot.getElementById('toast');
  }



  //***************************************************************************************//
  //                              ~~~ Public methods  ~~~                                  //
  //***************************************************************************************//

  setInitialValues () {
    this._content = '';
    this._toastDuration = 5000;
    this.transitionDuration = 300;
  }

  setTypeBackgroundColor (type) {
    let color = '';

    switch (type) {
      case 'success':
        color = 'var(--status-green)';
        break;
      case 'error':
        color = 'var(--status-red)';
        break;
      case 'warning':
        color = 'var(--status-orange)';
        break;
      case 'info':
      default:
        color = 'var(--status-blue)';
    }

    this.style.setProperty('--toast-background-color', color);
  }
  
  /**
   * Shows the toast.
   *
   * @param {Object} options The options can include:
   * - text: Text/html which will be displayed.
   * - duration: The duration in milliseconds that the component should stay open before auto-closing.
   * - background_color: Kept for backwards compatibility. Use "type" instead.
   * - type: Sets the appropriate background-color. Available values are "success", "error", "warning" and "info".
   */
  open (options) {
    if (options.text) this._content = options.text;
    if (options.duration) this._toastDuration = options.duration;

    if (options.background_color) {
      this.style.setProperty('--toast-background-color', options.background_color);
    } else {
      this.setTypeBackgroundColor(options.type);
    }
  
    this._toastEl.show();
    this._showDialog = true;

    setTimeout(() => {
      this.close();
    }, this._toastDuration);
  }

  /**
   * Hides the toast.
   */
  close () {
    this._showDialog = false;

    setTimeout(() => {
      this._toastEl.close();
      this.setInitialValues();
    }, +this.transitionDuration);
  }

  isOpen () {
    return this._toastEl.open;
  }
}

customElements.define('casper-toast', CasperToast);