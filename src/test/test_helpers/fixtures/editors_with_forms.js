export default () =>
  `<form id="ancestor-form">
    <rico-editor id="editor-with-ancestor-form"></rico-editor>
  </form>

  <form id="input-form">
    <input type="hidden" id="hidden-input">
  </form>
  <rico-editor id="editor-with-input-form" input="hidden-input"></rico-editor>

  <rico-editor id="editor-with-no-form"></rico-editor>`
