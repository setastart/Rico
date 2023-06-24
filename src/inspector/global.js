window.Rico.Inspector = {
  views: [],

  registerView(constructor) {
    return this.views.push(constructor)
  },

  install(editorElement) {
    this.editorElement = editorElement
    const element = document.createElement("rico-inspector")
    element.dataset.ricoId = this.editorElement.ricoId
    return document.body.appendChild(element)
  },
}
