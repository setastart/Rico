/* eslint-disable
    id-length,
*/

export default class RicoInspector extends HTMLElement {
  connectedCallback() {
    this.editorElement = document.querySelector(`rico-editor[rico-id='${this.dataset.ricoId}']`)
    this.views = this.createViews()

    this.views.forEach((view) => {
      view.render()
      this.appendChild(view.element)
    })

  }

  disconnectedCallback() {
    removeEventListener("resize", this.resizeHandler)
  }

  createViews() {
    const views = Rico.Inspector.views.map((View) => new View(this.editorElement))

    return views.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
  }
}

window.customElements.define("rico-inspector", RicoInspector)
