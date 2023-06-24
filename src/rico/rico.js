import { version } from "../../package.json"

import * as config from "rico/config"
import * as core from "rico/core"
import * as models from "rico/models"
import * as views from "rico/views"
import * as controllers from "rico/controllers"
import * as observers from "rico/observers"
import * as elements from "rico/elements"

const Rico = {
  VERSION: version,
  config,
  core,
  models,
  views,
  controllers,
  observers,
  elements
}

// Expose models under the Rico constant for compatibility with v1
Object.assign(Rico, models)

function start() {
  if (!customElements.get("rico-toolbar")) {
    customElements.define("rico-toolbar", elements.RicoToolbarElement)
  }

  if (!customElements.get("rico-editor")) {
    customElements.define("rico-editor", elements.RicoEditorElement)
  }
}

window.Rico = Rico
setTimeout(start, 0)

export default Rico
