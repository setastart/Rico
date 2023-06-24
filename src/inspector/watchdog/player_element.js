import Recording from "inspector/watchdog/recording"
import PlayerController from "inspector/watchdog/player_controller"

class PlayerElement extends HTMLElement {
  static get observedAttributes() { return [ "src" ] }

  connectedCallback() {
    const url = this.getAttribute("src")
    if (url) {
      return this.fetchRecordingAtURL(url)
    }
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === "src") {
      return this.fetchRecordingAtURL(newValue)
    }
  }

  fetchRecordingAtURL(url) {
    this.activeRequest?.abort()
    this.activeRequest = new XMLHttpRequest()
    this.activeRequest.open("GET", url)
    this.activeRequest.send()

    this.activeRequest.onload = () => {
      const json = this.activeRequest.responseText
      this.activeRequest = null
      const recording = Recording.fromJSON(JSON.parse(json))
      return this.loadRecording(recording)
    }
  }

  loadRecording(recording) {
    this.controller = new PlayerController(this, recording)
  }
}

window.customElements.define("trix-watchdog-player", PlayerElement)
