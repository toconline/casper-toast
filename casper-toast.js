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

//import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-toast/paper-toast.js';
import '@cloudware-casper/casper-icons/casper-icons.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

class CasperToast extends PolymerElement {
  static get template() {
    return html`
      <style>
        paper-toast {
          --paper-toast-background-color: var(--primary-color);
          --paper-toast-color: white;
          width: 100%;
          font-weight: bold;
          align-items: center;
          display: inline-flex;
          justify-content: space-between;
        }

        paper-toast:hover {
          cursor: pointer;
          filter: brightness(80%);
          transition: filter 1s ease;
        }
      </style>

      <paper-toast text="[[text]]" fit-into="[[fitInto]]" duration="[[duration]]">
        <casper-icon style="flex-shrink: 0;" icon="fa-solid:times-circle"></casper-icon>
      </paper-toast>
    `;
  }

  static get is () {
    return 'casper-toast';
  }

  static get properties() {
    return {
      fitInto: {
        type: Object
      },
      duration: {
        type: Number,
        value: 5000
      },
      text: {
        type: String
      },
      backgroundColor: {
        type: String,
        observer: '_backgroundColorChanged'
      }
    };
  }

  ready () {
    super.ready();

    this._toast = this.shadowRoot.querySelector('paper-toast');
    this._closeIcon = this.shadowRoot.querySelector('casper-icon');

    // Add event listeners.
    this._toast.addEventListener('iron-overlay-closed', () => this._resetDefaults());
    this._toast.addEventListener('click', event => this._toast.close());
  }

  open () {
    this._toast.open();
  }

  close () {
    this._toast.close();
  }

  _backgroundColorChanged (backgroundColor) {
    afterNextRender(this._toast, () => {
      this._toast.style.backgroundColor = backgroundColor;
    });
  }

  _resetDefaults () {
    this.text = '';
    this.duration = 5000;
    this.backgroundColor = '';
  }
}

window.customElements.define(CasperToast.is, CasperToast);
