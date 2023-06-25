import lang from "rico/config/lang"

export default {
  getDefaultHTML() {
    return `<div class="rico-button-row">
      <span class="rico-button-group rico-button-group--text-tools" data-rico-button-group="text-tools">
        <button type="button" class="rico-button rico-button--icon rico-button--icon-bold" data-rico-attribute="bold" data-rico-key="b" title="${lang.bold}" tabindex="-1">${lang.bold}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-italic" data-rico-attribute="italic" data-rico-key="i" title="${lang.italic}" tabindex="-1">${lang.italic}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-small" data-rico-attribute="small" data-rico-key="shift+b" title="${lang.small}" tabindex="-1">${lang.small}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-strike" data-rico-attribute="strike" data-rico-key="shift+i" title="${lang.strike}" tabindex="-1">${lang.strike}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-link" data-rico-attribute="href" data-rico-action="link" data-rico-key="k" title="${lang.link}" tabindex="-1">${lang.link}</button>
      </span>

      <span class="rico-button-group rico-button-group--block-tools" data-rico-button-group="block-tools">
        <button type="button" class="rico-button rico-button--icon rico-button--icon-heading-1" data-rico-attribute="heading1" data-rico-key="g" title="${lang.heading1}" tabindex="-1">${lang.heading1}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-heading-2" data-rico-attribute="heading2" data-rico-key="shift+g" title="${lang.heading2}" tabindex="-1">${lang.heading2}</button>
        
        <button type="button" class="rico-button rico-button--icon rico-button--icon-quote" data-rico-attribute="quote" data-rico-key="e" title="${lang.quote}" tabindex="-1">${lang.quote}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-code" data-rico-attribute="code" data-rico-key="shift+e" title="${lang.code}" tabindex="-1">${lang.code}</button>
        
        <button type="button" class="rico-button rico-button--icon rico-button--icon-bullet-list" data-rico-attribute="bullet" data-rico-key="." title="${lang.bullets}" tabindex="-1">${lang.bullets}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-number-list" data-rico-attribute="number" data-rico-key="shift+." title="${lang.numbers}" tabindex="-1">${lang.numbers}</button>
        
        <button type="button" class="rico-button rico-button--icon rico-button--icon-decrease-nesting-level" data-rico-action="decreaseNestingLevel" title="${lang.outdent}" tabindex="-1">${lang.outdent}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-increase-nesting-level" data-rico-action="increaseNestingLevel" title="${lang.indent}" tabindex="-1">${lang.indent}</button>
      </span>

      <span class="rico-button-group-spacer"></span>

      <span class="rico-button-group rico-button-group--history-tools" data-rico-button-group="history-tools">
        <button type="button" class="rico-button rico-button--icon rico-button--icon-undo" data-rico-action="undo" data-rico-key="z" title="${lang.undo}" tabindex="-1">${lang.undo}</button>
        <button type="button" class="rico-button rico-button--icon rico-button--icon-redo" data-rico-action="redo" data-rico-key="shift+z" title="${lang.redo}" tabindex="-1">${lang.redo}</button>
      </span>
    </div>

    <div class="rico-dialogs" data-rico-dialogs>
      <div class="rico-dialog rico-dialog--link" data-rico-dialog="href" data-rico-dialog-attribute="href">
        <div class="rico-dialog__link-fields">
          <input type="url" name="href" class="rico-input rico-input--dialog" placeholder="${lang.urlPlaceholder}" aria-label="${lang.url}" required data-rico-input>
          <div class="rico-button-group">
            <input type="button" class="rico-button rico-button--dialog" value="${lang.link}" data-rico-method="setAttribute">
            <input type="button" class="rico-button rico-button--dialog" value="${lang.unlink}" data-rico-method="removeAttribute">
          </div>
        </div>
      </div>
    </div>`
  },
}
