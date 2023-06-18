import * as config from "trix/config"


export default class TrixToolbarElement extends HTMLElement {

  // Element lifecycle

  connectedCallback() {
    if (this.innerHTML === "") {
      this.innerHTML = config.toolbar.getDefaultHTML()
    }
  }
}
