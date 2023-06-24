export default () =>
  `<rico-editor id="editor-without-labels"></rico-editor>

  <label for="editor-with-aria-label"><span>Label text</span></label>
  <rico-editor id="editor-with-aria-label" aria-label="ARIA Label text"></rico-editor>

  <span id="aria-labelledby-id">ARIA Labelledby</span>
  <label for="editor-with-aria-labelledby"><span>Label text</span></label>
  <rico-editor id="editor-with-aria-labelledby" aria-labelledby="aria-labelledby-id"></rico-editor>

  <label for="editor-with-labels"><span>Label 1</span></label>
  <label for="editor-with-labels"><span>Label 2</span></label>
  <label for="editor-with-labels"><span>Label 3</span></label>
  <label>
    <span>Label 4</span>
    <rico-editor id="editor-with-labels"></rico-editor>
  </label>

  <label id="modified-label" for="editor-with-modified-label">Original Value</label>
  <rico-editor id="editor-with-modified-label"></rico-editor>`
