import * as config from "rico/config"
import ObjectView from "rico/views/object_view"
import TextView from "rico/views/text_view"

import { getBlockConfig, makeElement } from "rico/core/helpers"

export default class BlockView extends ObjectView {
  constructor() {
    super(...arguments)
    this.block = this.object
    this.attributes = this.block.getAttributes()
  }

  createNodes() {
    const comment = document.createComment("block")
    const nodes = [ comment ]
    if (this.block.isEmpty()) {
      nodes.push(makeElement("br"))
    } else {
      const textConfig = getBlockConfig(this.block.getLastAttribute())?.text
      const textView = this.findOrCreateCachedChildView(TextView, this.block.text, { textConfig })
      nodes.push(...Array.from(textView.getNodes() || []))
      if (this.shouldAddExtraNewlineElement()) {
        nodes.push(makeElement("br"))
      }
    }

    if (this.attributes.length) {
      return nodes
    } else {
      let attributes
      const { tagName } = config.blockAttributes.default
      if (this.block.isRTL()) {
        attributes = { dir: "rtl" }
      }

      const element = makeElement({ tagName, attributes })
      nodes.forEach((node) => element.appendChild(node))
      return [ element ]
    }
  }

  createContainerElement(depth) {
    const attributes = {}
    let className
    const attributeName = this.attributes[depth]

    const { tagName, htmlAttributes = [] } = getBlockConfig(attributeName)

    if (depth === 0 && this.block.isRTL()) {
      Object.assign(attributes, { dir: "rtl" })
    }

    Object.entries(this.block.htmlAttributes).forEach(([ name, value ]) => {
      if (htmlAttributes.includes(name)) {
        attributes[name] = value
      }
    })

    return makeElement({ tagName, className, attributes })
  }

  // A single <br> at the end of a block element has no visual representation
  // so add an extra one.
  shouldAddExtraNewlineElement() {
    return /\n\n$/.test(this.block.toString())
  }
}
