import * as config from "rico/config"


export default class RicoToolbarElement extends HTMLElement {

  // Element lifecycle

  connectedCallback() {
    if (this.innerHTML === "") {
      this.innerHTML = config.toolbar.getDefaultHTML()
    }
  }
}
