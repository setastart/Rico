/* eslint-disable
    id-length,
*/

export default class TrixInspector extends HTMLElement {
  connectedCallback() {
    this.editorElement = document.querySelector(`trix-editor[trix-id='${this.dataset.trixId}']`)
    this.views = this.createViews()

    this.views.forEach((view) => {
      view.render()
      this.appendChild(view.element)
    })

    this.reposition()

    this.resizeHandler = this.reposition.bind(this)
    addEventListener("resize", this.resizeHandler)
  }

  disconnectedCallback() {
    removeEventListener("resize", this.resizeHandler)
  }

  createViews() {
    const views = Trix.Inspector.views.map((View) => new View(this.editorElement))

    return views.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
  }

  reposition() {
    const { top, right } = this.editorElement.getBoundingClientRect()

    this.style.top = `${top}px`
    this.style.left = `${right + 10}px`
    this.style.maxWidth = `${window.innerWidth - right - 40}px`
    this.style.maxHeight = `${window.innerHeight - top - 30}px`
  }
}

window.customElements.define("trix-inspector", TrixInspector)
