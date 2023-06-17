import BasicObject from "trix/core/basic_object"
import DocumentView from "trix/views/document_view"

import { defer, handleEvent, innerElementIsActive } from "trix/core/helpers"

export default class CompositionController extends BasicObject {
  constructor(element, composition) {
    super(...arguments)
    this.didFocus = this.didFocus.bind(this)
    this.didBlur = this.didBlur.bind(this)

    this.element = element
    this.composition = composition
    this.documentView = new DocumentView(this.composition.document, { element: this.element })

    handleEvent("focus", { onElement: this.element, withCallback: this.didFocus })
    handleEvent("blur", { onElement: this.element, withCallback: this.didBlur })
    handleEvent("click", {
      onElement: this.element,
      matchingSelector: "a[contenteditable=false]",
      preventDefault: true,
    })
  }

  didFocus(event) {
    const perform = () => {
      if (!this.focused) {
        this.focused = true
        return this.delegate?.compositionControllerDidFocus?.()
      }
    }

    return this.blurPromise?.then(perform) || perform()
  }

  didBlur(event) {
    this.blurPromise = new Promise((resolve) => {
      return defer(() => {
        if (!innerElementIsActive(this.element)) {
          this.focused = null
          this.delegate?.compositionControllerDidBlur?.()
        }
        this.blurPromise = null
        return resolve()
      })
    })
  }

  getSerializableElement() {
    return this.element
  }

  render() {
    if (this.revision !== this.composition.revision) {
      this.documentView.setDocument(this.composition.document)
      this.documentView.render()
      this.revision = this.composition.revision
    }

    if (this.canSyncDocumentView() && !this.documentView.isSynced()) {
      this.delegate?.compositionControllerWillSyncDocumentView?.()
      this.documentView.sync()
      this.delegate?.compositionControllerDidSyncDocumentView?.()
    }

    return this.delegate?.compositionControllerDidRender?.()
  }

  rerenderViewForObject(object) {
    this.invalidateViewForObject(object)
    return this.render()
  }

  invalidateViewForObject(object) {
    return this.documentView.invalidateViewForObject(object)
  }

  isViewCachingEnabled() {
    return this.documentView.isViewCachingEnabled()
  }

  enableViewCaching() {
    return this.documentView.enableViewCaching()
  }

  disableViewCaching() {
    return this.documentView.disableViewCaching()
  }

  refreshViewCache() {
    return this.documentView.garbageCollectCachedViews()
  }

  // Private

  canSyncDocumentView() {
    return true
  }

}
