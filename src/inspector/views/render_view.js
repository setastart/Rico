import View from "inspector/view"

export default class RenderView extends View {
  static title = "Renders"
  static template = "render"
  static events = {
    "rico-render": function() {
      this.renderCount++
      return this.render()
    },

    "rico-sync": function() {
      this.syncCount++
      return this.render()
    },
  }

  constructor() {
    super(...arguments)
    this.renderCount = 0
    this.syncCount = 0
  }

  getTitle() {
    return `${this.title} (${this.renderCount})`
  }
}

Rico.Inspector.registerView(RenderView)
