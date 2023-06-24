import { TEST_IMAGE_URL } from "./test_image_url"

export default () =>
  `<rico-editor input="my_input" autofocus placeholder="Say hello..."></rico-editor>
  <input id="my_input" type="hidden" value="ab&lt;img src=&quot;${TEST_IMAGE_URL}&quot; width=&quot;10&quot; height=&quot;10&quot;&gt;">`
