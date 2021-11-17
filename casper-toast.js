/*
  - Copyright (c) 2014-2020 Cloudware S.A. All rights reserved.
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

import '@polymer/paper-toast/paper-toast.js';
import '@cloudware-casper/casper-icons/casper-icon.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class CasperToast extends PolymerElement {

  static get template () {
    return html`
      <style>

        :host {
          --background-color: var(--primary-color);
        }

        :host[hidden] {
          display: none;
        }

        paper-toast {
          width: 100%;
          display: flex;
          font-weight: bold;
          align-items: center;
          --paper-toast-color: white;
          --paper-toast-background-color: var(--background-color);
        }

        paper-toast:hover {
          cursor: pointer;
          filter: brightness(80%);
          transition: filter 1s ease;
        }

        paper-toast casper-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        paper-toast #content {
          flex-grow: 1;
          white-space: pre-line;
        }

        paper-toast #content a {
          color: var(--background-color);
          background-color: white;
          padding: 2px 6px;
          text-decoration: underline;
        }

      </style>

      <paper-toast id="toast" fit-into="[[fitInto]]" duration="[[duration]]">
        <div id="content"></div>
        <casper-icon icon="fa-solid:times-circle"></casper-icon>
      </paper-toast>
    `;
  }

  static get properties () {
    return {
      /**
       * The DOM element in which the component should fit into.
       *
       * @type {Object}
       */
      fitInto: {
        type: Object
      },
      /**
       * The duration in milliseconds that the component should stay open before auto-closing.
       *
       * @type {Number}
       */
      duration: {
        type: Number,
        value: 5000
      },
      /**
       * The text / HTML that will be displayed in the paper-toast.
       *
       * @type {String}
       */
      text: {
        type: String,
        observer: '__textChanged'
      },
      /**
       * The paper-toast's background color.
       *
       * @type {String}
       */
      backgroundColor: {
        type: String,
        observer: '__backgroundColorChanged'
      }
    };
  }

  ready () {
    super.ready();

    this.$.toast.addEventListener('click', () => this.close());
  }

  /**
   * Opens the paper-toast component.
   */
  open () {
    this.removeAttribute('hidden');
    this.$.toast.open();
  }

  /**
   * Closes the paper-toast component.
   */
  close () {
    this.setAttribute('hidden', true);
    this.$.toast.close();
  }

  /**
   * Observer that is fired when the text property changes.
   */
  __textChanged () {
    this.$.content.innerHTML = this.text;
  }

  /**
   * Observer that is fired when the background color property changes.
   */
  __backgroundColorChanged () {
    this.style.setProperty('--background-color', this.backgroundColor);
  }
}

window.customElements.define('casper-toast', CasperToast);
