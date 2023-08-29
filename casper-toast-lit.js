import { LitElement, html, css } from 'lit';
import '@cloudware-casper/casper-icons/casper-icon.js';


class CasperToastLit extends LitElement {
  static properties = {
    _text: {
      type: String
    },
    _showDialog: {
      type: Boolean,
      attribute: 'show-dialog',
      reflect: true
    },
    transitionDuration: {
      type: Number
    }
  };

  static styles = css`
    :host {
      --toast-background-color: var(--primary-color);
      --toast-text-color: #FFF;

      position: fixed;
      bottom: 1rem;
      left: 1rem;
      width: calc(100% - 2rem);
      opacity: 0;
      transform: translateY(100px);
      transition: opacity var(--transition-duration, 300ms) linear, transform calc(var(--transition-duration, 300ms) + 700ms) linear;
      pointer-events: none;
    }

    :host([show-dialog]) {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
      z-index: 105;
      transition: opacity var(--transition-duration, 300ms) linear, transform var(--transition-duration, 300ms) linear;
    }

    .toast {
      position: static;
      box-sizing: border-box;
      width: 100%;
      padding: 1.142em;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--toast-text-color);
      background-color: var(--toast-background-color);
      box-shadow: rgba(0, 0, 0, 15%) 0 5px 20px;
      border: none;
      border-radius: 4px;
      align-items: center;
      gap: 1.142em;
      transition: filter 1s ease;
      display: flex;
    }

    .toast[open] {
      display: flex;
    }

    .toast:hover {
      cursor: pointer;
      filter: brightness(80%);
    }

    .toast__text {
      flex-grow: 1;
      white-space: pre-line;
    }

    .toast__text a {
      color: var(--toast-background-color);
      background-color: var(--toast-text-color);
      padding: 0.142em 0.428em;
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
        <div class="toast__text">${this._text}</div>
        <casper-icon class="toast__close" icon="fa-solid:times-circle"></casper-icon>
      </dialog>
    `;
  }

  willUpdate (changedProperties) {
    if (changedProperties.has('transitionDuration')) {
      this.style.setProperty('--transition-duration', `${this.transitionDuration}ms`);
    }
  }

  firstUpdated () {
    this._toastEl = this.shadowRoot.getElementById('toast');
  }



  //***************************************************************************************//
  //                              ~~~ Public methods  ~~~                                  //
  //***************************************************************************************//

  setInitialValues () {
    this._text = '';
    this._toastDuration = 5000;
    this.transitionDuration = 300;
  }
  
  open (options) {
    if (options.text) this._text = options.text;
    if (options.duration) this._toastDuration = options.duration;
    if (options.background_color) this.style.setProperty('--toast-background-color', options.background_color);

    this._toastEl.show();
    this._showDialog = true;

    setTimeout(() => {
      this.close();
    }, this._toastDuration);
  }

  close () {
    this._showDialog = false;

    setTimeout(() => {
      this._toastEl.close();
      this.setInitialValues();
    }, this.transitionDuration);
  }

  isOpen () {
    return this._toastEl.open;
  }
}

customElements.define('casper-toast-lit', CasperToastLit);