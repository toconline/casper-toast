import '@polymer/iron-icon/iron-icon.js';
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
      </style>

      <paper-toast text="[[text]]" fit-into="[[fitInto]]" duration="[[duration]]">
        <iron-icon icon="casper-icons:cancel"></iron-icon>
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
    this._closeIcon = this.shadowRoot.querySelector('iron-icon');

    // Add event listeners.
    this._toast.addEventListener('iron-overlay-closed', () => this._resetDefaults());
    this._closeIcon.addEventListener('click', event => this._closeIconClicked(event));
  }

  open () {
    this._toast.open();
  }

  close () {
    this._toast.close();
  }

  _closeIconClicked (event) {
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
