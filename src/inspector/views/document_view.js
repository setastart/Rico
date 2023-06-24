import View from "inspector/view"

class DocumentView extends View {
  static title = "Document"
  static template = "document"
  static events = {
    "rico-change": function() {
      return this.render()
    },
  }

  render() {
    this.document = this.editor.getDocument()
    return super.render(...arguments)
  }
}

Rico.Inspector.registerView(DocumentView)
