export default () =>
  `<ul id="my_editor">
    <li><rico-toolbar id="my_toolbar"></rico-toolbar></li>
    <li><rico-editor toolbar="my_toolbar" input="my_input" autofocus placeholder="Say hello..."></rico-editor></li>
    <li><input id="my_input" type="hidden" value="&lt;div&gt;Hello world&lt;/div&gt;"></li>
  </ul>`
