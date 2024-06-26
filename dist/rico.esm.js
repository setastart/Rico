/*
Rico 2.1.0
Copyright © 2024 setastart.com
 */
var name = "rico";
var version = "2.1.0";
var description = "A Rich Text Editor for basic WYSIWYG HTML editing";
var main = "dist/rico.umd.min.js";
var files = [
	"dist/*.js",
	"dist/gfx"
];
var repository = {
	type: "git",
	url: "git+https://github.com/setastart/rico.git"
};
var keywords = [
	"rich text",
	"wysiwyg",
	"editor"
];
var author = "setastart.com";
var license = "EUPL 1.2";
var bugs = {
	url: "https://github.com/setastart"
};
var homepage = "https://setastart.com";
var devDependencies = {
	"@babel/core": "^7.16.0",
	"@babel/preset-env": "^7.16.4",
	"@rollup/plugin-babel": "^5.3.0",
	"@rollup/plugin-commonjs": "^22.0.2",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^13.3.0",
	"@web/dev-server": "^0.1.34",
	"babel-eslint": "^10.1.0",
	concurrently: "^7.4.0",
	eslint: "^7.32.0",
	karma: "6.4.1",
	"karma-chrome-launcher": "3.2.0",
	"karma-firefox-launcher": "^2.1.2",
	"karma-qunit": "^4.1.2",
	"karma-safari-launcher": "~0.1",
	"karma-sauce-launcher": "^4.3.6",
	qunit: "2.19.1",
	rangy: "^1.3.0",
	rollup: "^2.56.3",
	"rollup-plugin-includepaths": "^0.2.4",
	"rollup-plugin-terser": "^7.0.2",
	webdriverio: "^7.19.5"
};
var scripts = {
	"build-js": "rollup -c",
	pngquant: "pngquant --force --speed 1 --verbose --ext .png 256 -- dist/gfx/*/*.png",
	favicon: "convert -verbose dist/gfx/icon-rico/icon-rico-512.png -define icon:auto-resize=16,32,64 -compress zip dist/favicon.ico",
	"build-assets": "cp -rfv assets/ dist/ && yarn pngquant && yarn favicon",
	build: "yarn run build-js && yarn run build-assets",
	watch: "rollup -c -w",
	lint: "eslint .",
	pretest: "yarn run lint && yarn run build",
	test: "karma start",
	prerelease: "yarn version && yarn test",
	release: "npm adduser && npm publish",
	postrelease: "git push && git push --tags",
	dev: "web-dev-server --app-index index.html --root-dir dist --node-resolve --open",
	start: "yarn build-assets && concurrently --kill-others --names js,dev-server 'yarn watch' 'yarn dev'"
};
var packageManager = "yarn@3.6.0+sha512.418e45c2268c4d6b69a28f3939084b5853d5f392c43c0b5588bd1995a96e328414ae4b7777a8980c64bad4328c52586ff879b289f98ae65372a55fa4d0ff70dd";
var _package = {
	name: name,
	version: version,
	description: description,
	main: main,
	files: files,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	scripts: scripts,
	packageManager: packageManager
};

const attributes = {
  default: {
    tagName: "p",
    breakOnReturn: true,
    parse: false
  },
  quote: {
    tagName: "blockquote"
  },
  heading1: {
    tagName: "h1",
    terminal: true,
    breakOnReturn: true,
    group: false
  },
  heading2: {
    tagName: "h2",
    terminal: true,
    breakOnReturn: true,
    group: false
  },
  code: {
    tagName: "pre",
    terminal: true,
    htmlAttributes: ["language"],
    text: {
      plaintext: true
    }
  },
  bulletList: {
    tagName: "ul",
    parse: false
  },
  bullet: {
    tagName: "li",
    listAttribute: "bulletList",
    group: false,
    nestable: true,

    test(element) {
      return tagName$1(element.parentNode) === attributes[this.listAttribute].tagName;
    }

  },
  numberList: {
    tagName: "ol",
    parse: false
  },
  number: {
    tagName: "li",
    listAttribute: "numberList",
    group: false,
    nestable: true,

    test(element) {
      return tagName$1(element.parentNode) === attributes[this.listAttribute].tagName;
    }

  }
};

const tagName$1 = element => {
  var _element$tagName;

  return element === null || element === void 0 ? void 0 : (_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toLowerCase();
};

const androidVersionMatch = navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i);
const androidVersion = androidVersionMatch && parseInt(androidVersionMatch[1]);
var browser = {
  // Android emits composition events when moving the cursor through existing text
  // Introduced in Chrome 65: https://bugs.chromium.org/p/chromium/issues/detail?id=764439#c9
  composesExistingText: /Android.*Chrome/.test(navigator.userAgent),
  // Android 13, especially on Samsung keyboards, emits extra compositionend and beforeinput events
  // that can make the input handler lose the current selection or enter an infinite input -> render -> input
  // loop.
  recentAndroid: androidVersion && androidVersion > 12,
  samsungAndroid: androidVersion && navigator.userAgent.match(/Android.*SM-/),
  // IE 11 activates resizing handles on editable elements that have "layout"
  forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent),
  // https://www.w3.org/TR/input-events-1/ + https://www.w3.org/TR/input-events-2/
  supportsInputEvents: typeof InputEvent !== "undefined" && ["data", "getTargetRanges", "inputType"].every(prop => prop in InputEvent.prototype)
};

const input = {
  level2Enabled: true,

  getLevel() {
    if (this.level2Enabled && browser.supportsInputEvents) {
      return 2;
    } else {
      return 0;
    }
  }

};

var key_names = {
  8: "backspace",
  9: "tab",
  13: "return",
  27: "escape",
  37: "left",
  39: "right",
  46: "delete",
  68: "d",
  72: "h",
  79: "o"
};

var lang = {
  bold: "Bold",
  bullets: "Bulleted list",
  code: "Preformatted text",
  heading1: "Heading T1",
  heading2: "Heading T2",
  heading3: "Heading T3",
  indent: "Indent",
  italic: "Italic",
  link: "Link",
  numbers: "Numbered list",
  outdent: "Outdent",
  quote: "Quoted text",
  redo: "Redo",
  remove: "Remove",
  small: "Small",
  strike: "Strikethrough",
  undo: "Undo",
  unlink: "Unlink",
  url: "URL",
  urlPlaceholder: "Enter a URL…"
};

var parser = {
  removeBlankTableCells: false,
  tableCellSeparator: " | ",
  tableRowSeparator: "\n"
};

var text_attributes = {
  bold: {
    tagName: "strong",
    inheritable: true,

    parser(element) {
      const style = window.getComputedStyle(element);
      return style.fontWeight === "bold" || style.fontWeight >= 600;
    }

  },
  italic: {
    tagName: "em",
    inheritable: true,

    parser(element) {
      const style = window.getComputedStyle(element);
      return style.fontStyle === "italic";
    }

  },
  small: {
    tagName: "small",
    inheritable: true,

    parser(element) {
      const style = window.getComputedStyle(element);
      return style.fontStyle === "small";
    }

  },
  href: {
    groupTagName: "a",

    parser(element) {
      const matchingSelector = "a";
      const link = element.closest(matchingSelector);

      if (link) {
        return link.getAttribute("href");
      }
    }

  },
  strike: {
    tagName: "del",
    inheritable: true
  },
  frozen: {
    style: {
      backgroundColor: "highlight"
    }
  }
};

var toolbar = {
  getDefaultHTML() {
    return "<div class=\"rico-button-row\">\n      <span class=\"rico-button-group rico-button-group-text-tools\" data-rico-button-group=\"text-tools\">\n        <button type=\"button\" class=\"rico-button rico-button-bold\" data-rico-attribute=\"bold\" data-rico-key=\"b\" title=\"".concat(lang.bold, "\" tabindex=\"-1\">").concat(lang.bold, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-italic\" data-rico-attribute=\"italic\" data-rico-key=\"i\" title=\"").concat(lang.italic, "\" tabindex=\"-1\">").concat(lang.italic, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-small\" data-rico-attribute=\"small\" data-rico-key=\"shift+b\" title=\"").concat(lang.small, "\" tabindex=\"-1\">").concat(lang.small, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-strike\" data-rico-attribute=\"strike\" data-rico-key=\"shift+i\" title=\"").concat(lang.strike, "\" tabindex=\"-1\">").concat(lang.strike, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-link\" data-rico-attribute=\"href\" data-rico-action=\"link\" data-rico-key=\"k\" title=\"").concat(lang.link, "\" tabindex=\"-1\">").concat(lang.link, "</button>\n      </span>\n\n      <span class=\"rico-button-group rico-button-group-block-tools\" data-rico-button-group=\"block-tools\">\n        <button type=\"button\" class=\"rico-button rico-button-heading1\" data-rico-attribute=\"heading1\" data-rico-key=\"g\" title=\"").concat(lang.heading1, "\" tabindex=\"-1\">").concat(lang.heading1, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-heading2\" data-rico-attribute=\"heading2\" data-rico-key=\"shift+g\" title=\"").concat(lang.heading2, "\" tabindex=\"-1\">").concat(lang.heading2, "</button>\n        \n        <button type=\"button\" class=\"rico-button rico-button-quote\" data-rico-attribute=\"quote\" data-rico-key=\"e\" title=\"").concat(lang.quote, "\" tabindex=\"-1\">").concat(lang.quote, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-code\" data-rico-attribute=\"code\" data-rico-key=\"shift+e\" title=\"").concat(lang.code, "\" tabindex=\"-1\">").concat(lang.code, "</button>\n        \n        <button type=\"button\" class=\"rico-button rico-button-bullets\" data-rico-attribute=\"bullet\" data-rico-key=\".\" title=\"").concat(lang.bullets, "\" tabindex=\"-1\">").concat(lang.bullets, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-numbers\" data-rico-attribute=\"number\" data-rico-key=\"shift+.\" title=\"").concat(lang.numbers, "\" tabindex=\"-1\">").concat(lang.numbers, "</button>\n        \n        <button type=\"button\" class=\"rico-button rico-button-unindent\" data-rico-action=\"decreaseNestingLevel\" title=\"").concat(lang.outdent, "\" tabindex=\"-1\">").concat(lang.outdent, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-indent\" data-rico-action=\"increaseNestingLevel\" title=\"").concat(lang.indent, "\" tabindex=\"-1\">").concat(lang.indent, "</button>\n      </span>\n\n      <span class=\"rico-button-group rico-button-group-history-tools\" data-rico-button-group=\"history-tools\">\n        <button type=\"button\" class=\"rico-button rico-button-undo\" data-rico-action=\"undo\" data-rico-key=\"z\" title=\"").concat(lang.undo, "\" tabindex=\"-1\">").concat(lang.undo, "</button>\n        <button type=\"button\" class=\"rico-button rico-button-redo\" data-rico-action=\"redo\" data-rico-key=\"shift+z\" title=\"").concat(lang.redo, "\" tabindex=\"-1\">").concat(lang.redo, "</button>\n      </span>\n    </div>\n\n    <div class=\"rico-dialogs\" data-rico-dialogs>\n      <div class=\"rico-dialog rico-dialog-link\" data-rico-dialog=\"href\" data-rico-dialog-attribute=\"href\">\n        <div class=\"rico-dialog__link-fields\">\n          <input type=\"url\" name=\"href\" class=\"rico-input rico-input-dialog\" placeholder=\"").concat(lang.urlPlaceholder, "\" aria-label=\"").concat(lang.url, "\" required data-rico-input>\n          <div class=\"rico-button-group\">\n            <input type=\"button\" class=\"rico-button rico-button-dialog\" value=\"").concat(lang.link, "\" data-rico-method=\"setAttribute\">\n            <input type=\"button\" class=\"rico-button rico-button-dialog\" value=\"").concat(lang.unlink, "\" data-rico-method=\"removeAttribute\">\n          </div>\n        </div>\n      </div>\n    </div>");
  }

};

const undo = {
  interval: 5000
};

var config = /*#__PURE__*/Object.freeze({
  __proto__: null,
  blockAttributes: attributes,
  browser: browser,
  input: input,
  keyNames: key_names,
  lang: lang,
  parser: parser,
  textAttributes: text_attributes,
  toolbar: toolbar,
  undo: undo
});

class BasicObject {
  static proxyMethod(expression) {
    const {
      name,
      toMethod,
      toProperty,
      optional
    } = parseProxyMethodExpression(expression);

    this.prototype[name] = function () {
      let subject;
      let object;

      if (toMethod) {
        if (optional) {
          var _this$toMethod;

          object = (_this$toMethod = this[toMethod]) === null || _this$toMethod === void 0 ? void 0 : _this$toMethod.call(this);
        } else {
          object = this[toMethod]();
        }
      } else if (toProperty) {
        object = this[toProperty];
      }

      if (optional) {
        var _object;

        subject = (_object = object) === null || _object === void 0 ? void 0 : _object[name];

        if (subject) {
          return apply.call(subject, object, arguments);
        }
      } else {
        subject = object[name];
        return apply.call(subject, object, arguments);
      }
    };
  }

}

const parseProxyMethodExpression = function (expression) {
  const match = expression.match(proxyMethodExpressionPattern);

  if (!match) {
    throw new Error("can't parse @proxyMethod expression: ".concat(expression));
  }

  const args = {
    name: match[4]
  };

  if (match[2] != null) {
    args.toMethod = match[1];
  } else {
    args.toProperty = match[1];
  }

  if (match[3] != null) {
    args.optional = true;
  }

  return args;
};

const {
  apply
} = Function.prototype;
const proxyMethodExpressionPattern = new RegExp("\
^\
(.+?)\
(\\(\\))?\
(\\?)?\
\\.\
(.+?)\
$\
");

var _Array$from, _$codePointAt, _, _String$fromCodePoint;
class UTF16String extends BasicObject {
  static box() {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    if (value instanceof this) {
      return value;
    } else {
      return this.fromUCS2String(value === null || value === void 0 ? void 0 : value.toString());
    }
  }

  static fromUCS2String(ucs2String) {
    return new this(ucs2String, ucs2decode(ucs2String));
  }

  static fromCodepoints(codepoints) {
    return new this(ucs2encode(codepoints), codepoints);
  }

  constructor(ucs2String, codepoints) {
    super(...arguments);
    this.ucs2String = ucs2String;
    this.codepoints = codepoints;
    this.length = this.codepoints.length;
    this.ucs2Length = this.ucs2String.length;
  }

  offsetToUCS2Offset(offset) {
    return ucs2encode(this.codepoints.slice(0, Math.max(0, offset))).length;
  }

  offsetFromUCS2Offset(ucs2Offset) {
    return ucs2decode(this.ucs2String.slice(0, Math.max(0, ucs2Offset))).length;
  }

  slice() {
    return this.constructor.fromCodepoints(this.codepoints.slice(...arguments));
  }

  charAt(offset) {
    return this.slice(offset, offset + 1);
  }

  isEqualTo(value) {
    return this.constructor.box(value).ucs2String === this.ucs2String;
  }

  toJSON() {
    return this.ucs2String;
  }

  getCacheKey() {
    return this.ucs2String;
  }

  toString() {
    return this.ucs2String;
  }

}
const hasArrayFrom = ((_Array$from = Array.from) === null || _Array$from === void 0 ? void 0 : _Array$from.call(Array, "\ud83d\udc7c").length) === 1;
const hasStringCodePointAt = ((_$codePointAt = (_ = " ").codePointAt) === null || _$codePointAt === void 0 ? void 0 : _$codePointAt.call(_, 0)) != null;
const hasStringFromCodePoint = ((_String$fromCodePoint = String.fromCodePoint) === null || _String$fromCodePoint === void 0 ? void 0 : _String$fromCodePoint.call(String, 32, 128124)) === " \ud83d\udc7c"; // UCS-2 conversion helpers ported from Mathias Bynens' Punycode.js:
// https://github.com/bestiejs/punycode.js#punycodeucs2

let ucs2decode, ucs2encode; // Creates an array containing the numeric code points of each Unicode
// character in the string. While JavaScript uses UCS-2 internally,
// this function will convert a pair of surrogate halves (each of which
// UCS-2 exposes as separate characters) into a single code point,
// matching UTF-16.

if (hasArrayFrom && hasStringCodePointAt) {
  ucs2decode = string => Array.from(string).map(char => char.codePointAt(0));
} else {
  ucs2decode = function (string) {
    const output = [];
    let counter = 0;
    const {
      length
    } = string;

    while (counter < length) {
      let value = string.charCodeAt(counter++);

      if (0xd800 <= value && value <= 0xdbff && counter < length) {
        // high surrogate, and there is a next character
        const extra = string.charCodeAt(counter++);

        if ((extra & 0xfc00) === 0xdc00) {
          // low surrogate
          value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
        } else {
          // unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair
          counter--;
        }
      }

      output.push(value);
    }

    return output;
  };
} // Creates a string based on an array of numeric code points.


if (hasStringFromCodePoint) {
  ucs2encode = array => String.fromCodePoint(...Array.from(array || []));
} else {
  ucs2encode = function (array) {
    const characters = (() => {
      const result = [];
      Array.from(array).forEach(value => {
        let output = "";

        if (value > 0xffff) {
          value -= 0x10000;
          output += String.fromCharCode(value >>> 10 & 0x3ff | 0xd800);
          value = 0xdc00 | value & 0x3ff;
        }

        result.push(output + String.fromCharCode(value));
      });
      return result;
    })();

    return characters.join("");
  };
}

let id$2 = 0;
class RicoObject extends BasicObject {
  static fromJSONString(jsonString) {
    return this.fromJSON(JSON.parse(jsonString));
  }

  constructor() {
    super(...arguments);
    this.id = ++id$2;
  }

  hasSameConstructorAs(object) {
    return this.constructor === (object === null || object === void 0 ? void 0 : object.constructor);
  }

  isEqualTo(object) {
    return this === object;
  }

  inspect() {
    const parts = [];
    const contents = this.contentsForInspection() || {};

    for (const key in contents) {
      const value = contents[key];
      parts.push("".concat(key, "=").concat(value));
    }

    return "#<".concat(this.constructor.name, ":").concat(this.id).concat(parts.length ? " ".concat(parts.join(", ")) : "", ">");
  }

  contentsForInspection() {}

  toJSONString() {
    return JSON.stringify(this);
  }

  toUTF16String() {
    return UTF16String.box(this);
  }

  getCacheKey() {
    return this.id.toString();
  }

}

/* eslint-disable
    id-length,
*/
const arraysAreEqual = function () {
  let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index++) {
    const value = a[index];

    if (value !== b[index]) {
      return false;
    }
  }

  return true;
};
const arrayStartsWith = function () {
  let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return arraysAreEqual(a.slice(0, b.length), b);
};
const spliceArray = function (array) {
  const result = array.slice(0);

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  result.splice(...args);
  return result;
};
const summarizeArrayChange = function () {
  let oldArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let newArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  const added = [];
  const removed = [];
  const existingValues = new Set();
  oldArray.forEach(value => {
    existingValues.add(value);
  });
  const currentValues = new Set();
  newArray.forEach(value => {
    currentValues.add(value);

    if (!existingValues.has(value)) {
      added.push(value);
    }
  });
  oldArray.forEach(value => {
    if (!currentValues.has(value)) {
      removed.push(value);
    }
  });
  return {
    added,
    removed
  };
};

const ZERO_WIDTH_SPACE = "\uFEFF";
const NON_BREAKING_SPACE = "\u00A0";
const OBJECT_REPLACEMENT_CHARACTER = "\uFFFC";

const extend = function (properties) {
  for (const key in properties) {
    const value = properties[key];
    this[key] = value;
  }

  return this;
};

const html = document.documentElement;
const match = html.matches;
const handleEvent = function (eventName) {
  let {
    onElement,
    matchingSelector,
    withCallback,
    inPhase,
    preventDefault,
    times
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const element = onElement ? onElement : html;
  const selector = matchingSelector;
  const useCapture = inPhase === "capturing";

  const handler = function (event) {
    if (times != null && --times === 0) {
      handler.destroy();
    }

    const target = findClosestElementFromNode(event.target, {
      matchingSelector: selector
    });

    if (target != null) {
      withCallback === null || withCallback === void 0 ? void 0 : withCallback.call(target, event, target);

      if (preventDefault) {
        event.preventDefault();
      }
    }
  };

  handler.destroy = () => element.removeEventListener(eventName, handler, useCapture);

  element.addEventListener(eventName, handler, useCapture);
  return handler;
};
const handleEventOnce = function (eventName) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options.times = 1;
  return handleEvent(eventName, options);
};
const triggerEvent = function (eventName) {
  let {
    onElement,
    bubbles,
    cancelable,
    attributes
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const element = onElement != null ? onElement : html;
  bubbles = bubbles !== false;
  cancelable = cancelable !== false;
  const event = document.createEvent("Events");
  event.initEvent(eventName, bubbles, cancelable);

  if (attributes != null) {
    extend.call(event, attributes);
  }

  return element.dispatchEvent(event);
};
const elementMatchesSelector = function (element, selector) {
  if ((element === null || element === void 0 ? void 0 : element.nodeType) === 1) {
    return match.call(element, selector);
  }
};
const findClosestElementFromNode = function (node) {
  let {
    matchingSelector,
    untilNode
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  while (node && node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }

  if (node == null) {
    return;
  }

  if (matchingSelector != null) {
    if (node.closest && untilNode == null) {
      return node.closest(matchingSelector);
    } else {
      while (node && node !== untilNode) {
        if (elementMatchesSelector(node, matchingSelector)) {
          return node;
        }

        node = node.parentNode;
      }
    }
  } else {
    return node;
  }
};
const findInnerElement = function (element) {
  while ((_element = element) !== null && _element !== void 0 && _element.firstElementChild) {
    var _element;

    element = element.firstElementChild;
  }

  return element;
};
const innerElementIsActive = element => document.activeElement !== element && elementContainsNode(element, document.activeElement);
const elementContainsNode = function (element, node) {
  if (!element || !node) {
    return;
  }

  while (node) {
    if (node === element) {
      return true;
    }

    node = node.parentNode;
  }
};
const findNodeFromContainerAndOffset = function (container, offset) {
  if (!container) {
    return;
  }

  if (container.nodeType === Node.TEXT_NODE) {
    return container;
  } else if (offset === 0) {
    return container.firstChild != null ? container.firstChild : container;
  } else {
    return container.childNodes.item(offset - 1);
  }
};
const findElementFromContainerAndOffset = function (container, offset) {
  const node = findNodeFromContainerAndOffset(container, offset);
  return findClosestElementFromNode(node);
};
const findChildIndexOfNode = function (node) {
  var _node;

  if (!((_node = node) !== null && _node !== void 0 && _node.parentNode)) {
    return;
  }

  let childIndex = 0;
  node = node.previousSibling;

  while (node) {
    childIndex++;
    node = node.previousSibling;
  }

  return childIndex;
};
const removeNode = node => {
  var _node$parentNode;

  return node === null || node === void 0 ? void 0 : (_node$parentNode = node.parentNode) === null || _node$parentNode === void 0 ? void 0 : _node$parentNode.removeChild(node);
};
const walkTree = function (tree) {
  let {
    onlyNodesOfType,
    usingFilter,
    expandEntityReferences
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  const whatToShow = (() => {
    switch (onlyNodesOfType) {
      case "element":
        return NodeFilter.SHOW_ELEMENT;

      case "text":
        return NodeFilter.SHOW_TEXT;

      case "comment":
        return NodeFilter.SHOW_COMMENT;

      default:
        return NodeFilter.SHOW_ALL;
    }
  })();

  return document.createTreeWalker(tree, whatToShow, usingFilter != null ? usingFilter : null, expandEntityReferences === true);
};
const tagName = element => {
  var _element$tagName;

  return element === null || element === void 0 ? void 0 : (_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toLowerCase();
};
const makeElement = function (tag) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let key, value;

  if (typeof tag === "object") {
    options = tag;
    tag = options.tagName;
  } else {
    options = {
      attributes: options
    };
  }

  const element = document.createElement(tag);

  if (options.editable != null) {
    if (options.attributes == null) {
      options.attributes = {};
    }

    options.attributes.contenteditable = options.editable;
  }

  if (options.attributes) {
    for (key in options.attributes) {
      value = options.attributes[key];
      element.setAttribute(key, value);
    }
  }

  if (options.style) {
    for (key in options.style) {
      value = options.style[key];
      element.style[key] = value;
    }
  }

  if (options.data) {
    for (key in options.data) {
      value = options.data[key];
      element.dataset[key] = value;
    }
  }

  if (options.className) {
    options.className.split(" ").forEach(className => {
      element.classList.add(className);
    });
  }

  if (options.textContent) {
    element.textContent = options.textContent;
  }

  if (options.childNodes) {
    [].concat(options.childNodes).forEach(childNode => {
      element.appendChild(childNode);
    });
  }

  return element;
};
let blockTagNames = undefined;
const getBlockTagNames = function () {
  if (blockTagNames != null) {
    return blockTagNames;
  }

  blockTagNames = [];

  for (const key in attributes) {
    const attributes$1 = attributes[key];

    if (attributes$1.tagName) {
      blockTagNames.push(attributes$1.tagName);
    }
  }

  return blockTagNames;
};
const nodeIsBlockContainer = node => nodeIsBlockStartComment(node === null || node === void 0 ? void 0 : node.firstChild);
const nodeProbablyIsBlockContainer = function (node) {
  return getBlockTagNames().includes(tagName(node)) && !getBlockTagNames().includes(tagName(node.firstChild));
};
const nodeIsBlockStart = function (node) {
  let {
    strict
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    strict: true
  };

  if (strict) {
    return nodeIsBlockStartComment(node);
  } else {
    return nodeIsBlockStartComment(node) || !nodeIsBlockStartComment(node.firstChild) && nodeProbablyIsBlockContainer(node);
  }
};
const nodeIsBlockStartComment = node => nodeIsCommentNode(node) && (node === null || node === void 0 ? void 0 : node.data) === "block";
const nodeIsCommentNode = node => (node === null || node === void 0 ? void 0 : node.nodeType) === Node.COMMENT_NODE;
const nodeIsCursorTarget = function (node) {
  let {
    name
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!node) {
    return;
  }

  if (nodeIsTextNode(node)) {
    if (node.data === ZERO_WIDTH_SPACE) {
      if (name) {
        return node.parentNode.dataset.ricoCursorTarget === name;
      } else {
        return true;
      }
    }
  } else {
    return nodeIsCursorTarget(node.firstChild);
  }
};
const nodeIsEmptyTextNode = node => nodeIsTextNode(node) && (node === null || node === void 0 ? void 0 : node.data) === "";
const nodeIsTextNode = node => (node === null || node === void 0 ? void 0 : node.nodeType) === Node.TEXT_NODE;

const RTL_PATTERN = /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/;
const getDirection = function () {
  const input = makeElement("input", {
    dir: "auto",
    name: "x",
    dirName: "x.dir"
  });
  const textArea = makeElement("textarea", {
    dir: "auto",
    name: "y",
    dirName: "y.dir"
  });
  const form = makeElement("form");
  form.appendChild(input);
  form.appendChild(textArea);

  const supportsDirName = function () {
    try {
      return new FormData(form).has(textArea.dirName);
    } catch (error) {
      return false;
    }
  }();

  const supportsDirSelector = function () {
    try {
      return input.matches(":dir(ltr),:dir(rtl)");
    } catch (error) {
      return false;
    }
  }();

  if (supportsDirName) {
    return function (string) {
      textArea.value = string;
      return new FormData(form).get(textArea.dirName);
    };
  } else if (supportsDirSelector) {
    return function (string) {
      input.value = string;

      if (input.matches(":dir(rtl)")) {
        return "rtl";
      } else {
        return "ltr";
      }
    };
  } else {
    return function (string) {
      const char = string.trim().charAt(0);

      if (RTL_PATTERN.test(char)) {
        return "rtl";
      } else {
        return "ltr";
      }
    };
  }
}();

let allAttributeNames = null;
let blockAttributeNames = null;
let textAttributeNames = null;
let listAttributeNames = null;
const getAllAttributeNames = () => {
  if (!allAttributeNames) {
    allAttributeNames = getTextAttributeNames().concat(getBlockAttributeNames());
  }

  return allAttributeNames;
};
const getBlockConfig = attributeName => attributes[attributeName];
const getBlockAttributeNames = () => {
  if (!blockAttributeNames) {
    blockAttributeNames = Object.keys(attributes);
  }

  return blockAttributeNames;
};
const getTextConfig = attributeName => text_attributes[attributeName];
const getTextAttributeNames = () => {
  if (!textAttributeNames) {
    textAttributeNames = Object.keys(text_attributes);
  }

  return textAttributeNames;
};
const getListAttributeNames = () => {
  if (!listAttributeNames) {
    listAttributeNames = [];

    for (const key in attributes) {
      const {
        listAttribute
      } = attributes[key];

      if (listAttribute != null) {
        listAttributeNames.push(listAttribute);
      }
    }
  }

  return listAttributeNames;
};

const testTransferData = {
  "application/x-rico-feature-detection": "test"
};
const dataTransferIsPlainText = function (dataTransfer) {
  const text = dataTransfer.getData("text/plain");
  const html = dataTransfer.getData("text/html");

  if (text && html) {
    const {
      body
    } = new DOMParser().parseFromString(html, "text/html");

    if (body.textContent === text) {
      return !body.querySelector("*");
    }
  } else {
    return text === null || text === void 0 ? void 0 : text.length;
  }
};
const dataTransferIsWritable = function (dataTransfer) {
  if (!(dataTransfer !== null && dataTransfer !== void 0 && dataTransfer.setData)) return false;

  for (const key in testTransferData) {
    const value = testTransferData[key];

    try {
      dataTransfer.setData(key, value);
      if (!dataTransfer.getData(key) === value) return false;
    } catch (error) {
      return false;
    }
  }

  return true;
};
const keyEventIsKeyboardCommand = function () {
  if (/Mac|^iP/.test(navigator.platform)) {
    return event => event.metaKey;
  } else {
    return event => event.ctrlKey;
  }
}();

const defer = fn => setTimeout(fn, 1);

/* eslint-disable
    id-length,
*/
const copyObject = function () {
  let object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const result = {};

  for (const key in object) {
    const value = object[key];
    result[key] = value;
  }

  return result;
};
const objectsAreEqual = function () {
  let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in a) {
    const value = a[key];

    if (value !== b[key]) {
      return false;
    }
  }

  return true;
};

const normalizeRange = function (range) {
  if (range == null) return;

  if (!Array.isArray(range)) {
    range = [range, range];
  }

  return [copyValue(range[0]), copyValue(range[1] != null ? range[1] : range[0])];
};
const rangeIsCollapsed = function (range) {
  if (range == null) return;
  const [start, end] = normalizeRange(range);
  return rangeValuesAreEqual(start, end);
};
const rangesAreEqual = function (leftRange, rightRange) {
  if (leftRange == null || rightRange == null) return;
  const [leftStart, leftEnd] = normalizeRange(leftRange);
  const [rightStart, rightEnd] = normalizeRange(rightRange);
  return rangeValuesAreEqual(leftStart, rightStart) && rangeValuesAreEqual(leftEnd, rightEnd);
};

const copyValue = function (value) {
  if (typeof value === "number") {
    return value;
  } else {
    return copyObject(value);
  }
};

const rangeValuesAreEqual = function (left, right) {
  if (typeof left === "number") {
    return left === right;
  } else {
    return objectsAreEqual(left, right);
  }
};

class SelectionChangeObserver extends BasicObject {
  constructor() {
    super(...arguments);
    this.update = this.update.bind(this);
    this.selectionManagers = [];
  }

  start() {
    if (!this.started) {
      this.started = true;
      document.addEventListener("selectionchange", this.update, true);
    }
  }

  stop() {
    if (this.started) {
      this.started = false;
      return document.removeEventListener("selectionchange", this.update, true);
    }
  }

  registerSelectionManager(selectionManager) {
    if (!this.selectionManagers.includes(selectionManager)) {
      this.selectionManagers.push(selectionManager);
      return this.start();
    }
  }

  unregisterSelectionManager(selectionManager) {
    this.selectionManagers = this.selectionManagers.filter(sm => sm !== selectionManager);

    if (this.selectionManagers.length === 0) {
      return this.stop();
    }
  }

  notifySelectionManagersOfSelectionChange() {
    return this.selectionManagers.map(selectionManager => selectionManager.selectionDidChange());
  }

  update() {
    this.notifySelectionManagersOfSelectionChange();
  }

  reset() {
    this.update();
  }

}
const selectionChangeObserver = new SelectionChangeObserver();
const getDOMSelection = function () {
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    return selection;
  }
};
const getDOMRange = function () {
  var _getDOMSelection;

  const domRange = (_getDOMSelection = getDOMSelection()) === null || _getDOMSelection === void 0 ? void 0 : _getDOMSelection.getRangeAt(0);

  if (domRange) {
    if (!domRangeIsPrivate(domRange)) {
      return domRange;
    }
  }
};
const setDOMRange = function (domRange) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(domRange);
  return selectionChangeObserver.update();
}; // In Firefox, clicking certain <input> elements changes the selection to a
// private element used to draw its UI. Attempting to access properties of those
// elements throws an error.
// https://bugzilla.mozilla.org/show_bug.cgi?id=208427

const domRangeIsPrivate = domRange => nodeIsPrivate(domRange.startContainer) || nodeIsPrivate(domRange.endContainer);

const nodeIsPrivate = node => !Object.getPrototypeOf(node);

/* eslint-disable
    id-length,
    no-useless-escape,
*/
const normalizeSpaces = string => string.replace(new RegExp("".concat(ZERO_WIDTH_SPACE), "g"), "").replace(new RegExp("".concat(NON_BREAKING_SPACE), "g"), " ");
const normalizeNewlines = string => string.replace(/\r\n?/g, "\n");
const breakableWhitespacePattern = new RegExp("[^\\S".concat(NON_BREAKING_SPACE, "]"));
const squishBreakableWhitespace = string => string // Replace all breakable whitespace characters with a space
.replace(new RegExp("".concat(breakableWhitespacePattern.source), "g"), " ") // Replace two or more spaces with a single space
.replace(/\ {2,}/g, " ");
const summarizeStringChange = function (oldString, newString) {
  let added, removed;
  oldString = UTF16String.box(oldString);
  newString = UTF16String.box(newString);

  if (newString.length < oldString.length) {
    [removed, added] = utf16StringDifferences(oldString, newString);
  } else {
    [added, removed] = utf16StringDifferences(newString, oldString);
  }

  return {
    added,
    removed
  };
};

const utf16StringDifferences = function (a, b) {
  if (a.isEqualTo(b)) {
    return ["", ""];
  }

  const diffA = utf16StringDifference(a, b);
  const {
    length
  } = diffA.utf16String;
  let diffB;

  if (length) {
    const {
      offset
    } = diffA;
    const codepoints = a.codepoints.slice(0, offset).concat(a.codepoints.slice(offset + length));
    diffB = utf16StringDifference(b, UTF16String.fromCodepoints(codepoints));
  } else {
    diffB = utf16StringDifference(b, a);
  }

  return [diffA.utf16String.toString(), diffB.utf16String.toString()];
};

const utf16StringDifference = function (a, b) {
  let leftIndex = 0;
  let rightIndexA = a.length;
  let rightIndexB = b.length;

  while (leftIndex < rightIndexA && a.charAt(leftIndex).isEqualTo(b.charAt(leftIndex))) {
    leftIndex++;
  }

  while (rightIndexA > leftIndex + 1 && a.charAt(rightIndexA - 1).isEqualTo(b.charAt(rightIndexB - 1))) {
    rightIndexA--;
    rightIndexB--;
  }

  return {
    utf16String: a.slice(leftIndex, rightIndexA),
    offset: leftIndex
  };
};

class Hash extends RicoObject {
  static fromCommonAttributesOfObjects() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (!objects.length) {
      return new this();
    }

    let hash = box(objects[0]);
    let keys = hash.getKeys();
    objects.slice(1).forEach(object => {
      keys = hash.getKeysCommonToHash(box(object));
      hash = hash.slice(keys);
    });
    return hash;
  }

  static box(values) {
    return box(values);
  }

  constructor() {
    let values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(...arguments);
    this.values = copy(values);
  }

  add(key, value) {
    return this.merge(object(key, value));
  }

  remove(key) {
    return new Hash(copy(this.values, key));
  }

  get(key) {
    return this.values[key];
  }

  has(key) {
    return key in this.values;
  }

  merge(values) {
    return new Hash(merge(this.values, unbox(values)));
  }

  slice(keys) {
    const values = {};
    Array.from(keys).forEach(key => {
      if (this.has(key)) {
        values[key] = this.values[key];
      }
    });
    return new Hash(values);
  }

  getKeys() {
    return Object.keys(this.values);
  }

  getKeysCommonToHash(hash) {
    hash = box(hash);
    return this.getKeys().filter(key => this.values[key] === hash.values[key]);
  }

  isEqualTo(values) {
    return arraysAreEqual(this.toArray(), box(values).toArray());
  }

  isEmpty() {
    return this.getKeys().length === 0;
  }

  toArray() {
    if (!this.array) {
      const result = [];

      for (const key in this.values) {
        const value = this.values[key];
        result.push(result.push(key, value));
      }

      this.array = result.slice(0);
    }

    return this.array;
  }

  toObject() {
    return copy(this.values);
  }

  toJSON() {
    return this.toObject();
  }

  contentsForInspection() {
    return {
      values: JSON.stringify(this.values)
    };
  }

}

const object = function (key, value) {
  const result = {};
  result[key] = value;
  return result;
};

const merge = function (object, values) {
  const result = copy(object);

  for (const key in values) {
    const value = values[key];
    result[key] = value;
  }

  return result;
};

const copy = function (object, keyToRemove) {
  const result = {};
  const sortedKeys = Object.keys(object).sort();
  sortedKeys.forEach(key => {
    if (key !== keyToRemove) {
      result[key] = object[key];
    }
  });
  return result;
};

const box = function (object) {
  if (object instanceof Hash) {
    return object;
  } else {
    return new Hash(object);
  }
};

const unbox = function (object) {
  if (object instanceof Hash) {
    return object.values;
  } else {
    return object;
  }
};

class ObjectGroup {
  static groupObjects() {
    let ungroupedObjects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let {
      depth,
      asTree
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let group;

    if (asTree) {
      if (depth == null) {
        depth = 0;
      }
    }

    const objects = [];
    Array.from(ungroupedObjects).forEach(object => {
      var _object$canBeGrouped2;

      if (group) {
        var _object$canBeGrouped, _group$canBeGroupedWi, _group;

        if ((_object$canBeGrouped = object.canBeGrouped) !== null && _object$canBeGrouped !== void 0 && _object$canBeGrouped.call(object, depth) && (_group$canBeGroupedWi = (_group = group[group.length - 1]).canBeGroupedWith) !== null && _group$canBeGroupedWi !== void 0 && _group$canBeGroupedWi.call(_group, object, depth)) {
          group.push(object);
          return;
        } else {
          objects.push(new this(group, {
            depth,
            asTree
          }));
          group = null;
        }
      }

      if ((_object$canBeGrouped2 = object.canBeGrouped) !== null && _object$canBeGrouped2 !== void 0 && _object$canBeGrouped2.call(object, depth)) {
        group = [object];
      } else {
        objects.push(object);
      }
    });

    if (group) {
      objects.push(new this(group, {
        depth,
        asTree
      }));
    }

    return objects;
  }

  constructor() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let {
      depth,
      asTree
    } = arguments.length > 1 ? arguments[1] : undefined;
    this.objects = objects;

    if (asTree) {
      this.depth = depth;
      this.objects = this.constructor.groupObjects(this.objects, {
        asTree,
        depth: this.depth + 1
      });
    }
  }

  getObjects() {
    return this.objects;
  }

  getDepth() {
    return this.depth;
  }

  getCacheKey() {
    const keys = ["objectGroup"];
    Array.from(this.getObjects()).forEach(object => {
      keys.push(object.getCacheKey());
    });
    return keys.join("/");
  }

}

class ObjectMap extends BasicObject {
  constructor() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);
    this.objects = {};
    Array.from(objects).forEach(object => {
      const hash = JSON.stringify(object);

      if (this.objects[hash] == null) {
        this.objects[hash] = object;
      }
    });
  }

  find(object) {
    const hash = JSON.stringify(object);
    return this.objects[hash];
  }

}

class ElementStore {
  constructor(elements) {
    this.reset(elements);
  }

  add(element) {
    const key = getKey(element);
    this.elements[key] = element;
  }

  remove(element) {
    const key = getKey(element);
    const value = this.elements[key];

    if (value) {
      delete this.elements[key];
      return value;
    }
  }

  reset() {
    let elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    this.elements = {};
    Array.from(elements).forEach(element => {
      this.add(element);
    });
    return elements;
  }

}

const getKey = element => element.dataset.ricoStoreKey;

class Operation extends BasicObject {
  isPerforming() {
    return this.performing === true;
  }

  hasPerformed() {
    return this.performed === true;
  }

  hasSucceeded() {
    return this.performed && this.succeeded;
  }

  hasFailed() {
    return this.performed && !this.succeeded;
  }

  getPromise() {
    if (!this.promise) {
      this.promise = new Promise((resolve, reject) => {
        this.performing = true;
        return this.perform((succeeded, result) => {
          this.succeeded = succeeded;
          this.performing = false;
          this.performed = true;

          if (this.succeeded) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });
    }

    return this.promise;
  }

  perform(callback) {
    return callback(false);
  }

  release() {
    var _this$promise, _this$promise$cancel;

    (_this$promise = this.promise) === null || _this$promise === void 0 ? void 0 : (_this$promise$cancel = _this$promise.cancel) === null || _this$promise$cancel === void 0 ? void 0 : _this$promise$cancel.call(_this$promise);
    this.promise = null;
    this.performing = null;
    this.performed = null;
    this.succeeded = null;
  }

}
Operation.proxyMethod("getPromise().then");
Operation.proxyMethod("getPromise().catch");

class ObjectView extends BasicObject {
  constructor(object) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(...arguments);
    this.object = object;
    this.options = options;
    this.childViews = [];
    this.rootView = this;
  }

  getNodes() {
    if (!this.nodes) {
      this.nodes = this.createNodes();
    }

    return this.nodes.map(node => node.cloneNode(true));
  }

  invalidate() {
    var _this$parentView;

    this.nodes = null;
    this.childViews = [];
    return (_this$parentView = this.parentView) === null || _this$parentView === void 0 ? void 0 : _this$parentView.invalidate();
  }

  invalidateViewForObject(object) {
    var _this$findViewForObje;

    return (_this$findViewForObje = this.findViewForObject(object)) === null || _this$findViewForObje === void 0 ? void 0 : _this$findViewForObje.invalidate();
  }

  findOrCreateCachedChildView(viewClass, object, options) {
    let view = this.getCachedViewForObject(object);

    if (view) {
      this.recordChildView(view);
    } else {
      view = this.createChildView(...arguments);
      this.cacheViewForObject(view, object);
    }

    return view;
  }

  createChildView(viewClass, object) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (object instanceof ObjectGroup) {
      options.viewClass = viewClass;
      viewClass = ObjectGroupView;
    }

    const view = new viewClass(object, options);
    return this.recordChildView(view);
  }

  recordChildView(view) {
    view.parentView = this;
    view.rootView = this.rootView;
    this.childViews.push(view);
    return view;
  }

  getAllChildViews() {
    let views = [];
    this.childViews.forEach(childView => {
      views.push(childView);
      views = views.concat(childView.getAllChildViews());
    });
    return views;
  }

  findElement() {
    return this.findElementForObject(this.object);
  }

  findElementForObject(object) {
    const id = object === null || object === void 0 ? void 0 : object.id;

    if (id) {
      return this.rootView.element.querySelector("[data-rico-id='".concat(id, "']"));
    }
  }

  findViewForObject(object) {
    for (const view of this.getAllChildViews()) {
      if (view.object === object) {
        return view;
      }
    }
  }

  getViewCache() {
    if (this.rootView === this) {
      if (this.isViewCachingEnabled()) {
        if (!this.viewCache) {
          this.viewCache = {};
        }

        return this.viewCache;
      }
    } else {
      return this.rootView.getViewCache();
    }
  }

  isViewCachingEnabled() {
    return this.shouldCacheViews !== false;
  }

  enableViewCaching() {
    this.shouldCacheViews = true;
  }

  disableViewCaching() {
    this.shouldCacheViews = false;
  }

  getCachedViewForObject(object) {
    var _this$getViewCache;

    return (_this$getViewCache = this.getViewCache()) === null || _this$getViewCache === void 0 ? void 0 : _this$getViewCache[object.getCacheKey()];
  }

  cacheViewForObject(view, object) {
    const cache = this.getViewCache();

    if (cache) {
      cache[object.getCacheKey()] = view;
    }
  }

  garbageCollectCachedViews() {
    const cache = this.getViewCache();

    if (cache) {
      const views = this.getAllChildViews().concat(this);
      const objectKeys = views.map(view => view.object.getCacheKey());

      for (const key in cache) {
        if (!objectKeys.includes(key)) {
          delete cache[key];
        }
      }
    }
  }

}
class ObjectGroupView extends ObjectView {
  constructor() {
    super(...arguments);
    this.objectGroup = this.object;
    this.viewClass = this.options.viewClass;
    delete this.options.viewClass;
  }

  getChildViews() {
    if (!this.childViews.length) {
      Array.from(this.objectGroup.getObjects()).forEach(object => {
        this.findOrCreateCachedChildView(this.viewClass, object, this.options);
      });
    }

    return this.childViews;
  }

  createNodes() {
    const element = this.createContainerElement();
    this.getChildViews().forEach(view => {
      Array.from(view.getNodes()).forEach(node => {
        element.appendChild(node);
      });
    });
    return [element];
  }

  createContainerElement() {
    let depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.objectGroup.getDepth();
    return this.getChildViews()[0].createContainerElement(depth);
  }

}

/* eslint-disable
    no-useless-escape,
    no-var,
*/
class PieceView extends ObjectView {
  constructor() {
    super(...arguments);
    this.piece = this.object;
    this.attributes = this.piece.getAttributes();
    this.textConfig = this.options.textConfig;
    this.context = this.options.context;
    this.string = this.piece.toString();
  }

  createNodes() {
    let nodes = this.createStringNodes();
    const element = this.createElement();

    if (element) {
      const innerElement = findInnerElement(element);
      Array.from(nodes).forEach(node => {
        innerElement.appendChild(node);
      });
      nodes = [element];
    }

    return nodes;
  }

  createStringNodes() {
    var _this$textConfig;

    if ((_this$textConfig = this.textConfig) !== null && _this$textConfig !== void 0 && _this$textConfig.plaintext) {
      return [document.createTextNode(this.string)];
    } else {
      const nodes = [];
      const iterable = this.string.split("\n");

      for (let index = 0; index < iterable.length; index++) {
        const substring = iterable[index];

        if (index > 0) {
          const element = makeElement("br");
          nodes.push(element);
        }

        if (substring.length) {
          const node = document.createTextNode(this.preserveSpaces(substring));
          nodes.push(node);
        }
      }

      return nodes;
    }
  }

  createElement() {
    let element, key, value;
    const styles = {};

    for (key in this.attributes) {
      value = this.attributes[key];
      const config = getTextConfig(key);

      if (config) {
        if (config.tagName) {
          var innerElement;
          const pendingElement = makeElement(config.tagName);

          if (innerElement) {
            innerElement.appendChild(pendingElement);
            innerElement = pendingElement;
          } else {
            element = innerElement = pendingElement;
          }
        }

        if (config.styleProperty) {
          styles[config.styleProperty] = value;
        }

        if (config.style) {
          for (key in config.style) {
            value = config.style[key];
            styles[key] = value;
          }
        }
      }
    }

    if (Object.keys(styles).length) {
      if (!element) {
        element = makeElement("span");
      }

      for (key in styles) {
        value = styles[key];
        element.style[key] = value;
      }
    }

    return element;
  }

  createContainerElement() {
    for (const key in this.attributes) {
      const value = this.attributes[key];
      const config = getTextConfig(key);

      if (config) {
        if (config.groupTagName) {
          const attributes = {};
          attributes[key] = value;
          return makeElement(config.groupTagName, attributes);
        }
      }
    }
  }

  preserveSpaces(string) {
    if (this.context.isLast) {
      string = string.replace(/\ $/, NON_BREAKING_SPACE);
    }

    string = string.replace(/(\S)\ {3}(\S)/g, "$1 ".concat(NON_BREAKING_SPACE, " $2")).replace(/\ {2}/g, "".concat(NON_BREAKING_SPACE, " ")).replace(/\ {2}/g, " ".concat(NON_BREAKING_SPACE));

    if (this.context.isFirst || this.context.followsWhitespace) {
      string = string.replace(/^\ /, NON_BREAKING_SPACE);
    }

    return string;
  }

}

/* eslint-disable
    no-var,
*/
class TextView extends ObjectView {
  constructor() {
    super(...arguments);
    this.text = this.object;
    this.textConfig = this.options.textConfig;
  }

  createNodes() {
    const nodes = [];
    const pieces = ObjectGroup.groupObjects(this.getPieces());
    const lastIndex = pieces.length - 1;

    for (let index = 0; index < pieces.length; index++) {
      const piece = pieces[index];
      const context = {};

      if (index === 0) {
        context.isFirst = true;
      }

      if (index === lastIndex) {
        context.isLast = true;
      }

      if (endsWithWhitespace(previousPiece)) {
        context.followsWhitespace = true;
      }

      const view = this.findOrCreateCachedChildView(PieceView, piece, {
        textConfig: this.textConfig,
        context
      });
      nodes.push(...Array.from(view.getNodes() || []));
      var previousPiece = piece;
    }

    return nodes;
  }

  getPieces() {
    return Array.from(this.text.getPieces()).filter(piece => !piece.hasAttribute("blockBreak"));
  }

}

const endsWithWhitespace = piece => /\s$/.test(piece === null || piece === void 0 ? void 0 : piece.toString());

class BlockView extends ObjectView {
  constructor() {
    super(...arguments);
    this.block = this.object;
    this.attributes = this.block.getAttributes();
  }

  createNodes() {
    const comment = document.createComment("block");
    const nodes = [comment];

    if (this.block.isEmpty()) {
      nodes.push(makeElement("br"));
    } else {
      var _getBlockConfig;

      const textConfig = (_getBlockConfig = getBlockConfig(this.block.getLastAttribute())) === null || _getBlockConfig === void 0 ? void 0 : _getBlockConfig.text;
      const textView = this.findOrCreateCachedChildView(TextView, this.block.text, {
        textConfig
      });
      nodes.push(...Array.from(textView.getNodes() || []));

      if (this.shouldAddExtraNewlineElement()) {
        nodes.push(makeElement("br"));
      }
    }

    if (this.attributes.length) {
      return nodes;
    } else {
      let attributes$1;
      const {
        tagName
      } = attributes.default;

      if (this.block.isRTL()) {
        attributes$1 = {
          dir: "rtl"
        };
      }

      const element = makeElement({
        tagName,
        attributes: attributes$1
      });
      nodes.forEach(node => element.appendChild(node));
      return [element];
    }
  }

  createContainerElement(depth) {
    const attributes = {};
    let className;
    const attributeName = this.attributes[depth];
    const {
      tagName,
      htmlAttributes = []
    } = getBlockConfig(attributeName);

    if (depth === 0 && this.block.isRTL()) {
      Object.assign(attributes, {
        dir: "rtl"
      });
    }

    Object.entries(this.block.htmlAttributes).forEach(_ref => {
      let [name, value] = _ref;

      if (htmlAttributes.includes(name)) {
        attributes[name] = value;
      }
    });
    return makeElement({
      tagName,
      className,
      attributes
    });
  } // A single <br> at the end of a block element has no visual representation
  // so add an extra one.


  shouldAddExtraNewlineElement() {
    return /\n\n$/.test(this.block.toString());
  }

}

class DocumentView extends ObjectView {
  static render(document) {
    const element = makeElement("div");
    const view = new this(document, {
      element
    });
    view.render();
    view.sync();
    return element;
  }

  constructor() {
    super(...arguments);
    this.element = this.options.element;
    this.elementStore = new ElementStore();
    this.setDocument(this.object);
  }

  setDocument(document) {
    if (!document.isEqualTo(this.document)) {
      this.document = this.object = document;
    }
  }

  render() {
    this.childViews = [];
    this.shadowElement = makeElement("div");

    if (!this.document.isEmpty()) {
      const objects = ObjectGroup.groupObjects(this.document.getBlocks(), {
        asTree: true
      });
      Array.from(objects).forEach(object => {
        const view = this.findOrCreateCachedChildView(BlockView, object);
        Array.from(view.getNodes()).map(node => this.shadowElement.appendChild(node));
      });
    }
  }

  isSynced() {
    return elementsHaveEqualHTML(this.shadowElement, this.element);
  }

  sync() {
    const fragment = this.createDocumentFragmentForSync();

    while (this.element.lastChild) {
      this.element.removeChild(this.element.lastChild);
    }

    this.element.appendChild(fragment);
    return this.didSync();
  } // Private


  didSync() {
    this.elementStore.reset(findStoredElements(this.element));
    return defer(() => this.garbageCollectCachedViews());
  }

  createDocumentFragmentForSync() {
    const fragment = document.createDocumentFragment();
    Array.from(this.shadowElement.childNodes).forEach(node => {
      fragment.appendChild(node.cloneNode(true));
    });
    Array.from(findStoredElements(fragment)).forEach(element => {
      const storedElement = this.elementStore.remove(element);

      if (storedElement) {
        element.parentNode.replaceChild(storedElement, element);
      }
    });
    return fragment;
  }

}

const findStoredElements = element => element.querySelectorAll("[data-rico-store-key]");

const elementsHaveEqualHTML = (element, otherElement) => ignoreSpaces(element.innerHTML) === ignoreSpaces(otherElement.innerHTML);

const ignoreSpaces = html => html.replace(/&nbsp;/g, " ");

function createMetadataMethodsForProperty(metadataMap, kind, property, decoratorFinishedRef) {
  return {
    getMetadata: function (key) {
      assertNotFinished(decoratorFinishedRef, "getMetadata"), assertMetadataKey(key);
      var metadataForKey = metadataMap[key];
      if (void 0 !== metadataForKey) if (1 === kind) {
        var pub = metadataForKey.public;
        if (void 0 !== pub) return pub[property];
      } else if (2 === kind) {
        var priv = metadataForKey.private;
        if (void 0 !== priv) return priv.get(property);
      } else if (Object.hasOwnProperty.call(metadataForKey, "constructor")) return metadataForKey.constructor;
    },
    setMetadata: function (key, value) {
      assertNotFinished(decoratorFinishedRef, "setMetadata"), assertMetadataKey(key);
      var metadataForKey = metadataMap[key];

      if (void 0 === metadataForKey && (metadataForKey = metadataMap[key] = {}), 1 === kind) {
        var pub = metadataForKey.public;
        void 0 === pub && (pub = metadataForKey.public = {}), pub[property] = value;
      } else if (2 === kind) {
        var priv = metadataForKey.priv;
        void 0 === priv && (priv = metadataForKey.private = new Map()), priv.set(property, value);
      } else metadataForKey.constructor = value;
    }
  };
}

function convertMetadataMapToFinal(obj, metadataMap) {
  var parentMetadataMap = obj[Symbol.metadata || Symbol.for("Symbol.metadata")],
      metadataKeys = Object.getOwnPropertySymbols(metadataMap);

  if (0 !== metadataKeys.length) {
    for (var i = 0; i < metadataKeys.length; i++) {
      var key = metadataKeys[i],
          metaForKey = metadataMap[key],
          parentMetaForKey = parentMetadataMap ? parentMetadataMap[key] : null,
          pub = metaForKey.public,
          parentPub = parentMetaForKey ? parentMetaForKey.public : null;
      pub && parentPub && Object.setPrototypeOf(pub, parentPub);
      var priv = metaForKey.private;

      if (priv) {
        var privArr = Array.from(priv.values()),
            parentPriv = parentMetaForKey ? parentMetaForKey.private : null;
        parentPriv && (privArr = privArr.concat(parentPriv)), metaForKey.private = privArr;
      }

      parentMetaForKey && Object.setPrototypeOf(metaForKey, parentMetaForKey);
    }

    parentMetadataMap && Object.setPrototypeOf(metadataMap, parentMetadataMap), obj[Symbol.metadata || Symbol.for("Symbol.metadata")] = metadataMap;
  }
}

function createAddInitializerMethod(initializers, decoratorFinishedRef) {
  return function (initializer) {
    assertNotFinished(decoratorFinishedRef, "addInitializer"), assertCallable(initializer, "An initializer"), initializers.push(initializer);
  };
}

function memberDec(dec, name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value) {
  var kindStr;

  switch (kind) {
    case 1:
      kindStr = "accessor";
      break;

    case 2:
      kindStr = "method";
      break;

    case 3:
      kindStr = "getter";
      break;

    case 4:
      kindStr = "setter";
      break;

    default:
      kindStr = "field";
  }

  var metadataKind,
      metadataName,
      ctx = {
    kind: kindStr,
    name: isPrivate ? "#" + name : name,
    isStatic: isStatic,
    isPrivate: isPrivate
  },
      decoratorFinishedRef = {
    v: !1
  };

  if (0 !== kind && (ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef)), isPrivate) {
    metadataKind = 2, metadataName = Symbol(name);
    var access = {};
    0 === kind ? (access.get = desc.get, access.set = desc.set) : 2 === kind ? access.get = function () {
      return desc.value;
    } : (1 !== kind && 3 !== kind || (access.get = function () {
      return desc.get.call(this);
    }), 1 !== kind && 4 !== kind || (access.set = function (v) {
      desc.set.call(this, v);
    })), ctx.access = access;
  } else metadataKind = 1, metadataName = name;

  try {
    return dec(value, Object.assign(ctx, createMetadataMethodsForProperty(metadataMap, metadataKind, metadataName, decoratorFinishedRef)));
  } finally {
    decoratorFinishedRef.v = !0;
  }
}

function assertNotFinished(decoratorFinishedRef, fnName) {
  if (decoratorFinishedRef.v) throw new Error("attempted to call " + fnName + " after decoration was finished");
}

function assertMetadataKey(key) {
  if ("symbol" != typeof key) throw new TypeError("Metadata keys must be symbols, received: " + key);
}

function assertCallable(fn, hint) {
  if ("function" != typeof fn) throw new TypeError(hint + " must be a function");
}

function assertValidReturnValue(kind, value) {
  var type = typeof value;

  if (1 === kind) {
    if ("object" !== type || null === value) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
    void 0 !== value.get && assertCallable(value.get, "accessor.get"), void 0 !== value.set && assertCallable(value.set, "accessor.set"), void 0 !== value.init && assertCallable(value.init, "accessor.init"), void 0 !== value.initializer && assertCallable(value.initializer, "accessor.initializer");
  } else if ("function" !== type) {
    var hint;
    throw hint = 0 === kind ? "field" : 10 === kind ? "class" : "method", new TypeError(hint + " decorators must return a function or void 0");
  }
}

function getInit(desc) {
  var initializer;
  return null == (initializer = desc.init) && (initializer = desc.initializer) && "undefined" != typeof console && console.warn(".initializer has been renamed to .init as of March 2022"), initializer;
}

function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, metadataMap, initializers) {
  var desc,
      initializer,
      value,
      newValue,
      get,
      set,
      decs = decInfo[0];
  if (isPrivate ? desc = 0 === kind || 1 === kind ? {
    get: decInfo[3],
    set: decInfo[4]
  } : 3 === kind ? {
    get: decInfo[3]
  } : 4 === kind ? {
    set: decInfo[3]
  } : {
    value: decInfo[3]
  } : 0 !== kind && (desc = Object.getOwnPropertyDescriptor(base, name)), 1 === kind ? value = {
    get: desc.get,
    set: desc.set
  } : 2 === kind ? value = desc.value : 3 === kind ? value = desc.get : 4 === kind && (value = desc.set), "function" == typeof decs) void 0 !== (newValue = memberDec(decs, name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value)) && (assertValidReturnValue(kind, newValue), 0 === kind ? initializer = newValue : 1 === kind ? (initializer = getInit(newValue), get = newValue.get || value.get, set = newValue.set || value.set, value = {
    get: get,
    set: set
  }) : value = newValue);else for (var i = decs.length - 1; i >= 0; i--) {
    var newInit;
    if (void 0 !== (newValue = memberDec(decs[i], name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value))) assertValidReturnValue(kind, newValue), 0 === kind ? newInit = newValue : 1 === kind ? (newInit = getInit(newValue), get = newValue.get || value.get, set = newValue.set || value.set, value = {
      get: get,
      set: set
    }) : value = newValue, void 0 !== newInit && (void 0 === initializer ? initializer = newInit : "function" == typeof initializer ? initializer = [initializer, newInit] : initializer.push(newInit));
  }

  if (0 === kind || 1 === kind) {
    if (void 0 === initializer) initializer = function (instance, init) {
      return init;
    };else if ("function" != typeof initializer) {
      var ownInitializers = initializer;

      initializer = function (instance, init) {
        for (var value = init, i = 0; i < ownInitializers.length; i++) value = ownInitializers[i].call(instance, value);

        return value;
      };
    } else {
      var originalInitializer = initializer;

      initializer = function (instance, init) {
        return originalInitializer.call(instance, init);
      };
    }
    ret.push(initializer);
  }

  0 !== kind && (1 === kind ? (desc.get = value.get, desc.set = value.set) : 2 === kind ? desc.value = value : 3 === kind ? desc.get = value : 4 === kind && (desc.set = value), isPrivate ? 1 === kind ? (ret.push(function (instance, args) {
    return value.get.call(instance, args);
  }), ret.push(function (instance, args) {
    return value.set.call(instance, args);
  })) : 2 === kind ? ret.push(value) : ret.push(function (instance, args) {
    return value.call(instance, args);
  }) : Object.defineProperty(base, name, desc));
}

function applyMemberDecs(ret, Class, protoMetadataMap, staticMetadataMap, decInfos) {
  for (var protoInitializers, staticInitializers, existingProtoNonFields = new Map(), existingStaticNonFields = new Map(), i = 0; i < decInfos.length; i++) {
    var decInfo = decInfos[i];

    if (Array.isArray(decInfo)) {
      var base,
          metadataMap,
          initializers,
          kind = decInfo[1],
          name = decInfo[2],
          isPrivate = decInfo.length > 3,
          isStatic = kind >= 5;

      if (isStatic ? (base = Class, metadataMap = staticMetadataMap, 0 !== (kind -= 5) && (initializers = staticInitializers = staticInitializers || [])) : (base = Class.prototype, metadataMap = protoMetadataMap, 0 !== kind && (initializers = protoInitializers = protoInitializers || [])), 0 !== kind && !isPrivate) {
        var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields,
            existingKind = existingNonFields.get(name) || 0;
        if (!0 === existingKind || 3 === existingKind && 4 !== kind || 4 === existingKind && 3 !== kind) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
        !existingKind && kind > 2 ? existingNonFields.set(name, kind) : existingNonFields.set(name, !0);
      }

      applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, metadataMap, initializers);
    }
  }

  pushInitializers(ret, protoInitializers), pushInitializers(ret, staticInitializers);
}

function pushInitializers(ret, initializers) {
  initializers && ret.push(function (instance) {
    for (var i = 0; i < initializers.length; i++) initializers[i].call(instance);

    return instance;
  });
}

function applyClassDecs(ret, targetClass, metadataMap, classDecs) {
  if (classDecs.length > 0) {
    for (var initializers = [], newClass = targetClass, name = targetClass.name, i = classDecs.length - 1; i >= 0; i--) {
      var decoratorFinishedRef = {
        v: !1
      };

      try {
        var ctx = Object.assign({
          kind: "class",
          name: name,
          addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef)
        }, createMetadataMethodsForProperty(metadataMap, 0, name, decoratorFinishedRef)),
            nextNewClass = classDecs[i](newClass, ctx);
      } finally {
        decoratorFinishedRef.v = !0;
      }

      void 0 !== nextNewClass && (assertValidReturnValue(10, nextNewClass), newClass = nextNewClass);
    }

    ret.push(newClass, function () {
      for (var i = 0; i < initializers.length; i++) initializers[i].call(newClass);
    });
  }
}

function _applyDecs(targetClass, memberDecs, classDecs) {
  var ret = [],
      staticMetadataMap = {},
      protoMetadataMap = {};
  return applyMemberDecs(ret, targetClass, protoMetadataMap, staticMetadataMap, memberDecs), convertMetadataMapToFinal(targetClass.prototype, protoMetadataMap), applyClassDecs(ret, targetClass, staticMetadataMap, classDecs), convertMetadataMapToFinal(targetClass, staticMetadataMap), ret;
}

function _asyncIterator(iterable) {
  var method,
      async,
      sync,
      retry = 2;

  for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) {
    if (async && null != (method = iterable[async])) return method.call(iterable);
    if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
    async = "@@asyncIterator", sync = "@@iterator";
  }

  throw new TypeError("Object is not async iterable");
}

function AsyncFromSyncIterator(s) {
  function AsyncFromSyncIteratorContinuation(r) {
    if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
    var done = r.done;
    return Promise.resolve(r.value).then(function (value) {
      return {
        value: value,
        done: done
      };
    });
  }

  return AsyncFromSyncIterator = function (s) {
    this.s = s, this.n = s.next;
  }, AsyncFromSyncIterator.prototype = {
    s: null,
    n: null,
    next: function () {
      return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
    },
    return: function (value) {
      var ret = this.s.return;
      return void 0 === ret ? Promise.resolve({
        value: value,
        done: !0
      }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
    },
    throw: function (value) {
      var thr = this.s.return;
      return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
    }
  }, new AsyncFromSyncIterator(s);
}

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) {
  REACT_ELEMENT_TYPE || (REACT_ELEMENT_TYPE = "function" == typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103);
  var defaultProps = type && type.defaultProps,
      childrenLength = arguments.length - 3;
  if (props || 0 === childrenLength || (props = {
    children: void 0
  }), 1 === childrenLength) props.children = children;else if (childrenLength > 1) {
    for (var childArray = new Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 3];

    props.children = childArray;
  }
  if (props && defaultProps) for (var propName in defaultProps) void 0 === props[propName] && (props[propName] = defaultProps[propName]);else props || (props = defaultProps || {});
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: void 0 === key ? null : "" + key,
    ref: null,
    props: props,
    _owner: null
  };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _wrapRegExp() {
  _wrapRegExp = function (re, groups) {
    return new BabelRegExp(re, void 0, groups);
  };

  var _super = RegExp.prototype,
      _groups = new WeakMap();

  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);

    return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);
  }

  function buildGroups(result, re) {
    var g = _groups.get(re);

    return Object.keys(g).reduce(function (groups, name) {
      return groups[name] = result[g[name]], groups;
    }, Object.create(null));
  }

  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);

    return result && (result.groups = buildGroups(result, this)), result;
  }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
    if ("string" == typeof substitution) {
      var groups = _groups.get(this);

      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        return "$" + groups[name];
      }));
    }

    if ("function" == typeof substitution) {
      var _this = this;

      return _super[Symbol.replace].call(this, str, function () {
        var args = arguments;
        return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);
      });
    }

    return _super[Symbol.replace].call(this, str, substitution);
  }, _wrapRegExp.apply(this, arguments);
}

function _AwaitValue(value) {
  this.wrapped = value;
}

function _AsyncGenerator(gen) {
  var front, back;

  function send(key, arg) {
    return new Promise(function (resolve, reject) {
      var request = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null
      };

      if (back) {
        back = back.next = request;
      } else {
        front = back = request;
        resume(key, arg);
      }
    });
  }

  function resume(key, arg) {
    try {
      var result = gen[key](arg);
      var value = result.value;
      var wrappedAwait = value instanceof _AwaitValue;
      Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
        if (wrappedAwait) {
          resume(key === "return" ? "return" : "next", arg);
          return;
        }

        settle(result.done ? "return" : "normal", arg);
      }, function (err) {
        resume("throw", err);
      });
    } catch (err) {
      settle("throw", err);
    }
  }

  function settle(type, value) {
    switch (type) {
      case "return":
        front.resolve({
          value: value,
          done: true
        });
        break;

      case "throw":
        front.reject(value);
        break;

      default:
        front.resolve({
          value: value,
          done: false
        });
        break;
    }

    front = front.next;

    if (front) {
      resume(front.key, front.arg);
    } else {
      back = null;
    }
  }

  this._invoke = send;

  if (typeof gen.return !== "function") {
    this.return = undefined;
  }
}

_AsyncGenerator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function () {
  return this;
};

_AsyncGenerator.prototype.next = function (arg) {
  return this._invoke("next", arg);
};

_AsyncGenerator.prototype.throw = function (arg) {
  return this._invoke("throw", arg);
};

_AsyncGenerator.prototype.return = function (arg) {
  return this._invoke("return", arg);
};

function _wrapAsyncGenerator(fn) {
  return function () {
    return new _AsyncGenerator(fn.apply(this, arguments));
  };
}

function _awaitAsyncGenerator(value) {
  return new _AwaitValue(value);
}

function _asyncGeneratorDelegate(inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve) {
      resolve(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  ;

  iter[typeof Symbol !== "undefined" && Symbol.iterator || "@@iterator"] = function () {
    return this;
  };

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      if (waiting) {
        waiting = false;
        return value;
      }

      return pump("return", value);
    };
  }

  return iter;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _defineEnumerableProperties(obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  if (Object.getOwnPropertySymbols) {
    var objectSymbols = Object.getOwnPropertySymbols(descs);

    for (var i = 0; i < objectSymbols.length; i++) {
      var sym = objectSymbols[i];
      var desc = descs[sym];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, sym, desc);
    }
  }

  return obj;
}

function _defaults(obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
}

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }

      return desc.value;
    };
  }

  return _get.apply(this, arguments);
}

function set(target, property, value, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.set) {
    set = Reflect.set;
  } else {
    set = function set(target, property, value, receiver) {
      var base = _superPropBase(target, property);

      var desc;

      if (base) {
        desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.set) {
          desc.set.call(receiver, value);
          return true;
        } else if (!desc.writable) {
          return false;
        }
      }

      desc = Object.getOwnPropertyDescriptor(receiver, property);

      if (desc) {
        if (!desc.writable) {
          return false;
        }

        desc.value = value;
        Object.defineProperty(receiver, property, desc);
      } else {
        _defineProperty(receiver, property, value);
      }

      return true;
    };
  }

  return set(target, property, value, receiver);
}

function _set(target, property, value, receiver, isStrict) {
  var s = set(target, property, value, receiver || target);

  if (!s && isStrict) {
    throw new Error('failed to set property');
  }

  return value;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}

function _writeOnlyError(name) {
  throw new TypeError("\"" + name + "\" is write-only");
}

function _classNameTDZError(name) {
  throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
}

function _temporalUndefined() {}

function _tdz(name) {
  throw new ReferenceError(name + " is not defined - temporal dead zone");
}

function _temporalRef(val, name) {
  return val === _temporalUndefined ? _tdz(name) : val;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _slicedToArrayLoose(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimitLoose(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _maybeArrayLike(next, arr, i) {
  if (arr && !Array.isArray(arr) && typeof arr.length === "number") {
    var len = arr.length;
    return _arrayLikeToArray(arr, i !== void 0 && i < len ? i : len);
  }

  return next(arr, i);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _iterableToArrayLimitLoose(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];

  for (_i = _i.call(arr), _step; !(_step = _i.next()).done;) {
    _arr.push(_step.value);

    if (i && _arr.length === i) break;
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _skipFirstGeneratorNext(fn) {
  return function () {
    var it = fn.apply(this, arguments);
    it.next();
    return it;
  };
}

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];

  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }

  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");

  return typeof key === "symbol" ? key : String(key);
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.');
}

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }

  return desc;
}

var id$1 = 0;

function _classPrivateFieldLooseKey(name) {
  return "__private_" + id$1++ + "_" + name;
}

function _classPrivateFieldLooseBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }

  return receiver;
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
}

function _classPrivateFieldDestructureSet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  return _classApplyDescriptorDestructureSet(receiver, descriptor);
}

function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }

  return privateMap.get(receiver);
}

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  _classCheckPrivateStaticFieldDescriptor(descriptor, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  _classCheckPrivateStaticFieldDescriptor(descriptor, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
}

function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  return method;
}

function _classStaticPrivateMethodSet() {
  throw new TypeError("attempted to set read only static private field");
}

function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }
}

function _classApplyDescriptorDestructureSet(receiver, descriptor) {
  if (descriptor.set) {
    if (!("__destrObj" in descriptor)) {
      descriptor.__destrObj = {
        set value(v) {
          descriptor.set.call(receiver, v);
        }

      };
    }

    return descriptor.__destrObj;
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    return descriptor;
  }
}

function _classStaticPrivateFieldDestructureSet(receiver, classConstructor, descriptor) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  _classCheckPrivateStaticFieldDescriptor(descriptor, "set");

  return _classApplyDescriptorDestructureSet(receiver, descriptor);
}

function _classCheckPrivateStaticAccess(receiver, classConstructor) {
  if (receiver !== classConstructor) {
    throw new TypeError("Private static access of wrong provenance");
  }
}

function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
  if (descriptor === undefined) {
    throw new TypeError("attempted to " + action + " private static field before its declaration");
  }
}

function _decorate(decorators, factory, superClass, mixins) {
  var api = _getDecoratorsApi();

  if (mixins) {
    for (var i = 0; i < mixins.length; i++) {
      api = mixins[i](api);
    }
  }

  var r = factory(function initialize(O) {
    api.initializeInstanceElements(O, decorated.elements);
  }, superClass);
  var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
  api.initializeClassElements(r.F, decorated.elements);
  return api.runClassFinishers(r.F, decorated.finishers);
}

function _getDecoratorsApi() {
  _getDecoratorsApi = function () {
    return api;
  };

  var api = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (O, elements) {
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          if (element.kind === kind && element.placement === "own") {
            this.defineClassElement(O, element);
          }
        }, this);
      }, this);
    },
    initializeClassElements: function (F, elements) {
      var proto = F.prototype;
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          var placement = element.placement;

          if (element.kind === kind && (placement === "static" || placement === "prototype")) {
            var receiver = placement === "static" ? F : proto;
            this.defineClassElement(receiver, element);
          }
        }, this);
      }, this);
    },
    defineClassElement: function (receiver, element) {
      var descriptor = element.descriptor;

      if (element.kind === "field") {
        var initializer = element.initializer;
        descriptor = {
          enumerable: descriptor.enumerable,
          writable: descriptor.writable,
          configurable: descriptor.configurable,
          value: initializer === void 0 ? void 0 : initializer.call(receiver)
        };
      }

      Object.defineProperty(receiver, element.key, descriptor);
    },
    decorateClass: function (elements, decorators) {
      var newElements = [];
      var finishers = [];
      var placements = {
        static: [],
        prototype: [],
        own: []
      };
      elements.forEach(function (element) {
        this.addElementPlacement(element, placements);
      }, this);
      elements.forEach(function (element) {
        if (!_hasDecorators(element)) return newElements.push(element);
        var elementFinishersExtras = this.decorateElement(element, placements);
        newElements.push(elementFinishersExtras.element);
        newElements.push.apply(newElements, elementFinishersExtras.extras);
        finishers.push.apply(finishers, elementFinishersExtras.finishers);
      }, this);

      if (!decorators) {
        return {
          elements: newElements,
          finishers: finishers
        };
      }

      var result = this.decorateConstructor(newElements, decorators);
      finishers.push.apply(finishers, result.finishers);
      result.finishers = finishers;
      return result;
    },
    addElementPlacement: function (element, placements, silent) {
      var keys = placements[element.placement];

      if (!silent && keys.indexOf(element.key) !== -1) {
        throw new TypeError("Duplicated element (" + element.key + ")");
      }

      keys.push(element.key);
    },
    decorateElement: function (element, placements) {
      var extras = [];
      var finishers = [];

      for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
        var keys = placements[element.placement];
        keys.splice(keys.indexOf(element.key), 1);
        var elementObject = this.fromElementDescriptor(element);
        var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
        element = elementFinisherExtras.element;
        this.addElementPlacement(element, placements);

        if (elementFinisherExtras.finisher) {
          finishers.push(elementFinisherExtras.finisher);
        }

        var newExtras = elementFinisherExtras.extras;

        if (newExtras) {
          for (var j = 0; j < newExtras.length; j++) {
            this.addElementPlacement(newExtras[j], placements);
          }

          extras.push.apply(extras, newExtras);
        }
      }

      return {
        element: element,
        finishers: finishers,
        extras: extras
      };
    },
    decorateConstructor: function (elements, decorators) {
      var finishers = [];

      for (var i = decorators.length - 1; i >= 0; i--) {
        var obj = this.fromClassDescriptor(elements);
        var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);

        if (elementsAndFinisher.finisher !== undefined) {
          finishers.push(elementsAndFinisher.finisher);
        }

        if (elementsAndFinisher.elements !== undefined) {
          elements = elementsAndFinisher.elements;

          for (var j = 0; j < elements.length - 1; j++) {
            for (var k = j + 1; k < elements.length; k++) {
              if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                throw new TypeError("Duplicated element (" + elements[j].key + ")");
              }
            }
          }
        }
      }

      return {
        elements: elements,
        finishers: finishers
      };
    },
    fromElementDescriptor: function (element) {
      var obj = {
        kind: element.kind,
        key: element.key,
        placement: element.placement,
        descriptor: element.descriptor
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      if (element.kind === "field") obj.initializer = element.initializer;
      return obj;
    },
    toElementDescriptors: function (elementObjects) {
      if (elementObjects === undefined) return;
      return _toArray(elementObjects).map(function (elementObject) {
        var element = this.toElementDescriptor(elementObject);
        this.disallowProperty(elementObject, "finisher", "An element descriptor");
        this.disallowProperty(elementObject, "extras", "An element descriptor");
        return element;
      }, this);
    },
    toElementDescriptor: function (elementObject) {
      var kind = String(elementObject.kind);

      if (kind !== "method" && kind !== "field") {
        throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
      }

      var key = _toPropertyKey(elementObject.key);

      var placement = String(elementObject.placement);

      if (placement !== "static" && placement !== "prototype" && placement !== "own") {
        throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
      }

      var descriptor = elementObject.descriptor;
      this.disallowProperty(elementObject, "elements", "An element descriptor");
      var element = {
        kind: kind,
        key: key,
        placement: placement,
        descriptor: Object.assign({}, descriptor)
      };

      if (kind !== "field") {
        this.disallowProperty(elementObject, "initializer", "A method descriptor");
      } else {
        this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
        element.initializer = elementObject.initializer;
      }

      return element;
    },
    toElementFinisherExtras: function (elementObject) {
      var element = this.toElementDescriptor(elementObject);

      var finisher = _optionalCallableProperty(elementObject, "finisher");

      var extras = this.toElementDescriptors(elementObject.extras);
      return {
        element: element,
        finisher: finisher,
        extras: extras
      };
    },
    fromClassDescriptor: function (elements) {
      var obj = {
        kind: "class",
        elements: elements.map(this.fromElementDescriptor, this)
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      return obj;
    },
    toClassDescriptor: function (obj) {
      var kind = String(obj.kind);

      if (kind !== "class") {
        throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
      }

      this.disallowProperty(obj, "key", "A class descriptor");
      this.disallowProperty(obj, "placement", "A class descriptor");
      this.disallowProperty(obj, "descriptor", "A class descriptor");
      this.disallowProperty(obj, "initializer", "A class descriptor");
      this.disallowProperty(obj, "extras", "A class descriptor");

      var finisher = _optionalCallableProperty(obj, "finisher");

      var elements = this.toElementDescriptors(obj.elements);
      return {
        elements: elements,
        finisher: finisher
      };
    },
    runClassFinishers: function (constructor, finishers) {
      for (var i = 0; i < finishers.length; i++) {
        var newConstructor = (0, finishers[i])(constructor);

        if (newConstructor !== undefined) {
          if (typeof newConstructor !== "function") {
            throw new TypeError("Finishers must return a constructor.");
          }

          constructor = newConstructor;
        }
      }

      return constructor;
    },
    disallowProperty: function (obj, name, objectType) {
      if (obj[name] !== undefined) {
        throw new TypeError(objectType + " can't have a ." + name + " property.");
      }
    }
  };
  return api;
}

function _createElementDescriptor(def) {
  var key = _toPropertyKey(def.key);

  var descriptor;

  if (def.kind === "method") {
    descriptor = {
      value: def.value,
      writable: true,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "get") {
    descriptor = {
      get: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "set") {
    descriptor = {
      set: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "field") {
    descriptor = {
      configurable: true,
      writable: true,
      enumerable: true
    };
  }

  var element = {
    kind: def.kind === "field" ? "field" : "method",
    key: key,
    placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
    descriptor: descriptor
  };
  if (def.decorators) element.decorators = def.decorators;
  if (def.kind === "field") element.initializer = def.value;
  return element;
}

function _coalesceGetterSetter(element, other) {
  if (element.descriptor.get !== undefined) {
    other.descriptor.get = element.descriptor.get;
  } else {
    other.descriptor.set = element.descriptor.set;
  }
}

function _coalesceClassElements(elements) {
  var newElements = [];

  var isSameElement = function (other) {
    return other.kind === "method" && other.key === element.key && other.placement === element.placement;
  };

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var other;

    if (element.kind === "method" && (other = newElements.find(isSameElement))) {
      if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
        if (_hasDecorators(element) || _hasDecorators(other)) {
          throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
        }

        other.descriptor = element.descriptor;
      } else {
        if (_hasDecorators(element)) {
          if (_hasDecorators(other)) {
            throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
          }

          other.decorators = element.decorators;
        }

        _coalesceGetterSetter(element, other);
      }
    } else {
      newElements.push(element);
    }
  }

  return newElements;
}

function _hasDecorators(element) {
  return element.decorators && element.decorators.length;
}

function _isDataDescriptor(desc) {
  return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
}

function _optionalCallableProperty(obj, name) {
  var value = obj[name];

  if (value !== undefined && typeof value !== "function") {
    throw new TypeError("Expected '" + name + "' to be a function");
  }

  return value;
}

function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return fn;
}

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}

function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);

  privateMap.set(obj, value);
}

function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);

  privateSet.add(obj);
}

function _classPrivateMethodSet() {
  throw new TypeError("attempted to reassign private method");
}

function _identity(x) {
  return x;
}

class Piece extends RicoObject {
  static registerType(type, constructor) {
    constructor.type = type;
    this.types[type] = constructor;
  }

  static fromJSON(pieceJSON) {
    const constructor = this.types[pieceJSON.type];

    if (constructor) {
      return constructor.fromJSON(pieceJSON);
    }
  }

  constructor(value) {
    let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(...arguments);
    this.attributes = Hash.box(attributes);
  }

  copyWithAttributes(attributes) {
    return new this.constructor(this.getValue(), attributes);
  }

  copyWithAdditionalAttributes(attributes) {
    return this.copyWithAttributes(this.attributes.merge(attributes));
  }

  copyWithoutAttribute(attribute) {
    return this.copyWithAttributes(this.attributes.remove(attribute));
  }

  copy() {
    return this.copyWithAttributes(this.attributes);
  }

  getAttribute(attribute) {
    return this.attributes.get(attribute);
  }

  getAttributesHash() {
    return this.attributes;
  }

  getAttributes() {
    return this.attributes.toObject();
  }

  hasAttribute(attribute) {
    return this.attributes.has(attribute);
  }

  hasSameStringValueAsPiece(piece) {
    return piece && this.toString() === piece.toString();
  }

  hasSameAttributesAsPiece(piece) {
    return piece && (this.attributes === piece.attributes || this.attributes.isEqualTo(piece.attributes));
  }

  isBlockBreak() {
    return false;
  }

  isEqualTo(piece) {
    return super.isEqualTo(...arguments) || this.hasSameConstructorAs(piece) && this.hasSameStringValueAsPiece(piece) && this.hasSameAttributesAsPiece(piece);
  }

  isEmpty() {
    return this.length === 0;
  }

  isSerializable() {
    return true;
  }

  toJSON() {
    return {
      type: this.constructor.type,
      attributes: this.getAttributes()
    };
  }

  contentsForInspection() {
    return {
      type: this.constructor.type,
      attributes: this.attributes.inspect()
    };
  } // Grouping


  canBeGrouped() {
    return this.hasAttribute("href");
  }

  canBeGroupedWith(piece) {
    return this.getAttribute("href") === piece.getAttribute("href");
  } // Splittable


  getLength() {
    return this.length;
  }

  canBeConsolidatedWith(piece) {
    return false;
  }

}

_defineProperty(Piece, "types", {});

class StringPiece extends Piece {
  static fromJSON(pieceJSON) {
    return new this(pieceJSON.string, pieceJSON.attributes);
  }

  constructor(string) {
    super(...arguments);
    this.string = normalizeNewlines(string);
    this.length = this.string.length;
  }

  getValue() {
    return this.string;
  }

  toString() {
    return this.string.toString();
  }

  isBlockBreak() {
    return this.toString() === "\n" && this.getAttribute("blockBreak") === true;
  }

  toJSON() {
    const result = super.toJSON(...arguments);
    result.string = this.string;
    return result;
  } // Splittable


  canBeConsolidatedWith(piece) {
    return piece && this.hasSameConstructorAs(piece) && this.hasSameAttributesAsPiece(piece);
  }

  consolidateWith(piece) {
    return new this.constructor(this.toString() + piece.toString(), this.attributes);
  }

  splitAtOffset(offset) {
    let left, right;

    if (offset === 0) {
      left = null;
      right = this;
    } else if (offset === this.length) {
      left = this;
      right = null;
    } else {
      left = new this.constructor(this.string.slice(0, offset), this.attributes);
      right = new this.constructor(this.string.slice(offset), this.attributes);
    }

    return [left, right];
  }

  toConsole() {
    let {
      string
    } = this;

    if (string.length > 15) {
      string = string.slice(0, 14) + "…";
    }

    return JSON.stringify(string.toString());
  }

}
Piece.registerType("string", StringPiece);

/* eslint-disable
    prefer-const,
*/
class SplittableList extends RicoObject {
  static box(objects) {
    if (objects instanceof this) {
      return objects;
    } else {
      return new this(objects);
    }
  }

  constructor() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);
    this.objects = objects.slice(0);
    this.length = this.objects.length;
  }

  indexOf(object) {
    return this.objects.indexOf(object);
  }

  splice() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new this.constructor(spliceArray(this.objects, ...args));
  }

  eachObject(callback) {
    return this.objects.map((object, index) => callback(object, index));
  }

  insertObjectAtIndex(object, index) {
    return this.splice(index, 0, object);
  }

  insertSplittableListAtIndex(splittableList, index) {
    return this.splice(index, 0, ...splittableList.objects);
  }

  insertSplittableListAtPosition(splittableList, position) {
    const [objects, index] = this.splitObjectAtPosition(position);
    return new this.constructor(objects).insertSplittableListAtIndex(splittableList, index);
  }

  editObjectAtIndex(index, callback) {
    return this.replaceObjectAtIndex(callback(this.objects[index]), index);
  }

  replaceObjectAtIndex(object, index) {
    return this.splice(index, 1, object);
  }

  removeObjectAtIndex(index) {
    return this.splice(index, 1);
  }

  getObjectAtIndex(index) {
    return this.objects[index];
  }

  getSplittableListInRange(range) {
    const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
    return new this.constructor(objects.slice(leftIndex, rightIndex + 1));
  }

  selectSplittableList(test) {
    const objects = this.objects.filter(object => test(object));
    return new this.constructor(objects);
  }

  removeObjectsInRange(range) {
    const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
    return new this.constructor(objects).splice(leftIndex, rightIndex - leftIndex + 1);
  }

  transformObjectsInRange(range, transform) {
    const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
    const transformedObjects = objects.map((object, index) => leftIndex <= index && index <= rightIndex ? transform(object) : object);
    return new this.constructor(transformedObjects);
  }

  splitObjectsAtRange(range) {
    let rightOuterIndex;
    let [objects, leftInnerIndex, offset] = this.splitObjectAtPosition(startOfRange(range));
    [objects, rightOuterIndex] = new this.constructor(objects).splitObjectAtPosition(endOfRange(range) + offset);
    return [objects, leftInnerIndex, rightOuterIndex - 1];
  }

  getObjectAtPosition(position) {
    const {
      index
    } = this.findIndexAndOffsetAtPosition(position);
    return this.objects[index];
  }

  splitObjectAtPosition(position) {
    let splitIndex, splitOffset;
    const {
      index,
      offset
    } = this.findIndexAndOffsetAtPosition(position);
    const objects = this.objects.slice(0);

    if (index != null) {
      if (offset === 0) {
        splitIndex = index;
        splitOffset = 0;
      } else {
        const object = this.getObjectAtIndex(index);
        const [leftObject, rightObject] = object.splitAtOffset(offset);
        objects.splice(index, 1, leftObject, rightObject);
        splitIndex = index + 1;
        splitOffset = leftObject.getLength() - offset;
      }
    } else {
      splitIndex = objects.length;
      splitOffset = 0;
    }

    return [objects, splitIndex, splitOffset];
  }

  consolidate() {
    const objects = [];
    let pendingObject = this.objects[0];
    this.objects.slice(1).forEach(object => {
      var _pendingObject$canBeC, _pendingObject;

      if ((_pendingObject$canBeC = (_pendingObject = pendingObject).canBeConsolidatedWith) !== null && _pendingObject$canBeC !== void 0 && _pendingObject$canBeC.call(_pendingObject, object)) {
        pendingObject = pendingObject.consolidateWith(object);
      } else {
        objects.push(pendingObject);
        pendingObject = object;
      }
    });

    if (pendingObject) {
      objects.push(pendingObject);
    }

    return new this.constructor(objects);
  }

  consolidateFromIndexToIndex(startIndex, endIndex) {
    const objects = this.objects.slice(0);
    const objectsInRange = objects.slice(startIndex, endIndex + 1);
    const consolidatedInRange = new this.constructor(objectsInRange).consolidate().toArray();
    return this.splice(startIndex, objectsInRange.length, ...consolidatedInRange);
  }

  findIndexAndOffsetAtPosition(position) {
    let index;
    let currentPosition = 0;

    for (index = 0; index < this.objects.length; index++) {
      const object = this.objects[index];
      const nextPosition = currentPosition + object.getLength();

      if (currentPosition <= position && position < nextPosition) {
        return {
          index,
          offset: position - currentPosition
        };
      }

      currentPosition = nextPosition;
    }

    return {
      index: null,
      offset: null
    };
  }

  findPositionAtIndexAndOffset(index, offset) {
    let position = 0;

    for (let currentIndex = 0; currentIndex < this.objects.length; currentIndex++) {
      const object = this.objects[currentIndex];

      if (currentIndex < index) {
        position += object.getLength();
      } else if (currentIndex === index) {
        position += offset;
        break;
      }
    }

    return position;
  }

  getEndPosition() {
    if (this.endPosition == null) {
      this.endPosition = 0;
      this.objects.forEach(object => this.endPosition += object.getLength());
    }

    return this.endPosition;
  }

  toString() {
    return this.objects.join("");
  }

  toArray() {
    return this.objects.slice(0);
  }

  toJSON() {
    return this.toArray();
  }

  isEqualTo(splittableList) {
    return super.isEqualTo(...arguments) || objectArraysAreEqual(this.objects, splittableList === null || splittableList === void 0 ? void 0 : splittableList.objects);
  }

  contentsForInspection() {
    return {
      objects: "[".concat(this.objects.map(object => object.inspect()).join(", "), "]")
    };
  }

}

const objectArraysAreEqual = function (left) {
  let right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (left.length !== right.length) {
    return false;
  }

  let result = true;

  for (let index = 0; index < left.length; index++) {
    const object = left[index];

    if (result && !object.isEqualTo(right[index])) {
      result = false;
    }
  }

  return result;
};

const startOfRange = range => range[0];

const endOfRange = range => range[1];

class Text extends RicoObject {
  static textForStringWithAttributes(string, attributes) {
    const piece = new StringPiece(string, attributes);
    return new this([piece]);
  }

  static fromJSON(textJSON) {
    const pieces = Array.from(textJSON).map(pieceJSON => Piece.fromJSON(pieceJSON));
    return new this(pieces);
  }

  constructor() {
    let pieces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);
    const notEmpty = pieces.filter(piece => !piece.isEmpty());
    this.pieceList = new SplittableList(notEmpty);
  }

  copy() {
    return this.copyWithPieceList(this.pieceList);
  }

  copyWithPieceList(pieceList) {
    return new this.constructor(pieceList.consolidate().toArray());
  }

  copyUsingObjectMap(objectMap) {
    const pieces = this.getPieces().map(piece => objectMap.find(piece) || piece);
    return new this.constructor(pieces);
  }

  appendText(text) {
    return this.insertTextAtPosition(text, this.getLength());
  }

  insertTextAtPosition(text, position) {
    return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(text.pieceList, position));
  }

  removeTextAtRange(range) {
    return this.copyWithPieceList(this.pieceList.removeObjectsInRange(range));
  }

  replaceTextAtRange(text, range) {
    return this.removeTextAtRange(range).insertTextAtPosition(text, range[0]);
  }

  moveTextFromRangeToPosition(range, position) {
    if (range[0] <= position && position <= range[1]) return;
    const text = this.getTextAtRange(range);
    const length = text.getLength();

    if (range[0] < position) {
      position -= length;
    }

    return this.removeTextAtRange(range).insertTextAtPosition(text, position);
  }

  addAttributeAtRange(attribute, value, range) {
    const attributes = {};
    attributes[attribute] = value;
    return this.addAttributesAtRange(attributes, range);
  }

  addAttributesAtRange(attributes, range) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, piece => piece.copyWithAdditionalAttributes(attributes)));
  }

  removeAttributeAtRange(attribute, range) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, piece => piece.copyWithoutAttribute(attribute)));
  }

  setAttributesAtRange(attributes, range) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, piece => piece.copyWithAttributes(attributes)));
  }

  getAttributesAtPosition(position) {
    var _this$pieceList$getOb;

    return ((_this$pieceList$getOb = this.pieceList.getObjectAtPosition(position)) === null || _this$pieceList$getOb === void 0 ? void 0 : _this$pieceList$getOb.getAttributes()) || {};
  }

  getCommonAttributes() {
    const objects = Array.from(this.pieceList.toArray()).map(piece => piece.getAttributes());
    return Hash.fromCommonAttributesOfObjects(objects).toObject();
  }

  getCommonAttributesAtRange(range) {
    return this.getTextAtRange(range).getCommonAttributes() || {};
  }

  getExpandedRangeForAttributeAtOffset(attributeName, offset) {
    let right;
    let left = right = offset;
    const length = this.getLength();

    while (left > 0 && this.getCommonAttributesAtRange([left - 1, right])[attributeName]) {
      left--;
    }

    while (right < length && this.getCommonAttributesAtRange([offset, right + 1])[attributeName]) {
      right++;
    }

    return [left, right];
  }

  getTextAtRange(range) {
    return this.copyWithPieceList(this.pieceList.getSplittableListInRange(range));
  }

  getStringAtRange(range) {
    return this.pieceList.getSplittableListInRange(range).toString();
  }

  getStringAtPosition(position) {
    return this.getStringAtRange([position, position + 1]);
  }

  startsWithString(string) {
    return this.getStringAtRange([0, string.length]) === string;
  }

  endsWithString(string) {
    const length = this.getLength();
    return this.getStringAtRange([length - string.length, length]) === string;
  }

  getLength() {
    return this.pieceList.getEndPosition();
  }

  isEmpty() {
    return this.getLength() === 0;
  }

  isEqualTo(text) {
    var _text$pieceList;

    return super.isEqualTo(text) || (text === null || text === void 0 ? void 0 : (_text$pieceList = text.pieceList) === null || _text$pieceList === void 0 ? void 0 : _text$pieceList.isEqualTo(this.pieceList));
  }

  isBlockBreak() {
    return this.getLength() === 1 && this.pieceList.getObjectAtIndex(0).isBlockBreak();
  }

  eachPiece(callback) {
    return this.pieceList.eachObject(callback);
  }

  getPieces() {
    return this.pieceList.toArray();
  }

  getPieceAtPosition(position) {
    return this.pieceList.getObjectAtPosition(position);
  }

  contentsForInspection() {
    return {
      pieceList: this.pieceList.inspect()
    };
  }

  toSerializableText() {
    const pieceList = this.pieceList.selectSplittableList(piece => piece.isSerializable());
    return this.copyWithPieceList(pieceList);
  }

  toString() {
    return this.pieceList.toString();
  }

  toJSON() {
    return this.pieceList.toJSON();
  }

  toConsole() {
    return JSON.stringify(this.pieceList.toArray().map(piece => JSON.parse(piece.toConsole())));
  } // BIDI


  getDirection() {
    return getDirection(this.toString());
  }

  isRTL() {
    return this.getDirection() === "rtl";
  }

}

class Block extends RicoObject {
  static fromJSON(blockJSON) {
    const text = Text.fromJSON(blockJSON.text);
    return new this(text, blockJSON.attributes, blockJSON.htmlAttributes);
  }

  constructor(text, attributes, htmlAttributes) {
    super(...arguments);
    this.text = applyBlockBreakToText(text || new Text());
    this.attributes = attributes || [];
    this.htmlAttributes = htmlAttributes || {};
  }

  isEmpty() {
    return this.text.isBlockBreak();
  }

  isEqualTo(block) {
    if (super.isEqualTo(block)) return true;
    return this.text.isEqualTo(block === null || block === void 0 ? void 0 : block.text) && arraysAreEqual(this.attributes, block === null || block === void 0 ? void 0 : block.attributes) && objectsAreEqual(this.htmlAttributes, block === null || block === void 0 ? void 0 : block.htmlAttributes);
  }

  copyWithText(text) {
    return new Block(text, this.attributes, this.htmlAttributes);
  }

  copyWithoutText() {
    return this.copyWithText(null);
  }

  copyWithAttributes(attributes) {
    return new Block(this.text, attributes, this.htmlAttributes);
  }

  copyWithoutAttributes() {
    return this.copyWithAttributes(null);
  }

  copyUsingObjectMap(objectMap) {
    const mappedText = objectMap.find(this.text);

    if (mappedText) {
      return this.copyWithText(mappedText);
    } else {
      return this.copyWithText(this.text.copyUsingObjectMap(objectMap));
    }
  }

  addAttribute(attribute) {
    const attributes = this.attributes.concat(expandAttribute(attribute));
    return this.copyWithAttributes(attributes);
  }

  addHTMLAttribute(attribute, value) {
    const htmlAttributes = Object.assign({}, this.htmlAttributes, {
      [attribute]: value
    });
    return new Block(this.text, this.attributes, htmlAttributes);
  }

  removeAttribute(attribute) {
    const {
      listAttribute
    } = getBlockConfig(attribute);
    const attributes = removeLastValue(removeLastValue(this.attributes, attribute), listAttribute);
    return this.copyWithAttributes(attributes);
  }

  removeLastAttribute() {
    return this.removeAttribute(this.getLastAttribute());
  }

  getLastAttribute() {
    return getLastElement(this.attributes);
  }

  getAttributes() {
    return this.attributes.slice(0);
  }

  getAttributeLevel() {
    return this.attributes.length;
  }

  getAttributeAtLevel(level) {
    return this.attributes[level - 1];
  }

  hasAttribute(attributeName) {
    return this.attributes.includes(attributeName);
  }

  hasAttributes() {
    return this.getAttributeLevel() > 0;
  }

  getLastNestableAttribute() {
    return getLastElement(this.getNestableAttributes());
  }

  getNestableAttributes() {
    return this.attributes.filter(attribute => getBlockConfig(attribute).nestable);
  }

  getNestingLevel() {
    return this.getNestableAttributes().length;
  }

  decreaseNestingLevel() {
    const attribute = this.getLastNestableAttribute();

    if (attribute) {
      return this.removeAttribute(attribute);
    } else {
      return this;
    }
  }

  increaseNestingLevel() {
    const attribute = this.getLastNestableAttribute();

    if (attribute) {
      const index = this.attributes.lastIndexOf(attribute);
      const attributes = spliceArray(this.attributes, index + 1, 0, ...expandAttribute(attribute));
      return this.copyWithAttributes(attributes);
    } else {
      return this;
    }
  }

  getListItemAttributes() {
    return this.attributes.filter(attribute => getBlockConfig(attribute).listAttribute);
  }

  isListItem() {
    var _getBlockConfig;

    return (_getBlockConfig = getBlockConfig(this.getLastAttribute())) === null || _getBlockConfig === void 0 ? void 0 : _getBlockConfig.listAttribute;
  }

  isTerminalBlock() {
    var _getBlockConfig2;

    return (_getBlockConfig2 = getBlockConfig(this.getLastAttribute())) === null || _getBlockConfig2 === void 0 ? void 0 : _getBlockConfig2.terminal;
  }

  breaksOnReturn() {
    const attr = this.getLastAttribute();
    const config = getBlockConfig(attr ? attr : "default");
    return config ? config.breakOnReturn : false;
  }

  findLineBreakInDirectionFromPosition(direction, position) {
    const string = this.toString();
    let result;

    switch (direction) {
      case "forward":
        result = string.indexOf("\n", position);
        break;

      case "backward":
        result = string.slice(0, position).lastIndexOf("\n");
    }

    if (result !== -1) {
      return result;
    }
  }

  contentsForInspection() {
    return {
      text: this.text.inspect(),
      attributes: this.attributes
    };
  }

  toString() {
    return this.text.toString();
  }

  toJSON() {
    return {
      text: this.text,
      attributes: this.attributes,
      htmlAttributes: this.htmlAttributes
    };
  } // BIDI


  getDirection() {
    return this.text.getDirection();
  }

  isRTL() {
    return this.text.isRTL();
  } // Splittable


  getLength() {
    return this.text.getLength();
  }

  canBeConsolidatedWith(block) {
    return !this.hasAttributes() && !block.hasAttributes() && this.getDirection() === block.getDirection();
  }

  consolidateWith(block) {
    const newlineText = Text.textForStringWithAttributes("\n");
    const text = this.getTextWithoutBlockBreak().appendText(newlineText);
    return this.copyWithText(text.appendText(block.text));
  }

  splitAtOffset(offset) {
    let left, right;

    if (offset === 0) {
      left = null;
      right = this;
    } else if (offset === this.getLength()) {
      left = this;
      right = null;
    } else {
      left = this.copyWithText(this.text.getTextAtRange([0, offset]));
      right = this.copyWithText(this.text.getTextAtRange([offset, this.getLength()]));
    }

    return [left, right];
  }

  getBlockBreakPosition() {
    return this.text.getLength() - 1;
  }

  getTextWithoutBlockBreak() {
    if (textEndsInBlockBreak(this.text)) {
      return this.text.getTextAtRange([0, this.getBlockBreakPosition()]);
    } else {
      return this.text.copy();
    }
  } // Grouping


  canBeGrouped(depth) {
    return this.attributes[depth];
  }

  canBeGroupedWith(otherBlock, depth) {
    const otherAttributes = otherBlock.getAttributes();
    const otherAttribute = otherAttributes[depth];
    const attribute = this.attributes[depth];
    return attribute === otherAttribute && !(getBlockConfig(attribute).group === false && !getListAttributeNames().includes(otherAttributes[depth + 1])) && (this.getDirection() === otherBlock.getDirection() || otherBlock.isEmpty());
  }

} // Block breaks

const applyBlockBreakToText = function (text) {
  text = unmarkExistingInnerBlockBreaksInText(text);
  text = addBlockBreakToText(text);
  return text;
};

const unmarkExistingInnerBlockBreaksInText = function (text) {
  let modified = false;
  const pieces = text.getPieces();
  let innerPieces = pieces.slice(0, pieces.length - 1);
  const lastPiece = pieces[pieces.length - 1];
  if (!lastPiece) return text;
  innerPieces = innerPieces.map(piece => {
    if (piece.isBlockBreak()) {
      modified = true;
      return unmarkBlockBreakPiece(piece);
    } else {
      return piece;
    }
  });

  if (modified) {
    return new Text([...innerPieces, lastPiece]);
  } else {
    return text;
  }
};

const blockBreakText = Text.textForStringWithAttributes("\n", {
  blockBreak: true
});

const addBlockBreakToText = function (text) {
  if (textEndsInBlockBreak(text)) {
    return text;
  } else {
    return text.appendText(blockBreakText);
  }
};

const textEndsInBlockBreak = function (text) {
  const length = text.getLength();

  if (length === 0) {
    return false;
  }

  const endText = text.getTextAtRange([length - 1, length]);
  return endText.isBlockBreak();
};

const unmarkBlockBreakPiece = piece => piece.copyWithoutAttribute("blockBreak"); // Attributes


const expandAttribute = function (attribute) {
  const {
    listAttribute
  } = getBlockConfig(attribute);

  if (listAttribute) {
    return [listAttribute, attribute];
  } else {
    return [attribute];
  }
}; // Array helpers


const getLastElement = array => array.slice(-1)[0];

const removeLastValue = function (array, value) {
  const index = array.lastIndexOf(value);

  if (index === -1) {
    return array;
  } else {
    return spliceArray(array, index, 1);
  }
};

class Document extends RicoObject {
  static fromJSON(documentJSON) {
    const blocks = Array.from(documentJSON).map(blockJSON => Block.fromJSON(blockJSON));
    return new this(blocks);
  }

  static fromString(string, textAttributes) {
    const text = Text.textForStringWithAttributes(string, textAttributes);
    return new this([new Block(text)]);
  }

  constructor() {
    let blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    super(...arguments);

    if (blocks.length === 0) {
      blocks = [new Block()];
    }

    this.blockList = SplittableList.box(blocks);
  }

  isEmpty() {
    const block = this.getBlockAtIndex(0);
    return this.blockList.length === 1 && block.isEmpty() && !block.hasAttributes();
  }

  copy() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const blocks = options.consolidateBlocks ? this.blockList.consolidate().toArray() : this.blockList.toArray();
    return new this.constructor(blocks);
  }

  copyUsingObjectsFromDocument(sourceDocument) {
    const objectMap = new ObjectMap(sourceDocument.getObjects());
    return this.copyUsingObjectMap(objectMap);
  }

  copyUsingObjectMap(objectMap) {
    const blocks = this.getBlocks().map(block => {
      const mappedBlock = objectMap.find(block);
      return mappedBlock || block.copyUsingObjectMap(objectMap);
    });
    return new this.constructor(blocks);
  }

  copyWithBaseBlockAttributes() {
    let blockAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const blocks = this.getBlocks().map(block => {
      const attributes = blockAttributes.concat(block.getAttributes());
      return block.copyWithAttributes(attributes);
    });
    return new this.constructor(blocks);
  }

  replaceBlock(oldBlock, newBlock) {
    const index = this.blockList.indexOf(oldBlock);

    if (index === -1) {
      return this;
    }

    return new this.constructor(this.blockList.replaceObjectAtIndex(newBlock, index));
  }

  insertDocumentAtRange(document, range) {
    const {
      blockList
    } = document;
    range = normalizeRange(range);
    let [position] = range;
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    let result = this;
    const block = this.getBlockAtPosition(position);

    if (rangeIsCollapsed(range) && block.isEmpty() && !block.hasAttributes()) {
      result = new this.constructor(result.blockList.removeObjectAtIndex(index));
    } else if (block.getBlockBreakPosition() === offset) {
      position++;
    }

    result = result.removeTextAtRange(range);
    return new this.constructor(result.blockList.insertSplittableListAtPosition(blockList, position));
  }

  mergeDocumentAtRange(document, range) {
    let formattedDocument, result;
    range = normalizeRange(range);
    const [startPosition] = range;
    const startLocation = this.locationFromPosition(startPosition);
    const blockAttributes = this.getBlockAtIndex(startLocation.index).getAttributes();
    const baseBlockAttributes = document.getBaseBlockAttributes();
    const trailingBlockAttributes = blockAttributes.slice(-baseBlockAttributes.length);

    if (arraysAreEqual(baseBlockAttributes, trailingBlockAttributes)) {
      const leadingBlockAttributes = blockAttributes.slice(0, -baseBlockAttributes.length);
      formattedDocument = document.copyWithBaseBlockAttributes(leadingBlockAttributes);
    } else {
      formattedDocument = document.copy({
        consolidateBlocks: true
      }).copyWithBaseBlockAttributes(blockAttributes);
    }

    const blockCount = formattedDocument.getBlockCount();
    const firstBlock = formattedDocument.getBlockAtIndex(0);

    if (arraysAreEqual(blockAttributes, firstBlock.getAttributes())) {
      const firstText = firstBlock.getTextWithoutBlockBreak();
      result = this.insertTextAtRange(firstText, range);

      if (blockCount > 1) {
        formattedDocument = new this.constructor(formattedDocument.getBlocks().slice(1));
        const position = startPosition + firstText.getLength();
        result = result.insertDocumentAtRange(formattedDocument, position);
      }
    } else {
      result = this.insertDocumentAtRange(formattedDocument, range);
    }

    return result;
  }

  insertTextAtRange(text, range) {
    range = normalizeRange(range);
    const [startPosition] = range;
    const {
      index,
      offset
    } = this.locationFromPosition(startPosition);
    const document = this.removeTextAtRange(range);
    return new this.constructor(document.blockList.editObjectAtIndex(index, block => block.copyWithText(block.text.insertTextAtPosition(text, offset))));
  }

  removeTextAtRange(range) {
    let blocks;
    range = normalizeRange(range);
    const [leftPosition, rightPosition] = range;

    if (rangeIsCollapsed(range)) {
      return this;
    }

    const [leftLocation, rightLocation] = Array.from(this.locationRangeFromRange(range));
    const leftIndex = leftLocation.index;
    const leftOffset = leftLocation.offset;
    const leftBlock = this.getBlockAtIndex(leftIndex);
    const rightIndex = rightLocation.index;
    const rightOffset = rightLocation.offset;
    const rightBlock = this.getBlockAtIndex(rightIndex);
    const removeRightNewline = rightPosition - leftPosition === 1 && leftBlock.getBlockBreakPosition() === leftOffset && rightBlock.getBlockBreakPosition() !== rightOffset && rightBlock.text.getStringAtPosition(rightOffset) === "\n";

    if (removeRightNewline) {
      blocks = this.blockList.editObjectAtIndex(rightIndex, block => block.copyWithText(block.text.removeTextAtRange([rightOffset, rightOffset + 1])));
    } else {
      let block;
      const leftText = leftBlock.text.getTextAtRange([0, leftOffset]);
      const rightText = rightBlock.text.getTextAtRange([rightOffset, rightBlock.getLength()]);
      const text = leftText.appendText(rightText);
      const removingLeftBlock = leftIndex !== rightIndex && leftOffset === 0;
      const useRightBlock = removingLeftBlock && leftBlock.getAttributeLevel() >= rightBlock.getAttributeLevel();

      if (useRightBlock) {
        block = rightBlock.copyWithText(text);
      } else {
        block = leftBlock.copyWithText(text);
      }

      const affectedBlockCount = rightIndex + 1 - leftIndex;
      blocks = this.blockList.splice(leftIndex, affectedBlockCount, block);
    }

    return new this.constructor(blocks);
  }

  moveTextFromRangeToPosition(range, position) {
    let text;
    range = normalizeRange(range);
    const [startPosition, endPosition] = range;

    if (startPosition <= position && position <= endPosition) {
      return this;
    }

    let document = this.getDocumentAtRange(range);
    let result = this.removeTextAtRange(range);
    const movingRightward = startPosition < position;

    if (movingRightward) {
      position -= document.getLength();
    }

    const [firstBlock, ...blocks] = document.getBlocks();

    if (blocks.length === 0) {
      text = firstBlock.getTextWithoutBlockBreak();

      if (movingRightward) {
        position += 1;
      }
    } else {
      text = firstBlock.text;
    }

    result = result.insertTextAtRange(text, position);

    if (blocks.length === 0) {
      return result;
    }

    document = new this.constructor(blocks);
    position += text.getLength();
    return result.insertDocumentAtRange(document, position);
  }

  addAttributeAtRange(attribute, value, range) {
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, (block, textRange, index) => blockList = blockList.editObjectAtIndex(index, function () {
      if (getBlockConfig(attribute)) {
        return block.addAttribute(attribute, value);
      } else {
        if (textRange[0] === textRange[1]) {
          return block;
        } else {
          return block.copyWithText(block.text.addAttributeAtRange(attribute, value, textRange));
        }
      }
    }));
    return new this.constructor(blockList);
  }

  addAttribute(attribute, value) {
    let {
      blockList
    } = this;
    this.eachBlock((block, index) => blockList = blockList.editObjectAtIndex(index, () => block.addAttribute(attribute, value)));
    return new this.constructor(blockList);
  }

  removeAttributeAtRange(attribute, range) {
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, function (block, textRange, index) {
      if (getBlockConfig(attribute)) {
        blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(attribute));
      } else if (textRange[0] !== textRange[1]) {
        blockList = blockList.editObjectAtIndex(index, () => block.copyWithText(block.text.removeAttributeAtRange(attribute, textRange)));
      }
    });
    return new this.constructor(blockList);
  }

  insertBlockBreakAtRange(range) {
    let blocks;
    range = normalizeRange(range);
    const [startPosition] = range;
    const {
      offset
    } = this.locationFromPosition(startPosition);
    const document = this.removeTextAtRange(range);

    if (offset === 0) {
      blocks = [new Block()];
    }

    return new this.constructor(document.blockList.insertSplittableListAtPosition(new SplittableList(blocks), startPosition));
  }

  applyBlockAttributeAtRange(attributeName, value, range) {
    const expanded = this.expandRangeToLineBreaksAndSplitBlocks(range);
    let document = expanded.document;
    range = expanded.range;
    const blockConfig = getBlockConfig(attributeName);

    if (blockConfig.listAttribute) {
      document = document.removeLastListAttributeAtRange(range, {
        exceptAttributeName: attributeName
      });
      const converted = document.convertLineBreaksToBlockBreaksInRange(range);
      document = converted.document;
      range = converted.range;
    } else if (blockConfig.exclusive) {
      document = document.removeBlockAttributesAtRange(range);
    } else if (blockConfig.terminal) {
      document = document.removeLastTerminalAttributeAtRange(range);
    } else {
      document = document.consolidateBlocksAtRange(range);
    }

    return document.addAttributeAtRange(attributeName, value, range);
  }

  removeLastListAttributeAtRange(range) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, function (block, textRange, index) {
      const lastAttributeName = block.getLastAttribute();

      if (!lastAttributeName) {
        return;
      }

      if (!getBlockConfig(lastAttributeName).listAttribute) {
        return;
      }

      if (lastAttributeName === options.exceptAttributeName) {
        return;
      }

      blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(lastAttributeName));
    });
    return new this.constructor(blockList);
  }

  removeLastTerminalAttributeAtRange(range) {
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, function (block, textRange, index) {
      const lastAttributeName = block.getLastAttribute();

      if (!lastAttributeName) {
        return;
      }

      if (!getBlockConfig(lastAttributeName).terminal) {
        return;
      }

      blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(lastAttributeName));
    });
    return new this.constructor(blockList);
  }

  removeBlockAttributesAtRange(range) {
    let {
      blockList
    } = this;
    this.eachBlockAtRange(range, function (block, textRange, index) {
      if (block.hasAttributes()) {
        blockList = blockList.editObjectAtIndex(index, () => block.copyWithoutAttributes());
      }
    });
    return new this.constructor(blockList);
  }

  expandRangeToLineBreaksAndSplitBlocks(range) {
    let position;
    range = normalizeRange(range);
    let [startPosition, endPosition] = range;
    const startLocation = this.locationFromPosition(startPosition);
    const endLocation = this.locationFromPosition(endPosition);
    let document = this;
    const startBlock = document.getBlockAtIndex(startLocation.index);
    startLocation.offset = startBlock.findLineBreakInDirectionFromPosition("backward", startLocation.offset);

    if (startLocation.offset != null) {
      position = document.positionFromLocation(startLocation);
      document = document.insertBlockBreakAtRange([position, position + 1]);
      endLocation.index += 1;
      endLocation.offset -= document.getBlockAtIndex(startLocation.index).getLength();
      startLocation.index += 1;
    }

    startLocation.offset = 0;

    if (endLocation.offset === 0 && endLocation.index > startLocation.index) {
      endLocation.index -= 1;
      endLocation.offset = document.getBlockAtIndex(endLocation.index).getBlockBreakPosition();
    } else {
      const endBlock = document.getBlockAtIndex(endLocation.index);

      if (endBlock.text.getStringAtRange([endLocation.offset - 1, endLocation.offset]) === "\n") {
        endLocation.offset -= 1;
      } else {
        endLocation.offset = endBlock.findLineBreakInDirectionFromPosition("forward", endLocation.offset);
      }

      if (endLocation.offset !== endBlock.getBlockBreakPosition()) {
        position = document.positionFromLocation(endLocation);
        document = document.insertBlockBreakAtRange([position, position + 1]);
      }
    }

    startPosition = document.positionFromLocation(startLocation);
    endPosition = document.positionFromLocation(endLocation);
    range = normalizeRange([startPosition, endPosition]);
    return {
      document,
      range
    };
  }

  convertLineBreaksToBlockBreaksInRange(range) {
    range = normalizeRange(range);
    let [position] = range;
    const string = this.getStringAtRange(range).slice(0, -1);
    let document = this;
    string.replace(/.*?\n/g, function (match) {
      position += match.length;
      document = document.insertBlockBreakAtRange([position - 1, position]);
    });
    return {
      document,
      range
    };
  }

  consolidateBlocksAtRange(range) {
    range = normalizeRange(range);
    const [startPosition, endPosition] = range;
    const startIndex = this.locationFromPosition(startPosition).index;
    const endIndex = this.locationFromPosition(endPosition).index;
    return new this.constructor(this.blockList.consolidateFromIndexToIndex(startIndex, endIndex));
  }

  getDocumentAtRange(range) {
    range = normalizeRange(range);
    const blocks = this.blockList.getSplittableListInRange(range).toArray();
    return new this.constructor(blocks);
  }

  getStringAtRange(range) {
    let endIndex;
    const array = range = normalizeRange(range),
          endPosition = array[array.length - 1];

    if (endPosition !== this.getLength()) {
      endIndex = -1;
    }

    return this.getDocumentAtRange(range).toString().slice(0, endIndex);
  }

  getBlockAtIndex(index) {
    return this.blockList.getObjectAtIndex(index);
  }

  getBlockAtPosition(position) {
    const {
      index
    } = this.locationFromPosition(position);
    return this.getBlockAtIndex(index);
  }

  getTextAtIndex(index) {
    var _this$getBlockAtIndex;

    return (_this$getBlockAtIndex = this.getBlockAtIndex(index)) === null || _this$getBlockAtIndex === void 0 ? void 0 : _this$getBlockAtIndex.text;
  }

  getTextAtPosition(position) {
    const {
      index
    } = this.locationFromPosition(position);
    return this.getTextAtIndex(index);
  }

  getPieceAtPosition(position) {
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    return this.getTextAtIndex(index).getPieceAtPosition(offset);
  }

  getCharacterAtPosition(position) {
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    return this.getTextAtIndex(index).getStringAtRange([offset, offset + 1]);
  }

  getLength() {
    return this.blockList.getEndPosition();
  }

  getBlocks() {
    return this.blockList.toArray();
  }

  getBlockCount() {
    return this.blockList.length;
  }

  getEditCount() {
    return this.editCount;
  }

  eachBlock(callback) {
    return this.blockList.eachObject(callback);
  }

  eachBlockAtRange(range, callback) {
    let block, textRange;
    range = normalizeRange(range);
    const [startPosition, endPosition] = range;
    const startLocation = this.locationFromPosition(startPosition);
    const endLocation = this.locationFromPosition(endPosition);

    if (startLocation.index === endLocation.index) {
      block = this.getBlockAtIndex(startLocation.index);
      textRange = [startLocation.offset, endLocation.offset];
      return callback(block, textRange, startLocation.index);
    } else {
      for (let index = startLocation.index; index <= endLocation.index; index++) {
        block = this.getBlockAtIndex(index);

        if (block) {
          switch (index) {
            case startLocation.index:
              textRange = [startLocation.offset, block.text.getLength()];
              break;

            case endLocation.index:
              textRange = [0, endLocation.offset];
              break;

            default:
              textRange = [0, block.text.getLength()];
          }

          callback(block, textRange, index);
        }
      }
    }
  }

  getCommonAttributesAtRange(range) {
    range = normalizeRange(range);
    const [startPosition] = range;

    if (rangeIsCollapsed(range)) {
      return this.getCommonAttributesAtPosition(startPosition);
    } else {
      const textAttributes = [];
      const blockAttributes = [];
      this.eachBlockAtRange(range, function (block, textRange) {
        if (textRange[0] !== textRange[1]) {
          textAttributes.push(block.text.getCommonAttributesAtRange(textRange));
          return blockAttributes.push(attributesForBlock(block));
        }
      });
      return Hash.fromCommonAttributesOfObjects(textAttributes).merge(Hash.fromCommonAttributesOfObjects(blockAttributes)).toObject();
    }
  }

  getCommonAttributesAtPosition(position) {
    let key, value;
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    const block = this.getBlockAtIndex(index);

    if (!block) {
      return {};
    }

    const commonAttributes = attributesForBlock(block);
    const attributes = block.text.getAttributesAtPosition(offset);
    const attributesLeft = block.text.getAttributesAtPosition(offset - 1);
    const inheritableAttributes = Object.keys(text_attributes).filter(key => {
      return text_attributes[key].inheritable;
    });

    for (key in attributesLeft) {
      value = attributesLeft[key];

      if (value === attributes[key] || inheritableAttributes.includes(key)) {
        commonAttributes[key] = value;
      }
    }

    return commonAttributes;
  }

  getRangeOfCommonAttributeAtPosition(attributeName, position) {
    const {
      index,
      offset
    } = this.locationFromPosition(position);
    const text = this.getTextAtIndex(index);
    const [startOffset, endOffset] = Array.from(text.getExpandedRangeForAttributeAtOffset(attributeName, offset));
    const start = this.positionFromLocation({
      index,
      offset: startOffset
    });
    const end = this.positionFromLocation({
      index,
      offset: endOffset
    });
    return normalizeRange([start, end]);
  }

  getBaseBlockAttributes() {
    let baseBlockAttributes = this.getBlockAtIndex(0).getAttributes();

    for (let blockIndex = 1; blockIndex < this.getBlockCount(); blockIndex++) {
      const blockAttributes = this.getBlockAtIndex(blockIndex).getAttributes();
      const lastAttributeIndex = Math.min(baseBlockAttributes.length, blockAttributes.length);

      baseBlockAttributes = (() => {
        const result = [];

        for (let index = 0; index < lastAttributeIndex; index++) {
          if (blockAttributes[index] !== baseBlockAttributes[index]) {
            break;
          }

          result.push(blockAttributes[index]);
        }

        return result;
      })();
    }

    return baseBlockAttributes;
  }

  findRangesForBlockAttribute(attributeName) {
    let position = 0;
    const ranges = [];
    this.getBlocks().forEach(block => {
      const length = block.getLength();

      if (block.hasAttribute(attributeName)) {
        ranges.push([position, position + length]);
      }

      position += length;
    });
    return ranges;
  }

  findRangesForTextAttribute(attributeName) {
    let {
      withValue
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let position = 0;
    let range = [];
    const ranges = [];

    const match = function (piece) {
      if (withValue) {
        return piece.getAttribute(attributeName) === withValue;
      } else {
        return piece.hasAttribute(attributeName);
      }
    };

    this.getPieces().forEach(piece => {
      const length = piece.getLength();

      if (match(piece)) {
        if (range[1] === position) {
          range[1] = position + length;
        } else {
          ranges.push(range = [position, position + length]);
        }
      }

      position += length;
    });
    return ranges;
  }

  locationFromPosition(position) {
    const location = this.blockList.findIndexAndOffsetAtPosition(Math.max(0, position));

    if (location.index != null) {
      return location;
    } else {
      const blocks = this.getBlocks();
      return {
        index: blocks.length - 1,
        offset: blocks[blocks.length - 1].getLength()
      };
    }
  }

  positionFromLocation(location) {
    return this.blockList.findPositionAtIndexAndOffset(location.index, location.offset);
  }

  locationRangeFromPosition(position) {
    return normalizeRange(this.locationFromPosition(position));
  }

  locationRangeFromRange(range) {
    range = normalizeRange(range);
    if (!range) return;
    const [startPosition, endPosition] = Array.from(range);
    const startLocation = this.locationFromPosition(startPosition);
    const endLocation = this.locationFromPosition(endPosition);
    return normalizeRange([startLocation, endLocation]);
  }

  rangeFromLocationRange(locationRange) {
    let rightPosition;
    locationRange = normalizeRange(locationRange);
    const leftPosition = this.positionFromLocation(locationRange[0]);

    if (!rangeIsCollapsed(locationRange)) {
      rightPosition = this.positionFromLocation(locationRange[1]);
    }

    return normalizeRange([leftPosition, rightPosition]);
  }

  isEqualTo(document) {
    return this.blockList.isEqualTo(document === null || document === void 0 ? void 0 : document.blockList);
  }

  getTexts() {
    return this.getBlocks().map(block => block.text);
  }

  getPieces() {
    const pieces = [];
    Array.from(this.getTexts()).forEach(text => {
      pieces.push(...Array.from(text.getPieces() || []));
    });
    return pieces;
  }

  getObjects() {
    return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
  }

  toSerializableDocument() {
    const blocks = [];
    this.blockList.eachObject(block => blocks.push(block.copyWithText(block.text.toSerializableText())));
    return new this.constructor(blocks);
  }

  toString() {
    return this.blockList.toString();
  }

  toJSON() {
    return this.blockList.toJSON();
  }

  toConsole() {
    return JSON.stringify(this.blockList.toArray().map(block => JSON.parse(block.text.toConsole())));
  }

}

const attributesForBlock = function (block) {
  const attributes = {};
  const attributeName = block.getLastAttribute();

  if (attributeName) {
    attributes[attributeName] = true;
  }

  return attributes;
};

const DEFAULT_ALLOWED_ATTRIBUTES = "style href src width height language class".split(" ");
const DEFAULT_FORBIDDEN_PROTOCOLS = "javascript:".split(" ");
const DEFAULT_FORBIDDEN_ELEMENTS = "script iframe form noscript".split(" ");
class HTMLSanitizer extends BasicObject {
  static sanitize(html, options) {
    const sanitizer = new this(html, options);
    sanitizer.sanitize();
    return sanitizer;
  }

  constructor(html) {
    let {
      allowedAttributes,
      forbiddenProtocols,
      forbiddenElements
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(...arguments);
    this.allowedAttributes = allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES;
    this.forbiddenProtocols = forbiddenProtocols || DEFAULT_FORBIDDEN_PROTOCOLS;
    this.forbiddenElements = forbiddenElements || DEFAULT_FORBIDDEN_ELEMENTS;
    this.body = createBodyElementForHTML(html);
  }

  sanitize() {
    this.sanitizeElements();
    return this.normalizeListElementNesting();
  }

  getHTML() {
    return this.body.innerHTML;
  }

  getBody() {
    return this.body;
  } // Private


  sanitizeElements() {
    const walker = walkTree(this.body);
    const nodesToRemove = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;

      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          if (this.elementIsRemovable(node)) {
            nodesToRemove.push(node);
          } else {
            this.sanitizeElement(node);
          }

          break;

        case Node.COMMENT_NODE:
          nodesToRemove.push(node);
          break;
      }
    }

    nodesToRemove.forEach(node => removeNode(node));
    return this.body;
  }

  sanitizeElement(element) {
    if (element.hasAttribute("href")) {
      if (this.forbiddenProtocols.includes(element.protocol)) {
        element.removeAttribute("href");
      }
    }

    Array.from(element.attributes).forEach(_ref => {
      let {
        name
      } = _ref;

      if (!this.allowedAttributes.includes(name) && name.indexOf("data-rico") !== 0) {
        element.removeAttribute(name);
      }
    });
    return element;
  }

  normalizeListElementNesting() {
    Array.from(this.body.querySelectorAll("ul,ol")).forEach(listElement => {
      const previousElement = listElement.previousElementSibling;

      if (previousElement) {
        if (tagName(previousElement) === "li") {
          previousElement.appendChild(listElement);
        }
      }
    });
    return this.body;
  }

  elementIsRemovable(element) {
    if ((element === null || element === void 0 ? void 0 : element.nodeType) !== Node.ELEMENT_NODE) return;
    return this.elementIsForbidden(element) || this.elementIsntSerializable(element);
  }

  elementIsForbidden(element) {
    return this.forbiddenElements.includes(tagName(element));
  }

  elementIsntSerializable(element) {
    return element.getAttribute("data-rico-serialize") === "false";
  }

}

const createBodyElementForHTML = function () {
  let html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  // Remove everything after </html>
  html = html.replace(/<\/html[^>]*>[^]*$/i, "</html>");
  const doc = document.implementation.createHTMLDocument("");
  doc.documentElement.innerHTML = html;
  Array.from(doc.head.querySelectorAll("style")).forEach(element => {
    doc.body.appendChild(element);
  });
  return doc.body;
};

/* eslint-disable
    no-case-declarations,
    no-irregular-whitespace,
*/

const pieceForString = function (string) {
  let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const type = "string";
  string = normalizeSpaces(string);
  return {
    string,
    attributes,
    type
  };
};

const blockForAttributes = function () {
  let attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let htmlAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const text = [];
  return {
    text,
    attributes,
    htmlAttributes
  };
};

const getImageDimensions = element => {
  const width = element.getAttribute("width");
  const height = element.getAttribute("height");
  const dimensions = {};

  if (width) {
    dimensions.width = parseInt(width, 10);
  }

  if (height) {
    dimensions.height = parseInt(height, 10);
  }

  return dimensions;
};

class HTMLParser extends BasicObject {
  static parse(html, options) {
    const parser = new this(html, options);
    parser.parse();
    return parser;
  }

  constructor(html) {
    let {
      referenceElement
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(...arguments);
    this.html = html;
    this.referenceElement = referenceElement;
    this.blocks = [];
    this.blockElements = [];
    this.processedElements = [];
  }

  getDocument() {
    return Document.fromJSON(this.blocks);
  } // HTML parsing


  parse() {
    try {
      this.createHiddenContainer();
      const html = HTMLSanitizer.sanitize(this.html).getHTML();
      this.containerElement.innerHTML = html;
      const walker = walkTree(this.containerElement, {
        usingFilter: nodeFilter
      });

      while (walker.nextNode()) {
        this.processNode(walker.currentNode);
      }

      return this.translateBlockElementMarginsToNewlines();
    } finally {
      this.removeHiddenContainer();
    }
  }

  createHiddenContainer() {
    if (this.referenceElement) {
      this.containerElement = this.referenceElement.cloneNode(false);
      this.containerElement.removeAttribute("id");
      this.containerElement.setAttribute("data-rico-internal", "");
      this.containerElement.style.display = "none";
      return this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling);
    } else {
      this.containerElement = makeElement({
        tagName: "div",
        style: {
          display: "none"
        }
      });
      return document.body.appendChild(this.containerElement);
    }
  }

  removeHiddenContainer() {
    return removeNode(this.containerElement);
  }

  processNode(node) {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        if (!this.isInsignificantTextNode(node)) {
          this.appendBlockForTextNode(node);
          return this.processTextNode(node);
        }

        break;

      case Node.ELEMENT_NODE:
        this.appendBlockForElement(node);
        return this.processElement(node);
    }
  }

  appendBlockForTextNode(node) {
    const element = node.parentNode;

    if (element === this.currentBlockElement && this.isBlockElement(node.previousSibling)) {
      return this.appendStringWithAttributes("\n");
    } else if (element === this.containerElement || this.isBlockElement(element)) {
      var _this$currentBlock;

      const attributes = this.getBlockAttributes(element);
      const htmlAttributes = this.getBlockHTMLAttributes(element);

      if (!arraysAreEqual(attributes, (_this$currentBlock = this.currentBlock) === null || _this$currentBlock === void 0 ? void 0 : _this$currentBlock.attributes)) {
        this.currentBlock = this.appendBlockForAttributesWithElement(attributes, element, htmlAttributes);
        this.currentBlockElement = element;
      }
    }
  }

  appendBlockForElement(element) {
    const elementIsBlockElement = this.isBlockElement(element);
    const currentBlockContainsElement = elementContainsNode(this.currentBlockElement, element);

    if (elementIsBlockElement && !this.isBlockElement(element.firstChild)) {
      if (!this.isInsignificantTextNode(element.firstChild) || !this.isBlockElement(element.firstElementChild)) {
        const attributes = this.getBlockAttributes(element);
        const htmlAttributes = this.getBlockHTMLAttributes(element);

        if (element.firstChild) {
          if (!(currentBlockContainsElement && arraysAreEqual(attributes, this.currentBlock.attributes))) {
            this.currentBlock = this.appendBlockForAttributesWithElement(attributes, element, htmlAttributes);
            this.currentBlockElement = element;
          } else {
            return this.appendStringWithAttributes("\n");
          }
        }
      }
    } else if (this.currentBlockElement && !currentBlockContainsElement && !elementIsBlockElement) {
      const parentBlockElement = this.findParentBlockElement(element);

      if (parentBlockElement) {
        return this.appendBlockForElement(parentBlockElement);
      } else {
        this.currentBlock = this.appendEmptyBlock();
        this.currentBlockElement = null;
      }
    }
  }

  findParentBlockElement(element) {
    let {
      parentElement
    } = element;

    while (parentElement && parentElement !== this.containerElement) {
      if (this.isBlockElement(parentElement) && this.blockElements.includes(parentElement)) {
        return parentElement;
      } else {
        parentElement = parentElement.parentElement;
      }
    }

    return null;
  }

  processTextNode(node) {
    let string = node.data;

    if (!elementCanDisplayPreformattedText(node.parentNode)) {
      var _node$previousSibling;

      string = squishBreakableWhitespace(string);

      if (stringEndsWithWhitespace((_node$previousSibling = node.previousSibling) === null || _node$previousSibling === void 0 ? void 0 : _node$previousSibling.textContent)) {
        string = leftTrimBreakableWhitespace(string);
      }
    }

    return this.appendStringWithAttributes(string, this.getTextAttributes(node.parentNode));
  }

  processElement(element) {
    let attributes;

    switch (tagName(element)) {
      case "br":
        if (!this.isExtraBR(element) && !this.isBlockElement(element.nextSibling)) {
          this.appendStringWithAttributes("\n", this.getTextAttributes(element));
        }

        return this.processedElements.push(element);

      case "img":
        attributes = {
          url: element.getAttribute("src"),
          contentType: "image"
        };
        const object = getImageDimensions(element);

        for (const key in object) {
          const value = object[key];
          attributes[key] = value;
        }

        return this.processedElements.push(element);

      case "tr":
        if (this.needsTableSeparator(element)) {
          return this.appendStringWithAttributes(parser.tableRowSeparator);
        }

        break;

      case "td":
        if (this.needsTableSeparator(element)) {
          return this.appendStringWithAttributes(parser.tableCellSeparator);
        }

        break;
    }
  } // Document construction


  appendBlockForAttributesWithElement(attributes, element) {
    let htmlAttributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.blockElements.push(element);
    const block = blockForAttributes(attributes, htmlAttributes);
    this.blocks.push(block);
    return block;
  }

  appendEmptyBlock() {
    return this.appendBlockForAttributesWithElement([], null);
  }

  appendStringWithAttributes(string, attributes) {
    return this.appendPiece(pieceForString(string, attributes));
  }

  appendPiece(piece) {
    if (this.blocks.length === 0) {
      this.appendEmptyBlock();
    }

    return this.blocks[this.blocks.length - 1].text.push(piece);
  }

  appendStringToTextAtIndex(string, index) {
    const {
      text
    } = this.blocks[index];
    const piece = text[text.length - 1];

    if ((piece === null || piece === void 0 ? void 0 : piece.type) === "string") {
      piece.string += string;
    } else {
      return text.push(pieceForString(string));
    }
  }

  prependStringToTextAtIndex(string, index) {
    const {
      text
    } = this.blocks[index];
    const piece = text[0];

    if ((piece === null || piece === void 0 ? void 0 : piece.type) === "string") {
      piece.string = string + piece.string;
    } else {
      return text.unshift(pieceForString(string));
    }
  } // Attribute parsing


  getTextAttributes(element) {
    let value;
    const attributes = {};

    for (const attribute in text_attributes) {
      const configAttr = text_attributes[attribute];

      if (configAttr.tagName && findClosestElementFromNode(element, {
        matchingSelector: configAttr.tagName,
        untilNode: this.containerElement
      })) {
        attributes[attribute] = true;
      } else if (configAttr.parser) {
        value = configAttr.parser(element);

        if (value) {
          let attributeInheritedFromBlock = false;

          for (const blockElement of this.findBlockElementAncestors(element)) {
            if (configAttr.parser(blockElement) === value) {
              attributeInheritedFromBlock = true;
              break;
            }
          }

          if (!attributeInheritedFromBlock) {
            attributes[attribute] = value;
          }
        }
      } else if (configAttr.styleProperty) {
        value = element.style[configAttr.styleProperty];

        if (value) {
          attributes[attribute] = value;
        }
      }
    }

    return attributes;
  }

  getBlockAttributes(element) {
    const attributes$1 = [];

    while (element && element !== this.containerElement) {
      for (const attribute in attributes) {
        const attrConfig = attributes[attribute];

        if (attrConfig.parse !== false) {
          if (tagName(element) === attrConfig.tagName) {
            var _attrConfig$test;

            if ((_attrConfig$test = attrConfig.test) !== null && _attrConfig$test !== void 0 && _attrConfig$test.call(attrConfig, element) || !attrConfig.test) {
              attributes$1.push(attribute);

              if (attrConfig.listAttribute) {
                attributes$1.push(attrConfig.listAttribute);
              }
            }
          }
        }
      }

      element = element.parentNode;
    }

    return attributes$1.reverse();
  }

  getBlockHTMLAttributes(element) {
    const attributes$1 = {};
    const blockConfig = Object.values(attributes).find(settings => settings.tagName === tagName(element));
    const allowedAttributes = (blockConfig === null || blockConfig === void 0 ? void 0 : blockConfig.htmlAttributes) || [];
    allowedAttributes.forEach(attribute => {
      if (element.hasAttribute(attribute)) {
        attributes$1[attribute] = element.getAttribute(attribute);
      }
    });
    return attributes$1;
  }

  findBlockElementAncestors(element) {
    const ancestors = [];

    while (element && element !== this.containerElement) {
      const tag = tagName(element);

      if (getBlockTagNames().includes(tag)) {
        ancestors.push(element);
      }

      element = element.parentNode;
    }

    return ancestors;
  } // Element inspection


  isBlockElement(element) {
    if ((element === null || element === void 0 ? void 0 : element.nodeType) !== Node.ELEMENT_NODE) return;
    if (findClosestElementFromNode(element, {
      matchingSelector: "td",
      untilNode: this.containerElement
    })) return;
    return getBlockTagNames().includes(tagName(element)) || window.getComputedStyle(element).display === "block";
  }

  isInsignificantTextNode(node) {
    if ((node === null || node === void 0 ? void 0 : node.nodeType) !== Node.TEXT_NODE) return;
    if (!stringIsAllBreakableWhitespace(node.data)) return;
    const {
      parentNode,
      previousSibling,
      nextSibling
    } = node;
    if (nodeEndsWithNonWhitespace(parentNode.previousSibling) && !this.isBlockElement(parentNode.previousSibling)) return;
    if (elementCanDisplayPreformattedText(parentNode)) return;
    return !previousSibling || this.isBlockElement(previousSibling) || !nextSibling || this.isBlockElement(nextSibling);
  }

  isExtraBR(element) {
    return tagName(element) === "br" && this.isBlockElement(element.parentNode) && element.parentNode.lastChild === element;
  }

  needsTableSeparator(element) {
    if (parser.removeBlankTableCells) {
      var _element$previousSibl;

      const content = (_element$previousSibl = element.previousSibling) === null || _element$previousSibl === void 0 ? void 0 : _element$previousSibl.textContent;
      return content && /\S/.test(content);
    } else {
      return element.previousSibling;
    }
  } // Margin translation


  translateBlockElementMarginsToNewlines() {
    const defaultMargin = this.getMarginOfDefaultBlockElement();

    for (let index = 0; index < this.blocks.length; index++) {
      const margin = this.getMarginOfBlockElementAtIndex(index);

      if (margin) {
        if (margin.top > defaultMargin.top * 2) {
          this.prependStringToTextAtIndex("\n", index);
        }

        if (margin.bottom > defaultMargin.bottom * 2) {
          this.appendStringToTextAtIndex("\n", index);
        }
      }
    }
  }

  getMarginOfBlockElementAtIndex(index) {
    const element = this.blockElements[index];

    if (element) {
      if (element.textContent) {
        if (!getBlockTagNames().includes(tagName(element)) && !this.processedElements.includes(element)) {
          return getBlockElementMargin(element);
        }
      }
    }
  }

  getMarginOfDefaultBlockElement() {
    const element = makeElement(attributes.default.tagName);
    this.containerElement.appendChild(element);
    return getBlockElementMargin(element);
  }

} // Helpers

const elementCanDisplayPreformattedText = function (element) {
  const {
    whiteSpace
  } = window.getComputedStyle(element);
  return ["pre", "pre-wrap", "pre-line"].includes(whiteSpace);
};

const nodeEndsWithNonWhitespace = node => node && !stringEndsWithWhitespace(node.textContent);

const getBlockElementMargin = function (element) {
  const style = window.getComputedStyle(element);

  if (style.display === "block") {
    return {
      top: parseInt(style.marginTop),
      bottom: parseInt(style.marginBottom)
    };
  }
};

const nodeFilter = function (node) {
  if (tagName(node) === "style") {
    return NodeFilter.FILTER_REJECT;
  } else {
    return NodeFilter.FILTER_ACCEPT;
  }
}; // Whitespace


const leftTrimBreakableWhitespace = string => string.replace(new RegExp("^".concat(breakableWhitespacePattern.source, "+")), "");

const stringIsAllBreakableWhitespace = string => new RegExp("^".concat(breakableWhitespacePattern.source, "*$")).test(string);

const stringEndsWithWhitespace = string => /\s$/.test(string);

/* eslint-disable
    no-empty,
*/
const unserializableElementSelector = "[data-rico-serialize=false]";
const unserializableAttributeNames = ["contenteditable", "data-rico-id", "data-rico-store-key", "data-rico-mutable", "data-rico-placeholder", "tabindex"];
const serializedAttributesAttribute = "data-rico-serialized-attributes";
const serializedAttributesSelector = "[".concat(serializedAttributesAttribute, "]");
const blockCommentPattern = new RegExp("<!--block-->", "g");
const serializers = {
  "application/json": function (serializable) {
    let document;

    if (serializable instanceof Document) {
      document = serializable;
    } else if (serializable instanceof HTMLElement) {
      document = HTMLParser.parse(serializable.innerHTML).getDocument();
    } else {
      throw new Error("unserializable object");
    }

    return document.toSerializableDocument().toJSONString();
  },
  "text/html": function (serializable) {
    let element;

    if (serializable instanceof Document) {
      element = DocumentView.render(serializable);
    } else if (serializable instanceof HTMLElement) {
      element = serializable.cloneNode(true);
    } else {
      throw new Error("unserializable object");
    } // Remove unserializable elements


    Array.from(element.querySelectorAll(unserializableElementSelector)).forEach(el => {
      removeNode(el);
    }); // Remove unserializable attributes

    unserializableAttributeNames.forEach(attribute => {
      Array.from(element.querySelectorAll("[".concat(attribute, "]"))).forEach(el => {
        el.removeAttribute(attribute);
      });
    }); // Rewrite elements with serialized attribute overrides

    Array.from(element.querySelectorAll(serializedAttributesSelector)).forEach(el => {
      try {
        const attributes = JSON.parse(el.getAttribute(serializedAttributesAttribute));
        el.removeAttribute(serializedAttributesAttribute);

        for (const name in attributes) {
          const value = attributes[name];
          el.setAttribute(name, value);
        }
      } catch (error) {}
    });
    return element.innerHTML.replace(blockCommentPattern, "");
  }
};
const deserializers = {
  "application/json": function (string) {
    return Document.fromJSONString(string);
  },
  "text/html": function (string) {
    return HTMLParser.parse(string).getDocument();
  }
};
const serializeToContentType = function (serializable, contentType) {
  const serializer = serializers[contentType];

  if (serializer) {
    return serializer(serializable);
  } else {
    throw new Error("unknown content type: ".concat(contentType));
  }
};
const deserializeFromContentType = function (string, contentType) {
  const deserializer = deserializers[contentType];

  if (deserializer) {
    return deserializer(string);
  } else {
    throw new Error("unknown content type: ".concat(contentType));
  }
};

var core = /*#__PURE__*/Object.freeze({
  __proto__: null
});

class LineBreakInsertion {
  constructor(composition) {
    this.composition = composition;
    this.document = this.composition.document;
    const selectedRange = this.composition.getSelectedRange();
    this.startPosition = selectedRange[0];
    this.endPosition = selectedRange[1];
    this.startLocation = this.document.locationFromPosition(this.startPosition);
    this.endLocation = this.document.locationFromPosition(this.endPosition);
    this.block = this.document.getBlockAtIndex(this.endLocation.index);
    this.breaksOnReturn = this.block.breaksOnReturn();
    this.previousCharacter = this.block.text.getStringAtPosition(this.endLocation.offset - 1);
    this.nextCharacter = this.block.text.getStringAtPosition(this.endLocation.offset);
  }

  shouldInsertBlockBreak() {
    if (this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty()) {
      return this.startLocation.offset !== 0;
    } else {
      return !this.shouldBreakFormattedBlock() ? this.breaksOnReturn : false;
    }
  }

  shouldBreakFormattedBlock() {
    return this.block.hasAttributes() && !this.block.isListItem() && (this.breaksOnReturn && this.nextCharacter === "\n" || this.previousCharacter === "\n");
  }

  shouldDecreaseListLevel() {
    return this.block.hasAttributes() && this.block.isListItem() && this.block.isEmpty();
  }

  shouldPrependListItem() {
    return this.block.isListItem() && this.startLocation.offset === 0 && !this.block.isEmpty();
  }

  shouldRemoveLastBlockAttribute() {
    return this.block.hasAttributes() && !this.block.isListItem() && this.block.isEmpty();
  }

}

const PLACEHOLDER = " ";
class Composition extends BasicObject {
  constructor() {
    super(...arguments);
    this.document = new Document();
    this.currentAttributes = {};
    this.revision = 0;
  }

  setDocument(document) {
    if (!document.isEqualTo(this.document)) {
      var _this$delegate, _this$delegate$compos;

      this.document = document;
      this.revision++;
      return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$compos = _this$delegate.compositionDidChangeDocument) === null || _this$delegate$compos === void 0 ? void 0 : _this$delegate$compos.call(_this$delegate, document);
    }
  } // Snapshots


  getSnapshot() {
    return {
      document: this.document,
      selectedRange: this.getSelectedRange()
    };
  }

  loadSnapshot(_ref) {
    var _this$delegate2, _this$delegate2$compo, _this$delegate3, _this$delegate3$compo;

    let {
      document,
      selectedRange
    } = _ref;
    (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : (_this$delegate2$compo = _this$delegate2.compositionWillLoadSnapshot) === null || _this$delegate2$compo === void 0 ? void 0 : _this$delegate2$compo.call(_this$delegate2);
    this.setDocument(document != null ? document : new Document());
    this.setSelection(selectedRange != null ? selectedRange : [0, 0]);
    return (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : (_this$delegate3$compo = _this$delegate3.compositionDidLoadSnapshot) === null || _this$delegate3$compo === void 0 ? void 0 : _this$delegate3$compo.call(_this$delegate3);
  } // Responder protocol


  insertText(text) {
    let {
      updatePosition
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      updatePosition: true
    };
    const selectedRange = this.getSelectedRange();
    this.setDocument(this.document.insertTextAtRange(text, selectedRange));
    const startPosition = selectedRange[0];
    const endPosition = startPosition + text.getLength();

    if (updatePosition) {
      this.setSelection(endPosition);
    }

    return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
  }

  insertBlock() {
    let block = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Block();
    const document = new Document([block]);
    return this.insertDocument(document);
  }

  insertDocument() {
    let document = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Document();
    const selectedRange = this.getSelectedRange();
    this.setDocument(this.document.insertDocumentAtRange(document, selectedRange));
    const startPosition = selectedRange[0];
    const endPosition = startPosition + document.getLength();
    this.setSelection(endPosition);
    return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
  }

  insertString(string, options) {
    const attributes = this.getCurrentTextAttributes();
    const text = Text.textForStringWithAttributes(string, attributes);
    return this.insertText(text, options);
  }

  insertBlockBreak() {
    const selectedRange = this.getSelectedRange();
    this.setDocument(this.document.insertBlockBreakAtRange(selectedRange));
    const startPosition = selectedRange[0];
    const endPosition = startPosition + 1;
    this.setSelection(endPosition);
    return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
  }

  insertLineBreak() {
    const insertion = new LineBreakInsertion(this);

    if (insertion.shouldDecreaseListLevel()) {
      this.decreaseListLevel();
      return this.setSelection(insertion.startPosition);
    } else if (insertion.shouldPrependListItem()) {
      const document = new Document([insertion.block.copyWithoutText()]);
      return this.insertDocument(document);
    } else if (insertion.shouldInsertBlockBreak()) {
      return this.insertBlockBreak();
    } else if (insertion.shouldRemoveLastBlockAttribute()) {
      return this.removeLastBlockAttribute();
    } else if (insertion.shouldBreakFormattedBlock()) {
      return this.breakFormattedBlock(insertion);
    } else {
      return this.insertString("\n");
    }
  }

  insertHTML(html) {
    const document = HTMLParser.parse(html).getDocument();
    const selectedRange = this.getSelectedRange();
    this.setDocument(this.document.mergeDocumentAtRange(document, selectedRange));
    const startPosition = selectedRange[0];
    const endPosition = startPosition + document.getLength() - 1;
    this.setSelection(endPosition);
    return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
  }

  replaceHTML(html) {
    const document = HTMLParser.parse(html).getDocument().copyUsingObjectsFromDocument(this.document);
    const locationRange = this.getLocationRange({
      strict: false
    });
    const selectedRange = this.document.rangeFromLocationRange(locationRange);
    this.setDocument(document);
    return this.setSelection(selectedRange);
  }

  shouldManageDeletingInDirection(direction) {
    const locationRange = this.getLocationRange();

    if (rangeIsCollapsed(locationRange)) {
      if (direction === "backward" && locationRange[0].offset === 0) {
        return true;
      }
    } else {
      if (locationRange[0].index !== locationRange[1].index) {
        return true;
      }
    }

    return false;
  }

  deleteInDirection(direction) {
    let {
      length
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let deletingIntoPreviousBlock, selectionSpansBlocks;
    const locationRange = this.getLocationRange();
    let range = this.getSelectedRange();
    const selectionIsCollapsed = rangeIsCollapsed(range);

    if (selectionIsCollapsed) {
      deletingIntoPreviousBlock = direction === "backward" && locationRange[0].offset === 0;
    } else {
      selectionSpansBlocks = locationRange[0].index !== locationRange[1].index;
    }

    if (deletingIntoPreviousBlock) {
      if (this.canDecreaseBlockAttributeLevel()) {
        const block = this.getBlock();

        if (block.isListItem()) {
          this.decreaseListLevel();
        } else {
          this.decreaseBlockAttributeLevel();
        }

        this.setSelection(range[0]);

        if (block.isEmpty()) {
          return false;
        }
      }
    }

    if (selectionIsCollapsed) {
      range = this.getExpandedRangeInDirection(direction, {
        length
      });
    }

    this.setDocument(this.document.removeTextAtRange(range));
    this.setSelection(range[0]);

    if (deletingIntoPreviousBlock || selectionSpansBlocks) {
      return false;
    }
  }

  moveTextFromRange(range) {
    const [position] = Array.from(this.getSelectedRange());
    this.setDocument(this.document.moveTextFromRangeToPosition(range, position));
    return this.setSelection(position);
  }

  removeLastBlockAttribute() {
    const [startPosition, endPosition] = Array.from(this.getSelectedRange());
    const block = this.document.getBlockAtPosition(endPosition);
    this.removeCurrentAttribute(block.getLastAttribute());
    return this.setSelection(startPosition);
  }

  insertPlaceholder() {
    this.placeholderPosition = this.getPosition();
    return this.insertString(PLACEHOLDER);
  }

  selectPlaceholder() {
    if (this.placeholderPosition != null) {
      this.setSelectedRange([this.placeholderPosition, this.placeholderPosition + PLACEHOLDER.length]);
      return this.getSelectedRange();
    }
  }

  forgetPlaceholder() {
    this.placeholderPosition = null;
  } // Current attributes


  hasCurrentAttribute(attributeName) {
    const value = this.currentAttributes[attributeName];
    return value != null && value !== false;
  }

  toggleCurrentAttribute(attributeName) {
    const value = !this.currentAttributes[attributeName];

    if (value) {
      return this.setCurrentAttribute(attributeName, value);
    } else {
      return this.removeCurrentAttribute(attributeName);
    }
  }

  canSetCurrentAttribute(attributeName) {
    if (getBlockConfig(attributeName)) {
      return this.canSetCurrentBlockAttribute(attributeName);
    } else {
      return this.canSetCurrentTextAttribute(attributeName);
    }
  }

  canSetCurrentTextAttribute(attributeName) {
    const document = this.getSelectedDocument();
    if (!document) return;
    return true;
  }

  canSetCurrentBlockAttribute(attributeName) {
    const block = this.getBlock();
    if (!block) return;
    return !block.isTerminalBlock();
  }

  setCurrentAttribute(attributeName, value) {
    if (getBlockConfig(attributeName)) {
      return this.setBlockAttribute(attributeName, value);
    } else {
      this.setTextAttribute(attributeName, value);
      this.currentAttributes[attributeName] = value;
      return this.notifyDelegateOfCurrentAttributesChange();
    }
  }

  setHTMLAtributeAtPosition(position, attributeName, value) {
    var _getBlockConfig;

    const block = this.document.getBlockAtPosition(position);
    const allowedHTMLAttributes = (_getBlockConfig = getBlockConfig(block.getLastAttribute())) === null || _getBlockConfig === void 0 ? void 0 : _getBlockConfig.htmlAttributes;

    if (block && allowedHTMLAttributes !== null && allowedHTMLAttributes !== void 0 && allowedHTMLAttributes.includes(attributeName)) {
      const newDocument = this.document.setHTMLAttributeAtPosition(position, attributeName, value);
      this.setDocument(newDocument);
    }
  }

  setTextAttribute(attributeName, value) {
    const selectedRange = this.getSelectedRange();
    if (!selectedRange) return;
    const [startPosition, endPosition] = Array.from(selectedRange);

    if (startPosition === endPosition) {
      if (attributeName === "href") {
        const text = Text.textForStringWithAttributes(value, {
          href: value
        });
        return this.insertText(text);
      }
    } else {
      return this.setDocument(this.document.addAttributeAtRange(attributeName, value, selectedRange));
    }
  }

  setBlockAttribute(attributeName, value) {
    const selectedRange = this.getSelectedRange();

    if (this.canSetCurrentAttribute(attributeName)) {
      this.setDocument(this.document.applyBlockAttributeAtRange(attributeName, value, selectedRange));
      return this.setSelection(selectedRange);
    }
  }

  removeCurrentAttribute(attributeName) {
    if (getBlockConfig(attributeName)) {
      this.removeBlockAttribute(attributeName);
      return this.updateCurrentAttributes();
    } else {
      this.removeTextAttribute(attributeName);
      delete this.currentAttributes[attributeName];
      return this.notifyDelegateOfCurrentAttributesChange();
    }
  }

  removeTextAttribute(attributeName) {
    const selectedRange = this.getSelectedRange();
    if (!selectedRange) return;
    return this.setDocument(this.document.removeAttributeAtRange(attributeName, selectedRange));
  }

  removeBlockAttribute(attributeName) {
    const selectedRange = this.getSelectedRange();
    if (!selectedRange) return;
    return this.setDocument(this.document.removeAttributeAtRange(attributeName, selectedRange));
  }

  canDecreaseNestingLevel() {
    var _this$getBlock;

    return ((_this$getBlock = this.getBlock()) === null || _this$getBlock === void 0 ? void 0 : _this$getBlock.getNestingLevel()) > 0;
  }

  canIncreaseNestingLevel() {
    var _getBlockConfig2;

    const block = this.getBlock();
    if (!block) return;

    if ((_getBlockConfig2 = getBlockConfig(block.getLastNestableAttribute())) !== null && _getBlockConfig2 !== void 0 && _getBlockConfig2.listAttribute) {
      const previousBlock = this.getPreviousBlock();

      if (previousBlock) {
        return arrayStartsWith(previousBlock.getListItemAttributes(), block.getListItemAttributes());
      }
    } else {
      return block.getNestingLevel() > 0;
    }
  }

  decreaseNestingLevel() {
    const block = this.getBlock();
    if (!block) return;
    return this.setDocument(this.document.replaceBlock(block, block.decreaseNestingLevel()));
  }

  increaseNestingLevel() {
    const block = this.getBlock();
    if (!block) return;
    return this.setDocument(this.document.replaceBlock(block, block.increaseNestingLevel()));
  }

  canDecreaseBlockAttributeLevel() {
    var _this$getBlock2;

    return ((_this$getBlock2 = this.getBlock()) === null || _this$getBlock2 === void 0 ? void 0 : _this$getBlock2.getAttributeLevel()) > 0;
  }

  decreaseBlockAttributeLevel() {
    var _this$getBlock3;

    const attribute = (_this$getBlock3 = this.getBlock()) === null || _this$getBlock3 === void 0 ? void 0 : _this$getBlock3.getLastAttribute();

    if (attribute) {
      return this.removeCurrentAttribute(attribute);
    }
  }

  decreaseListLevel() {
    let [startPosition] = Array.from(this.getSelectedRange());
    const {
      index
    } = this.document.locationFromPosition(startPosition);
    let endIndex = index;
    const attributeLevel = this.getBlock().getAttributeLevel();
    let block = this.document.getBlockAtIndex(endIndex + 1);

    while (block) {
      if (!block.isListItem() || block.getAttributeLevel() <= attributeLevel) {
        break;
      }

      endIndex++;
      block = this.document.getBlockAtIndex(endIndex + 1);
    }

    startPosition = this.document.positionFromLocation({
      index,
      offset: 0
    });
    const endPosition = this.document.positionFromLocation({
      index: endIndex,
      offset: 0
    });
    return this.setDocument(this.document.removeLastListAttributeAtRange([startPosition, endPosition]));
  }

  updateCurrentAttributes() {
    const selectedRange = this.getSelectedRange({
      ignoreLock: true
    });

    if (selectedRange) {
      const currentAttributes = this.document.getCommonAttributesAtRange(selectedRange);
      Array.from(getAllAttributeNames()).forEach(attributeName => {
        if (!currentAttributes[attributeName]) {
          if (!this.canSetCurrentAttribute(attributeName)) {
            currentAttributes[attributeName] = false;
          }
        }
      });

      if (!objectsAreEqual(currentAttributes, this.currentAttributes)) {
        this.currentAttributes = currentAttributes;
        return this.notifyDelegateOfCurrentAttributesChange();
      }
    }
  }

  getCurrentAttributes() {
    return extend.call({}, this.currentAttributes);
  }

  getCurrentTextAttributes() {
    const attributes = {};

    for (const key in this.currentAttributes) {
      const value = this.currentAttributes[key];

      if (value !== false) {
        if (getTextConfig(key)) {
          attributes[key] = value;
        }
      }
    }

    return attributes;
  } // Selection freezing


  freezeSelection() {
    return this.setCurrentAttribute("frozen", true);
  }

  thawSelection() {
    return this.removeCurrentAttribute("frozen");
  }

  hasFrozenSelection() {
    return this.hasCurrentAttribute("frozen");
  }

  setSelection(selectedRange) {
    var _this$delegate4;

    const locationRange = this.document.locationRangeFromRange(selectedRange);
    return (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.compositionDidRequestChangingSelectionToLocationRange(locationRange);
  }

  getSelectedRange() {
    const locationRange = this.getLocationRange();

    if (locationRange) {
      return this.document.rangeFromLocationRange(locationRange);
    }
  }

  setSelectedRange(selectedRange) {
    const locationRange = this.document.locationRangeFromRange(selectedRange);
    return this.getSelectionManager().setLocationRange(locationRange);
  }

  getPosition() {
    const locationRange = this.getLocationRange();

    if (locationRange) {
      return this.document.positionFromLocation(locationRange[0]);
    }
  }

  getLocationRange(options) {
    if (this.targetLocationRange) {
      return this.targetLocationRange;
    } else {
      return this.getSelectionManager().getLocationRange(options) || normalizeRange({
        index: 0,
        offset: 0
      });
    }
  }

  withTargetLocationRange(locationRange, fn) {
    let result;
    this.targetLocationRange = locationRange;

    try {
      result = fn();
    } finally {
      this.targetLocationRange = null;
    }

    return result;
  }

  withTargetRange(range, fn) {
    const locationRange = this.document.locationRangeFromRange(range);
    return this.withTargetLocationRange(locationRange, fn);
  }

  withTargetDOMRange(domRange, fn) {
    const locationRange = this.createLocationRangeFromDOMRange(domRange, {
      strict: false
    });
    return this.withTargetLocationRange(locationRange, fn);
  }

  getExpandedRangeInDirection(direction) {
    let {
      length
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let [startPosition, endPosition] = Array.from(this.getSelectedRange());

    if (direction === "backward") {
      if (length) {
        startPosition -= length;
      } else {
        startPosition = this.translateUTF16PositionFromOffset(startPosition, -1);
      }
    } else {
      if (length) {
        endPosition += length;
      } else {
        endPosition = this.translateUTF16PositionFromOffset(endPosition, 1);
      }
    }

    return normalizeRange([startPosition, endPosition]);
  }

  moveCursorInDirection(direction) {
    const range = this.getExpandedRangeInDirection(direction);

    if (direction === "backward") {
      this.setSelectedRange(range[0]);
    } else {
      this.setSelectedRange(range[1]);
    }
  }

  expandSelectionInDirection(direction) {
    let {
      length
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const range = this.getExpandedRangeInDirection(direction, {
      length
    });
    return this.setSelectedRange(range);
  }

  expandSelectionForEditing() {
    if (this.hasCurrentAttribute("href")) {
      return this.expandSelectionAroundCommonAttribute("href");
    }
  }

  expandSelectionAroundCommonAttribute(attributeName) {
    const position = this.getPosition();
    const range = this.document.getRangeOfCommonAttributeAtPosition(attributeName, position);
    return this.setSelectedRange(range);
  }

  selectionIsInCursorTarget() {
    return this.positionIsCursorTarget(this.getPosition());
  }

  positionIsCursorTarget(position) {
    const location = this.document.locationFromPosition(position);

    if (location) {
      return this.locationIsCursorTarget(location);
    }
  }

  positionIsBlockBreak(position) {
    var _this$document$getPie;

    return (_this$document$getPie = this.document.getPieceAtPosition(position)) === null || _this$document$getPie === void 0 ? void 0 : _this$document$getPie.isBlockBreak();
  }

  getSelectedDocument() {
    const selectedRange = this.getSelectedRange();

    if (selectedRange) {
      return this.document.getDocumentAtRange(selectedRange);
    }
  } // Private


  breakFormattedBlock(insertion) {
    let {
      document
    } = insertion;
    const {
      block
    } = insertion;
    let position = insertion.startPosition;
    let range = [position - 1, position];

    if (block.getBlockBreakPosition() === insertion.startLocation.offset) {
      if (block.breaksOnReturn() && insertion.nextCharacter === "\n") {
        position += 1;
      } else {
        document = document.removeTextAtRange(range);
      }

      range = [position, position];
    } else if (insertion.nextCharacter === "\n") {
      if (insertion.previousCharacter === "\n") {
        range = [position - 1, position + 1];
      } else {
        range = [position, position + 1];
        position += 1;
      }
    } else if (insertion.startLocation.offset - 1 !== 0) {
      position += 1;
    }

    const newDocument = new Document([block.removeLastAttribute().copyWithoutText()]);
    this.setDocument(document.insertDocumentAtRange(newDocument, range));
    return this.setSelection(position);
  }

  getPreviousBlock() {
    const locationRange = this.getLocationRange();

    if (locationRange) {
      const {
        index
      } = locationRange[0];

      if (index > 0) {
        return this.document.getBlockAtIndex(index - 1);
      }
    }
  }

  getBlock() {
    const locationRange = this.getLocationRange();

    if (locationRange) {
      return this.document.getBlockAtIndex(locationRange[0].index);
    }
  }

  notifyDelegateOfCurrentAttributesChange() {
    var _this$delegate5, _this$delegate5$compo;

    return (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : (_this$delegate5$compo = _this$delegate5.compositionDidChangeCurrentAttributes) === null || _this$delegate5$compo === void 0 ? void 0 : _this$delegate5$compo.call(_this$delegate5, this.currentAttributes);
  }

  notifyDelegateOfInsertionAtRange(range) {
    var _this$delegate6, _this$delegate6$compo;

    return (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : (_this$delegate6$compo = _this$delegate6.compositionDidPerformInsertionAtRange) === null || _this$delegate6$compo === void 0 ? void 0 : _this$delegate6$compo.call(_this$delegate6, range);
  }

  translateUTF16PositionFromOffset(position, offset) {
    const utf16string = this.document.toUTF16String();
    const utf16position = utf16string.offsetFromUCS2Offset(position);
    return utf16string.offsetToUCS2Offset(utf16position + offset);
  }

}
Composition.proxyMethod("getSelectionManager().getPointRange");
Composition.proxyMethod("getSelectionManager().setLocationRangeFromPointRange");
Composition.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange");
Composition.proxyMethod("getSelectionManager().locationIsCursorTarget");
Composition.proxyMethod("getSelectionManager().selectionIsExpanded");
Composition.proxyMethod("delegate?.getSelectionManager");

class UndoManager extends BasicObject {
  constructor(composition) {
    super(...arguments);
    this.composition = composition;
    this.undoEntries = [];
    this.redoEntries = [];
  }

  recordUndoEntry(description) {
    let {
      context,
      consolidatable
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const previousEntry = this.undoEntries.slice(-1)[0];

    if (!consolidatable || !entryHasDescriptionAndContext(previousEntry, description, context)) {
      const undoEntry = this.createEntry({
        description,
        context
      });
      this.undoEntries.push(undoEntry);
      this.redoEntries = [];
    }
  }

  undo() {
    const undoEntry = this.undoEntries.pop();

    if (undoEntry) {
      const redoEntry = this.createEntry(undoEntry);
      this.redoEntries.push(redoEntry);
      return this.composition.loadSnapshot(undoEntry.snapshot);
    }
  }

  redo() {
    const redoEntry = this.redoEntries.pop();

    if (redoEntry) {
      const undoEntry = this.createEntry(redoEntry);
      this.undoEntries.push(undoEntry);
      return this.composition.loadSnapshot(redoEntry.snapshot);
    }
  }

  canUndo() {
    return this.undoEntries.length > 0;
  }

  canRedo() {
    return this.redoEntries.length > 0;
  } // Private


  createEntry() {
    let {
      description,
      context
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      description: description === null || description === void 0 ? void 0 : description.toString(),
      context: JSON.stringify(context),
      snapshot: this.composition.getSnapshot()
    };
  }

}

const entryHasDescriptionAndContext = (entry, description, context) => (entry === null || entry === void 0 ? void 0 : entry.description) === (description === null || description === void 0 ? void 0 : description.toString()) && (entry === null || entry === void 0 ? void 0 : entry.context) === JSON.stringify(context);

class Editor {
  constructor(composition, selectionManager, element) {
    this.composition = composition;
    this.selectionManager = selectionManager;
    this.element = element;
    this.undoManager = new UndoManager(this.composition);
  }

  loadDocument(document) {
    return this.loadSnapshot({
      document,
      selectedRange: [0, 0]
    });
  }

  loadHTML() {
    let html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    const document = HTMLParser.parse(html, {
      referenceElement: this.element
    }).getDocument();
    return this.loadDocument(document);
  }

  loadJSON(_ref) {
    let {
      document,
      selectedRange
    } = _ref;
    document = Document.fromJSON(document);
    return this.loadSnapshot({
      document,
      selectedRange
    });
  }

  loadSnapshot(snapshot) {
    this.undoManager = new UndoManager(this.composition);
    return this.composition.loadSnapshot(snapshot);
  }

  getDocument() {
    return this.composition.document;
  }

  getSelectedDocument() {
    return this.composition.getSelectedDocument();
  }

  getSnapshot() {
    return this.composition.getSnapshot();
  }

  toJSON() {
    return this.getSnapshot();
  } // Document manipulation


  deleteInDirection(direction) {
    return this.composition.deleteInDirection(direction);
  }

  insertDocument(document) {
    return this.composition.insertDocument(document);
  }

  insertHTML(html) {
    return this.composition.insertHTML(html);
  }

  insertString(string) {
    return this.composition.insertString(string);
  }

  insertText(text) {
    return this.composition.insertText(text);
  }

  insertLineBreak() {
    return this.composition.insertLineBreak();
  } // Selection


  getSelectedRange() {
    return this.composition.getSelectedRange();
  }

  getPosition() {
    return this.composition.getPosition();
  }

  getClientRectAtPosition(position) {
    const locationRange = this.getDocument().locationRangeFromRange([position, position + 1]);
    return this.selectionManager.getClientRectAtLocationRange(locationRange);
  }

  expandSelectionInDirection(direction) {
    return this.composition.expandSelectionInDirection(direction);
  }

  moveCursorInDirection(direction) {
    return this.composition.moveCursorInDirection(direction);
  }

  setSelectedRange(selectedRange) {
    return this.composition.setSelectedRange(selectedRange);
  } // Attributes


  activateAttribute(name) {
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    return this.composition.setCurrentAttribute(name, value);
  }

  attributeIsActive(name) {
    return this.composition.hasCurrentAttribute(name);
  }

  canActivateAttribute(name) {
    return this.composition.canSetCurrentAttribute(name);
  }

  deactivateAttribute(name) {
    return this.composition.removeCurrentAttribute(name);
  } // HTML attributes


  setHTMLAtributeAtPosition(position, name, value) {
    this.composition.setHTMLAtributeAtPosition(position, name, value);
  } // Nesting level


  canDecreaseNestingLevel() {
    return this.composition.canDecreaseNestingLevel();
  }

  canIncreaseNestingLevel() {
    return this.composition.canIncreaseNestingLevel();
  }

  decreaseNestingLevel() {
    if (this.canDecreaseNestingLevel()) {
      return this.composition.decreaseNestingLevel();
    }
  }

  increaseNestingLevel() {
    if (this.canIncreaseNestingLevel()) {
      return this.composition.increaseNestingLevel();
    }
  } // Undo/redo


  canRedo() {
    return this.undoManager.canRedo();
  }

  canUndo() {
    return this.undoManager.canUndo();
  }

  recordUndoEntry(description) {
    let {
      context,
      consolidatable
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.undoManager.recordUndoEntry(description, {
      context,
      consolidatable
    });
  }

  redo() {
    if (this.canRedo()) {
      return this.undoManager.redo();
    }
  }

  undo() {
    if (this.canUndo()) {
      return this.undoManager.undo();
    }
  }

}

/* eslint-disable
    no-var,
    prefer-const,
*/
class LocationMapper {
  constructor(element) {
    this.element = element;
  }

  findLocationFromContainerAndOffset(container, offset) {
    let {
      strict
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      strict: true
    };
    let childIndex = 0;
    let foundBlock = false;
    const location = {
      index: 0,
      offset: 0
    };
    const walker = walkTree(this.element);

    while (walker.nextNode()) {
      const node = walker.currentNode;

      if (node === container && nodeIsTextNode(container)) {
        if (!nodeIsCursorTarget(node)) {
          location.offset += offset;
        }

        break;
      } else {
        if (node.parentNode === container) {
          if (childIndex++ === offset) {
            break;
          }
        } else if (!elementContainsNode(container, node)) {
          if (childIndex > 0) {
            break;
          }
        }

        if (nodeIsBlockStart(node, {
          strict
        })) {
          if (foundBlock) {
            location.index++;
          }

          location.offset = 0;
          foundBlock = true;
        } else {
          location.offset += nodeLength(node);
        }
      }
    }

    return location;
  }

  findContainerAndOffsetFromLocation(location) {
    let container, offset;

    if (location.index === 0 && location.offset === 0) {
      container = this.element;
      offset = 0;

      while (container.firstChild) {
        container = container.firstChild;

        if (nodeIsBlockContainer(container)) {
          offset = 1;
          break;
        }
      }

      return [container, offset];
    }

    let [node, nodeOffset] = this.findNodeAndOffsetFromLocation(location);
    if (!node) return;

    if (nodeIsTextNode(node)) {
      if (nodeLength(node) === 0) {
        container = node.parentNode.parentNode;
        offset = findChildIndexOfNode(node.parentNode);

        if (nodeIsCursorTarget(node, {
          name: "right"
        })) {
          offset++;
        }
      } else {
        container = node;
        offset = location.offset - nodeOffset;
      }
    } else {
      container = node.parentNode;

      if (!nodeIsBlockStart(node.previousSibling)) {
        if (!nodeIsBlockContainer(container)) {
          while (node === container.lastChild) {
            node = container;
            container = container.parentNode;

            if (nodeIsBlockContainer(container)) {
              break;
            }
          }
        }
      }

      offset = findChildIndexOfNode(node);

      if (location.offset !== 0) {
        offset++;
      }
    }

    return [container, offset];
  }

  findNodeAndOffsetFromLocation(location) {
    let node, nodeOffset;
    let offset = 0;

    for (const currentNode of this.getSignificantNodesForIndex(location.index)) {
      const length = nodeLength(currentNode);

      if (location.offset <= offset + length) {
        if (nodeIsTextNode(currentNode)) {
          node = currentNode;
          nodeOffset = offset;

          if (location.offset === nodeOffset && nodeIsCursorTarget(node)) {
            break;
          }
        } else if (!node) {
          node = currentNode;
          nodeOffset = offset;
        }
      }

      offset += length;

      if (offset > location.offset) {
        break;
      }
    }

    return [node, nodeOffset];
  } // Private


  getSignificantNodesForIndex(index) {
    const nodes = [];
    const walker = walkTree(this.element, {
      usingFilter: acceptSignificantNodes
    });
    let recordingNodes = false;

    while (walker.nextNode()) {
      const node = walker.currentNode;

      if (nodeIsBlockStartComment(node)) {
        var blockIndex;

        if (blockIndex != null) {
          blockIndex++;
        } else {
          blockIndex = 0;
        }

        if (blockIndex === index) {
          recordingNodes = true;
        } else if (recordingNodes) {
          break;
        }
      } else if (recordingNodes) {
        nodes.push(node);
      }
    }

    return nodes;
  }

}

const nodeLength = function (node) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (nodeIsCursorTarget(node)) {
      return 0;
    } else {
      const string = node.textContent;
      return string.length;
    }
  } else if (tagName(node) === "br") {
    return 1;
  } else {
    return 0;
  }
};

const acceptSignificantNodes = function (node) {
  if (rejectEmptyTextNodes(node) === NodeFilter.FILTER_ACCEPT) {
    return NodeFilter.FILTER_ACCEPT;
  } else {
    return NodeFilter.FILTER_REJECT;
  }
};

const rejectEmptyTextNodes = function (node) {
  if (nodeIsEmptyTextNode(node)) {
    return NodeFilter.FILTER_REJECT;
  } else {
    return NodeFilter.FILTER_ACCEPT;
  }
};

/* eslint-disable
    id-length,
    no-empty,
*/
class PointMapper {
  createDOMRangeFromPoint(_ref) {
    let {
      x,
      y
    } = _ref;
    let domRange;

    if (document.caretPositionFromPoint) {
      const {
        offsetNode,
        offset
      } = document.caretPositionFromPoint(x, y);
      domRange = document.createRange();
      domRange.setStart(offsetNode, offset);
      return domRange;
    } else if (document.caretRangeFromPoint) {
      return document.caretRangeFromPoint(x, y);
    } else if (document.body.createTextRange) {
      const originalDOMRange = getDOMRange();

      try {
        // IE 11 throws "Unspecified error" when using moveToPoint
        // during a drag-and-drop operation.
        const textRange = document.body.createTextRange();
        textRange.moveToPoint(x, y);
        textRange.select();
      } catch (error) {}

      domRange = getDOMRange();
      setDOMRange(originalDOMRange);
      return domRange;
    }
  }

  getClientRectsForDOMRange(domRange) {
    const array = Array.from(domRange.getClientRects());
    const start = array[0];
    const end = array[array.length - 1];
    return [start, end];
  }

}

/* eslint-disable
*/
class SelectionManager extends BasicObject {
  constructor(element) {
    super(...arguments);
    this.didMouseDown = this.didMouseDown.bind(this);
    this.selectionDidChange = this.selectionDidChange.bind(this);
    this.element = element;
    this.locationMapper = new LocationMapper(this.element);
    this.pointMapper = new PointMapper();
    this.lockCount = 0;
    handleEvent("mousedown", {
      onElement: this.element,
      withCallback: this.didMouseDown
    });
  }

  getLocationRange() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (options.strict === false) {
      return this.createLocationRangeFromDOMRange(getDOMRange());
    } else if (options.ignoreLock) {
      return this.currentLocationRange;
    } else if (this.lockedLocationRange) {
      return this.lockedLocationRange;
    } else {
      return this.currentLocationRange;
    }
  }

  setLocationRange(locationRange) {
    if (this.lockedLocationRange) return;
    locationRange = normalizeRange(locationRange);
    const domRange = this.createDOMRangeFromLocationRange(locationRange);

    if (domRange) {
      setDOMRange(domRange);
      this.updateCurrentLocationRange(locationRange);
    }
  }

  setLocationRangeFromPointRange(pointRange) {
    pointRange = normalizeRange(pointRange);
    const startLocation = this.getLocationAtPoint(pointRange[0]);
    const endLocation = this.getLocationAtPoint(pointRange[1]);
    this.setLocationRange([startLocation, endLocation]);
  }

  getClientRectAtLocationRange(locationRange) {
    const domRange = this.createDOMRangeFromLocationRange(locationRange);

    if (domRange) {
      return this.getClientRectsForDOMRange(domRange)[1];
    }
  }

  locationIsCursorTarget(location) {
    const node = Array.from(this.findNodeAndOffsetFromLocation(location))[0];
    return nodeIsCursorTarget(node);
  }

  lock() {
    if (this.lockCount++ === 0) {
      this.updateCurrentLocationRange();
      this.lockedLocationRange = this.getLocationRange();
    }
  }

  unlock() {
    if (--this.lockCount === 0) {
      const {
        lockedLocationRange
      } = this;
      this.lockedLocationRange = null;

      if (lockedLocationRange != null) {
        return this.setLocationRange(lockedLocationRange);
      }
    }
  }

  clearSelection() {
    var _getDOMSelection;

    return (_getDOMSelection = getDOMSelection()) === null || _getDOMSelection === void 0 ? void 0 : _getDOMSelection.removeAllRanges();
  }

  selectionIsCollapsed() {
    var _getDOMRange;

    return ((_getDOMRange = getDOMRange()) === null || _getDOMRange === void 0 ? void 0 : _getDOMRange.collapsed) === true;
  }

  selectionIsExpanded() {
    return !this.selectionIsCollapsed();
  }

  createLocationRangeFromDOMRange(domRange, options) {
    if (domRange == null || !this.domRangeWithinElement(domRange)) return;
    const start = this.findLocationFromContainerAndOffset(domRange.startContainer, domRange.startOffset, options);
    if (!start) return;
    const end = domRange.collapsed ? undefined : this.findLocationFromContainerAndOffset(domRange.endContainer, domRange.endOffset, options);
    return normalizeRange([start, end]);
  }

  didMouseDown() {
    return this.pauseTemporarily();
  }

  pauseTemporarily() {
    let resumeHandlers;
    this.paused = true;

    const resume = () => {
      this.paused = false;
      clearTimeout(resumeTimeout);
      Array.from(resumeHandlers).forEach(handler => {
        handler.destroy();
      });

      if (elementContainsNode(document, this.element)) {
        return this.selectionDidChange();
      }
    };

    const resumeTimeout = setTimeout(resume, 200);
    resumeHandlers = ["mousemove", "keydown"].map(eventName => handleEvent(eventName, {
      onElement: document,
      withCallback: resume
    }));
  }

  selectionDidChange() {
    if (!this.paused && !innerElementIsActive(this.element)) {
      return this.updateCurrentLocationRange();
    }
  }

  updateCurrentLocationRange(locationRange) {
    if (locationRange != null ? locationRange : locationRange = this.createLocationRangeFromDOMRange(getDOMRange())) {
      if (!rangesAreEqual(locationRange, this.currentLocationRange)) {
        var _this$delegate, _this$delegate$locati;

        this.currentLocationRange = locationRange;
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$locati = _this$delegate.locationRangeDidChange) === null || _this$delegate$locati === void 0 ? void 0 : _this$delegate$locati.call(_this$delegate, this.currentLocationRange.slice(0));
      }
    }
  }

  createDOMRangeFromLocationRange(locationRange) {
    const rangeStart = this.findContainerAndOffsetFromLocation(locationRange[0]);
    const rangeEnd = rangeIsCollapsed(locationRange) ? rangeStart : this.findContainerAndOffsetFromLocation(locationRange[1]) || rangeStart;

    if (rangeStart != null && rangeEnd != null) {
      const domRange = document.createRange();
      domRange.setStart(...Array.from(rangeStart || []));
      domRange.setEnd(...Array.from(rangeEnd || []));
      return domRange;
    }
  }

  getLocationAtPoint(point) {
    const domRange = this.createDOMRangeFromPoint(point);

    if (domRange) {
      var _this$createLocationR;

      return (_this$createLocationR = this.createLocationRangeFromDOMRange(domRange)) === null || _this$createLocationR === void 0 ? void 0 : _this$createLocationR[0];
    }
  }

  domRangeWithinElement(domRange) {
    if (domRange.collapsed) {
      return elementContainsNode(this.element, domRange.startContainer);
    } else {
      return elementContainsNode(this.element, domRange.startContainer) && elementContainsNode(this.element, domRange.endContainer);
    }
  }

}
SelectionManager.proxyMethod("locationMapper.findLocationFromContainerAndOffset");
SelectionManager.proxyMethod("locationMapper.findContainerAndOffsetFromLocation");
SelectionManager.proxyMethod("locationMapper.findNodeAndOffsetFromLocation");
SelectionManager.proxyMethod("pointMapper.createDOMRangeFromPoint");
SelectionManager.proxyMethod("pointMapper.getClientRectsForDOMRange");

var models = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Block: Block,
  Composition: Composition,
  Document: Document,
  Editor: Editor,
  HTMLParser: HTMLParser,
  HTMLSanitizer: HTMLSanitizer,
  LineBreakInsertion: LineBreakInsertion,
  LocationMapper: LocationMapper,
  Piece: Piece,
  PointMapper: PointMapper,
  SelectionManager: SelectionManager,
  SplittableList: SplittableList,
  StringPiece: StringPiece,
  Text: Text,
  UndoManager: UndoManager
});

var views = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ObjectView: ObjectView,
  BlockView: BlockView,
  DocumentView: DocumentView,
  PieceView: PieceView,
  TextView: TextView
});

class CompositionController extends BasicObject {
  constructor(element, composition) {
    super(...arguments);
    this.didFocus = this.didFocus.bind(this);
    this.didBlur = this.didBlur.bind(this);
    this.element = element;
    this.composition = composition;
    this.documentView = new DocumentView(this.composition.document, {
      element: this.element
    });
    handleEvent("focus", {
      onElement: this.element,
      withCallback: this.didFocus
    });
    handleEvent("blur", {
      onElement: this.element,
      withCallback: this.didBlur
    });
    handleEvent("click", {
      onElement: this.element,
      matchingSelector: "a[contenteditable=false]",
      preventDefault: true
    });
  }

  didFocus(event) {
    var _this$blurPromise;

    const perform = () => {
      if (!this.focused) {
        var _this$delegate, _this$delegate$compos;

        this.focused = true;
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$compos = _this$delegate.compositionControllerDidFocus) === null || _this$delegate$compos === void 0 ? void 0 : _this$delegate$compos.call(_this$delegate);
      }
    };

    return ((_this$blurPromise = this.blurPromise) === null || _this$blurPromise === void 0 ? void 0 : _this$blurPromise.then(perform)) || perform();
  }

  didBlur(event) {
    this.blurPromise = new Promise(resolve => {
      return defer(() => {
        if (!innerElementIsActive(this.element)) {
          var _this$delegate2, _this$delegate2$compo;

          this.focused = null;
          (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : (_this$delegate2$compo = _this$delegate2.compositionControllerDidBlur) === null || _this$delegate2$compo === void 0 ? void 0 : _this$delegate2$compo.call(_this$delegate2);
        }

        this.blurPromise = null;
        return resolve();
      });
    });
  }

  getSerializableElement() {
    return this.element;
  }

  render() {
    var _this$delegate5, _this$delegate5$compo;

    if (this.revision !== this.composition.revision) {
      this.documentView.setDocument(this.composition.document);
      this.documentView.render();
      this.revision = this.composition.revision;
    }

    if (this.canSyncDocumentView() && !this.documentView.isSynced()) {
      var _this$delegate3, _this$delegate3$compo, _this$delegate4, _this$delegate4$compo;

      (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : (_this$delegate3$compo = _this$delegate3.compositionControllerWillSyncDocumentView) === null || _this$delegate3$compo === void 0 ? void 0 : _this$delegate3$compo.call(_this$delegate3);
      this.documentView.sync();
      (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : (_this$delegate4$compo = _this$delegate4.compositionControllerDidSyncDocumentView) === null || _this$delegate4$compo === void 0 ? void 0 : _this$delegate4$compo.call(_this$delegate4);
    }

    return (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : (_this$delegate5$compo = _this$delegate5.compositionControllerDidRender) === null || _this$delegate5$compo === void 0 ? void 0 : _this$delegate5$compo.call(_this$delegate5);
  }

  rerenderViewForObject(object) {
    this.invalidateViewForObject(object);
    return this.render();
  }

  invalidateViewForObject(object) {
    return this.documentView.invalidateViewForObject(object);
  }

  isViewCachingEnabled() {
    return this.documentView.isViewCachingEnabled();
  }

  enableViewCaching() {
    return this.documentView.enableViewCaching();
  }

  disableViewCaching() {
    return this.documentView.disableViewCaching();
  }

  refreshViewCache() {
    return this.documentView.garbageCollectCachedViews();
  } // Private


  canSyncDocumentView() {
    return true;
  }

}

class Controller extends BasicObject {}

const mutableAttributeName = "data-rico-mutable";
const mutableSelector = "[".concat(mutableAttributeName, "]");
const options = {
  attributes: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  subtree: true
};
class MutationObserver extends BasicObject {
  constructor(element) {
    super(element);
    this.didMutate = this.didMutate.bind(this);
    this.element = element;
    this.observer = new window.MutationObserver(this.didMutate);
    this.start();
  }

  start() {
    this.reset();
    return this.observer.observe(this.element, options);
  }

  stop() {
    return this.observer.disconnect();
  }

  didMutate(mutations) {
    this.mutations.push(...Array.from(this.findSignificantMutations(mutations) || []));

    if (this.mutations.length) {
      var _this$delegate, _this$delegate$elemen;

      (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$elemen = _this$delegate.elementDidMutate) === null || _this$delegate$elemen === void 0 ? void 0 : _this$delegate$elemen.call(_this$delegate, this.getMutationSummary());
      return this.reset();
    }
  } // Private


  reset() {
    this.mutations = [];
  }

  findSignificantMutations(mutations) {
    return mutations.filter(mutation => {
      return this.mutationIsSignificant(mutation);
    });
  }

  mutationIsSignificant(mutation) {
    if (this.nodeIsMutable(mutation.target)) {
      return false;
    }

    for (const node of Array.from(this.nodesModifiedByMutation(mutation))) {
      if (this.nodeIsSignificant(node)) return true;
    }

    return false;
  }

  nodeIsSignificant(node) {
    return node !== this.element && !this.nodeIsMutable(node) && !nodeIsEmptyTextNode(node);
  }

  nodeIsMutable(node) {
    return findClosestElementFromNode(node, {
      matchingSelector: mutableSelector
    });
  }

  nodesModifiedByMutation(mutation) {
    const nodes = [];

    switch (mutation.type) {
      case "attributes":
        if (mutation.attributeName !== mutableAttributeName) {
          nodes.push(mutation.target);
        }

        break;

      case "characterData":
        // Changes to text nodes should consider the parent element
        nodes.push(mutation.target.parentNode);
        nodes.push(mutation.target);
        break;

      case "childList":
        // Consider each added or removed node
        nodes.push(...Array.from(mutation.addedNodes || []));
        nodes.push(...Array.from(mutation.removedNodes || []));
        break;
    }

    return nodes;
  }

  getMutationSummary() {
    return this.getTextMutationSummary();
  }

  getTextMutationSummary() {
    const {
      additions,
      deletions
    } = this.getTextChangesFromCharacterData();
    const textChanges = this.getTextChangesFromChildList();
    Array.from(textChanges.additions).forEach(addition => {
      if (!Array.from(additions).includes(addition)) {
        additions.push(addition);
      }
    });
    deletions.push(...Array.from(textChanges.deletions || []));
    const summary = {};
    const added = additions.join("");

    if (added) {
      summary.textAdded = added;
    }

    const deleted = deletions.join("");

    if (deleted) {
      summary.textDeleted = deleted;
    }

    return summary;
  }

  getMutationsByType(type) {
    return Array.from(this.mutations).filter(mutation => mutation.type === type);
  }

  getTextChangesFromChildList() {
    let textAdded, textRemoved;
    const addedNodes = [];
    const removedNodes = [];
    Array.from(this.getMutationsByType("childList")).forEach(mutation => {
      addedNodes.push(...Array.from(mutation.addedNodes || []));
      removedNodes.push(...Array.from(mutation.removedNodes || []));
    });
    const singleBlockCommentRemoved = addedNodes.length === 0 && removedNodes.length === 1 && nodeIsBlockStartComment(removedNodes[0]);

    if (singleBlockCommentRemoved) {
      textAdded = [];
      textRemoved = ["\n"];
    } else {
      textAdded = getTextForNodes(addedNodes);
      textRemoved = getTextForNodes(removedNodes);
    }

    const additions = textAdded.filter((text, index) => text !== textRemoved[index]).map(normalizeSpaces);
    const deletions = textRemoved.filter((text, index) => text !== textAdded[index]).map(normalizeSpaces);
    return {
      additions,
      deletions
    };
  }

  getTextChangesFromCharacterData() {
    let added, removed;
    const characterMutations = this.getMutationsByType("characterData");

    if (characterMutations.length) {
      const startMutation = characterMutations[0],
            endMutation = characterMutations[characterMutations.length - 1];
      const oldString = normalizeSpaces(startMutation.oldValue);
      const newString = normalizeSpaces(endMutation.target.data);
      const summarized = summarizeStringChange(oldString, newString);
      added = summarized.added;
      removed = summarized.removed;
    }

    return {
      additions: added ? [added] : [],
      deletions: removed ? [removed] : []
    };
  }

}

const getTextForNodes = function () {
  let nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const text = [];

  for (const node of Array.from(nodes)) {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        text.push(node.data);
        break;

      case Node.ELEMENT_NODE:
        if (tagName(node) === "br") {
          text.push("\n");
        } else {
          text.push(...Array.from(getTextForNodes(node.childNodes) || []));
        }

        break;
    }
  }

  return text;
};

// This class detects when some buggy events are being emitted and lets know the input controller
// that they should be ignored.

class FlakyAndroidKeyboardDetector {
  constructor(element) {
    this.element = element;
  }

  shouldIgnore(event) {
    if (!browser.samsungAndroid) return false;
    this.previousEvent = this.event;
    this.event = event;
    this.checkSamsungKeyboardBuggyModeStart();
    this.checkSamsungKeyboardBuggyModeEnd();
    return this.buggyMode;
  } // private
  // The Samsung keyboard on Android can enter a buggy state in which it emits a flurry of confused events that,
  // if processed, corrupts the editor. The buggy mode always starts with an insertText event, right after a
  // keydown event with for an "Unidentified" key, with the same text as the editor element, except for a few
  // extra whitespace, or exotic utf8, characters.


  checkSamsungKeyboardBuggyModeStart() {
    if (this.insertingLongTextAfterUnidentifiedChar() && differsInWhitespace(this.element.innerText, this.event.data)) {
      this.buggyMode = true;
      this.event.preventDefault();
    }
  } // The flurry of buggy events are always insertText. If we see any other type, it means it's over.


  checkSamsungKeyboardBuggyModeEnd() {
    if (this.buggyMode && this.event.inputType !== "insertText") {
      this.buggyMode = false;
    }
  }

  insertingLongTextAfterUnidentifiedChar() {
    var _this$event$data;

    return this.isBeforeInputInsertText() && this.previousEventWasUnidentifiedKeydown() && ((_this$event$data = this.event.data) === null || _this$event$data === void 0 ? void 0 : _this$event$data.length) > 50;
  }

  isBeforeInputInsertText() {
    return this.event.type === "beforeinput" && this.event.inputType === "insertText";
  }

  previousEventWasUnidentifiedKeydown() {
    var _this$previousEvent, _this$previousEvent2;

    return ((_this$previousEvent = this.previousEvent) === null || _this$previousEvent === void 0 ? void 0 : _this$previousEvent.type) === "keydown" && ((_this$previousEvent2 = this.previousEvent) === null || _this$previousEvent2 === void 0 ? void 0 : _this$previousEvent2.key) === "Unidentified";
  }

}

const differsInWhitespace = (text1, text2) => {
  return normalize(text1) === normalize(text2);
};

const whiteSpaceNormalizerRegexp = new RegExp("(".concat(OBJECT_REPLACEMENT_CHARACTER, "|").concat(ZERO_WIDTH_SPACE, "|").concat(NON_BREAKING_SPACE, "|\\s)+"), "g");

const normalize = text => text.replace(whiteSpaceNormalizerRegexp, " ").trim();

class InputController extends BasicObject {
  constructor(element) {
    super(...arguments);
    this.element = element;
    this.mutationObserver = new MutationObserver(this.element);
    this.mutationObserver.delegate = this;
    this.flakyKeyboardDetector = new FlakyAndroidKeyboardDetector(this.element);

    for (const eventName in this.constructor.events) {
      handleEvent(eventName, {
        onElement: this.element,
        withCallback: this.handlerFor(eventName)
      });
    }
  }

  elementDidMutate(mutationSummary) {}

  editorWillSyncDocumentView() {
    return this.mutationObserver.stop();
  }

  editorDidSyncDocumentView() {
    return this.mutationObserver.start();
  }

  requestRender() {
    var _this$delegate, _this$delegate$inputC;

    return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$inputC = _this$delegate.inputControllerDidRequestRender) === null || _this$delegate$inputC === void 0 ? void 0 : _this$delegate$inputC.call(_this$delegate);
  }

  requestReparse() {
    var _this$delegate2, _this$delegate2$input;

    (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : (_this$delegate2$input = _this$delegate2.inputControllerDidRequestReparse) === null || _this$delegate2$input === void 0 ? void 0 : _this$delegate2$input.call(_this$delegate2);
    return this.requestRender();
  } // Private


  handlerFor(eventName) {
    return event => {
      if (!event.defaultPrevented) {
        this.handleInput(() => {
          if (!innerElementIsActive(this.element)) {
            if (this.flakyKeyboardDetector.shouldIgnore(event)) return;
            this.eventName = eventName;
            this.constructor.events[eventName].call(this, event);
          }
        });
      }
    };
  }

  handleInput(callback) {
    try {
      var _this$delegate3;

      (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : _this$delegate3.inputControllerWillHandleInput();
      callback.call(this);
    } finally {
      var _this$delegate4;

      (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.inputControllerDidHandleInput();
    }
  }

  createLinkHTML(href, text) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text ? text : href;
    return link.outerHTML;
  }

}

_defineProperty(InputController, "events", {});

class Level2InputController extends InputController {
  constructor() {
    super(...arguments);
    this.render = this.render.bind(this);
  }

  elementDidMutate() {
    if (this.scheduledRender) {
      if (this.composing) {
        var _this$delegate, _this$delegate$inputC;

        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$inputC = _this$delegate.inputControllerDidAllowUnhandledInput) === null || _this$delegate$inputC === void 0 ? void 0 : _this$delegate$inputC.call(_this$delegate);
      }
    } else {
      return this.reparse();
    }
  }

  scheduleRender() {
    return this.scheduledRender ? this.scheduledRender : this.scheduledRender = requestAnimationFrame(this.render);
  }

  render() {
    var _this$afterRender;

    cancelAnimationFrame(this.scheduledRender);
    this.scheduledRender = null;

    if (!this.composing) {
      var _this$delegate2;

      (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : _this$delegate2.render();
    }

    (_this$afterRender = this.afterRender) === null || _this$afterRender === void 0 ? void 0 : _this$afterRender.call(this);
    this.afterRender = null;
  }

  reparse() {
    var _this$delegate3;

    return (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : _this$delegate3.reparse();
  } // Responder helpers


  insertString() {
    var _this$delegate4;

    let string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    let options = arguments.length > 1 ? arguments[1] : undefined;
    (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.inputControllerWillPerformTyping();
    return this.withTargetDOMRange(function () {
      var _this$responder;

      return (_this$responder = this.responder) === null || _this$responder === void 0 ? void 0 : _this$responder.insertString(string, options);
    });
  }

  toggleAttributeIfSupported(attributeName) {
    if (getAllAttributeNames().includes(attributeName)) {
      var _this$delegate5;

      (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : _this$delegate5.inputControllerWillPerformFormatting(attributeName);
      return this.withTargetDOMRange(function () {
        var _this$responder2;

        return (_this$responder2 = this.responder) === null || _this$responder2 === void 0 ? void 0 : _this$responder2.toggleCurrentAttribute(attributeName);
      });
    }
  }

  activateAttributeIfSupported(attributeName, value) {
    if (getAllAttributeNames().includes(attributeName)) {
      var _this$delegate6;

      (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : _this$delegate6.inputControllerWillPerformFormatting(attributeName);
      return this.withTargetDOMRange(function () {
        var _this$responder3;

        return (_this$responder3 = this.responder) === null || _this$responder3 === void 0 ? void 0 : _this$responder3.setCurrentAttribute(attributeName, value);
      });
    }
  }

  deleteInDirection(direction) {
    let {
      recordUndoEntry
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      recordUndoEntry: true
    };

    if (recordUndoEntry) {
      var _this$delegate7;

      (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 ? void 0 : _this$delegate7.inputControllerWillPerformTyping();
    }

    const perform = () => {
      var _this$responder4;

      return (_this$responder4 = this.responder) === null || _this$responder4 === void 0 ? void 0 : _this$responder4.deleteInDirection(direction);
    };

    const domRange = this.getTargetDOMRange({
      minLength: 2
    });

    if (domRange) {
      return this.withTargetDOMRange(domRange, perform);
    } else {
      return perform();
    }
  } // Selection helpers


  withTargetDOMRange(domRange, fn) {
    if (typeof domRange === "function") {
      fn = domRange;
      domRange = this.getTargetDOMRange();
    }

    if (domRange) {
      var _this$responder5;

      return (_this$responder5 = this.responder) === null || _this$responder5 === void 0 ? void 0 : _this$responder5.withTargetDOMRange(domRange, fn.bind(this));
    } else {
      selectionChangeObserver.reset();
      return fn.call(this);
    }
  }

  getTargetDOMRange() {
    var _this$event$getTarget, _this$event;

    let {
      minLength
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      minLength: 0
    };
    const targetRanges = (_this$event$getTarget = (_this$event = this.event).getTargetRanges) === null || _this$event$getTarget === void 0 ? void 0 : _this$event$getTarget.call(_this$event);

    if (targetRanges) {
      if (targetRanges.length) {
        const domRange = staticRangeToRange(targetRanges[0]);

        if (minLength === 0 || domRange.toString().length >= minLength) {
          return domRange;
        }
      }
    }
  }

  withEvent(event, fn) {
    let result;
    this.event = event;

    try {
      result = fn.call(this);
    } finally {
      this.event = null;
    }

    return result;
  }

}

_defineProperty(Level2InputController, "events", {
  keydown(event) {
    if (keyEventIsKeyboardCommand(event)) {
      var _this$delegate8;

      const command = keyboardCommandFromKeyEvent(event);

      if ((_this$delegate8 = this.delegate) !== null && _this$delegate8 !== void 0 && _this$delegate8.inputControllerDidReceiveKeyboardCommand(command)) {
        event.preventDefault();
      }
    } else {
      let name = event.key;

      if (event.altKey) {
        name += "+Alt";
      }

      if (event.shiftKey) {
        name += "+Shift";
      }

      const handler = this.constructor.keys[name];

      if (handler) {
        return this.withEvent(event, handler);
      }
    }
  },

  // Handle paste event to work around beforeinput.insertFromPaste browser bugs.
  // Safe to remove each condition once fixed upstream.
  paste(event) {
    var _event$clipboardData;

    // https://bugs.webkit.org/show_bug.cgi?id=194921
    let paste;
    const href = (_event$clipboardData = event.clipboardData) === null || _event$clipboardData === void 0 ? void 0 : _event$clipboardData.getData("URL");

    if (pasteEventHasPlainTextOnly(event)) {
      var _this$delegate9, _this$responder6, _this$delegate10;

      event.preventDefault();
      paste = {
        type: "text/plain",
        string: event.clipboardData.getData("text/plain")
      };
      (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 ? void 0 : _this$delegate9.inputControllerWillPaste(paste);
      (_this$responder6 = this.responder) === null || _this$responder6 === void 0 ? void 0 : _this$responder6.insertString(paste.string);
      this.render();
      return (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 ? void 0 : _this$delegate10.inputControllerDidPaste(paste); // https://bugs.webkit.org/show_bug.cgi?id=196702
    } else if (href) {
      var _this$delegate11, _this$responder7, _this$delegate12;

      event.preventDefault();
      paste = {
        type: "text/html",
        html: this.createLinkHTML(href)
      };
      (_this$delegate11 = this.delegate) === null || _this$delegate11 === void 0 ? void 0 : _this$delegate11.inputControllerWillPaste(paste);
      (_this$responder7 = this.responder) === null || _this$responder7 === void 0 ? void 0 : _this$responder7.insertHTML(paste.html);
      this.render();
      return (_this$delegate12 = this.delegate) === null || _this$delegate12 === void 0 ? void 0 : _this$delegate12.inputControllerDidPaste(paste);
    }
  },

  beforeinput(event) {
    const handler = this.constructor.inputTypes[event.inputType];

    if (handler) {
      this.withEvent(event, handler);
      this.scheduleRender();
    }
  },

  input(event) {
    selectionChangeObserver.reset();
  },

  compositionend(event) {
    if (this.composing) {
      this.composing = false;
      if (!browser.recentAndroid) this.scheduleRender();
    }
  }

});

_defineProperty(Level2InputController, "keys", {
  Backspace() {
    var _this$responder8;

    if ((_this$responder8 = this.responder) !== null && _this$responder8 !== void 0 && _this$responder8.shouldManageDeletingInDirection("backward")) {
      var _this$delegate13, _this$responder9;

      this.event.preventDefault();
      (_this$delegate13 = this.delegate) === null || _this$delegate13 === void 0 ? void 0 : _this$delegate13.inputControllerWillPerformTyping();
      (_this$responder9 = this.responder) === null || _this$responder9 === void 0 ? void 0 : _this$responder9.deleteInDirection("backward");
      return this.render();
    }
  },

  Tab() {
    var _this$responder10;

    if ((_this$responder10 = this.responder) !== null && _this$responder10 !== void 0 && _this$responder10.canIncreaseNestingLevel()) {
      var _this$responder11;

      this.event.preventDefault();
      (_this$responder11 = this.responder) === null || _this$responder11 === void 0 ? void 0 : _this$responder11.increaseNestingLevel();
      return this.render();
    }
  },

  "Enter+Shift"() {
    this.event.preventDefault();
    this.insertString("\n");
    this.scheduleRender();
  },

  "Tab+Shift"() {
    var _this$responder12;

    if ((_this$responder12 = this.responder) !== null && _this$responder12 !== void 0 && _this$responder12.canDecreaseNestingLevel()) {
      var _this$responder13;

      this.event.preventDefault();
      (_this$responder13 = this.responder) === null || _this$responder13 === void 0 ? void 0 : _this$responder13.decreaseNestingLevel();
      return this.render();
    }
  }

});

_defineProperty(Level2InputController, "inputTypes", {
  deleteByComposition() {
    return this.deleteInDirection("backward", {
      recordUndoEntry: false
    });
  },

  deleteByCut() {
    return this.deleteInDirection("backward");
  },

  deleteByDrag() {
    this.event.preventDefault();
    return this.withTargetDOMRange(function () {
      var _this$responder14;

      this.deleteByDragRange = (_this$responder14 = this.responder) === null || _this$responder14 === void 0 ? void 0 : _this$responder14.getSelectedRange();
    });
  },

  deleteCompositionText() {
    return this.deleteInDirection("backward", {
      recordUndoEntry: false
    });
  },

  deleteContent() {
    return this.deleteInDirection("backward");
  },

  deleteContentBackward() {
    return this.deleteInDirection("backward");
  },

  deleteContentForward() {
    return this.deleteInDirection("forward");
  },

  deleteEntireSoftLine() {
    return this.deleteInDirection("forward");
  },

  deleteHardLineBackward() {
    return this.deleteInDirection("backward");
  },

  deleteHardLineForward() {
    return this.deleteInDirection("forward");
  },

  deleteSoftLineBackward() {
    return this.deleteInDirection("backward");
  },

  deleteSoftLineForward() {
    return this.deleteInDirection("forward");
  },

  deleteWordBackward() {
    return this.deleteInDirection("backward");
  },

  deleteWordForward() {
    return this.deleteInDirection("forward");
  },

  formatBackColor() {
    return this.activateAttributeIfSupported("backgroundColor", this.event.data);
  },

  formatBold() {
    return this.toggleAttributeIfSupported("bold");
  },

  formatFontColor() {
    return this.activateAttributeIfSupported("color", this.event.data);
  },

  formatFontName() {
    return this.activateAttributeIfSupported("font", this.event.data);
  },

  formatIndent() {
    var _this$responder15;

    if ((_this$responder15 = this.responder) !== null && _this$responder15 !== void 0 && _this$responder15.canIncreaseNestingLevel()) {
      return this.withTargetDOMRange(function () {
        var _this$responder16;

        return (_this$responder16 = this.responder) === null || _this$responder16 === void 0 ? void 0 : _this$responder16.increaseNestingLevel();
      });
    }
  },

  formatItalic() {
    return this.toggleAttributeIfSupported("italic");
  },

  formatJustifyCenter() {
    return this.toggleAttributeIfSupported("justifyCenter");
  },

  formatJustifyFull() {
    return this.toggleAttributeIfSupported("justifyFull");
  },

  formatJustifyLeft() {
    return this.toggleAttributeIfSupported("justifyLeft");
  },

  formatJustifyRight() {
    return this.toggleAttributeIfSupported("justifyRight");
  },

  formatOutdent() {
    var _this$responder17;

    if ((_this$responder17 = this.responder) !== null && _this$responder17 !== void 0 && _this$responder17.canDecreaseNestingLevel()) {
      return this.withTargetDOMRange(function () {
        var _this$responder18;

        return (_this$responder18 = this.responder) === null || _this$responder18 === void 0 ? void 0 : _this$responder18.decreaseNestingLevel();
      });
    }
  },

  formatRemove() {
    this.withTargetDOMRange(function () {
      for (const attributeName in (_this$responder19 = this.responder) === null || _this$responder19 === void 0 ? void 0 : _this$responder19.getCurrentAttributes()) {
        var _this$responder19, _this$responder20;

        (_this$responder20 = this.responder) === null || _this$responder20 === void 0 ? void 0 : _this$responder20.removeCurrentAttribute(attributeName);
      }
    });
  },

  formatSetBlockTextDirection() {
    return this.activateAttributeIfSupported("blockDir", this.event.data);
  },

  formatSetInlineTextDirection() {
    return this.activateAttributeIfSupported("textDir", this.event.data);
  },

  formatStrikeThrough() {
    return this.toggleAttributeIfSupported("strike");
  },

  formatSubscript() {
    return this.toggleAttributeIfSupported("sub");
  },

  formatSuperscript() {
    return this.toggleAttributeIfSupported("sup");
  },

  formatUnderline() {
    return this.toggleAttributeIfSupported("underline");
  },

  historyRedo() {
    var _this$delegate14;

    return (_this$delegate14 = this.delegate) === null || _this$delegate14 === void 0 ? void 0 : _this$delegate14.inputControllerWillPerformRedo();
  },

  historyUndo() {
    var _this$delegate15;

    return (_this$delegate15 = this.delegate) === null || _this$delegate15 === void 0 ? void 0 : _this$delegate15.inputControllerWillPerformUndo();
  },

  insertCompositionText() {
    this.composing = true;
    return this.insertString(this.event.data);
  },

  insertFromComposition() {
    this.composing = false;
    return this.insertString(this.event.data);
  },

  insertFromDrop() {
    const range = this.deleteByDragRange;

    if (range) {
      var _this$delegate16;

      this.deleteByDragRange = null;
      (_this$delegate16 = this.delegate) === null || _this$delegate16 === void 0 ? void 0 : _this$delegate16.inputControllerWillMoveText();
      return this.withTargetDOMRange(function () {
        var _this$responder21;

        return (_this$responder21 = this.responder) === null || _this$responder21 === void 0 ? void 0 : _this$responder21.moveTextFromRange(range);
      });
    }
  },

  insertFromPaste() {
    const {
      dataTransfer
    } = this.event;
    const paste = {
      dataTransfer
    };
    const href = dataTransfer.getData("URL");
    const html = dataTransfer.getData("text/html");

    if (href) {
      var _this$delegate17;

      let string;
      this.event.preventDefault();
      paste.type = "text/html";
      const name = dataTransfer.getData("public.url-name");

      if (name) {
        string = squishBreakableWhitespace(name).trim();
      } else {
        string = href;
      }

      paste.html = this.createLinkHTML(href, string);
      (_this$delegate17 = this.delegate) === null || _this$delegate17 === void 0 ? void 0 : _this$delegate17.inputControllerWillPaste(paste);
      this.withTargetDOMRange(function () {
        var _this$responder22;

        return (_this$responder22 = this.responder) === null || _this$responder22 === void 0 ? void 0 : _this$responder22.insertHTML(paste.html);
      });

      this.afterRender = () => {
        var _this$delegate18;

        return (_this$delegate18 = this.delegate) === null || _this$delegate18 === void 0 ? void 0 : _this$delegate18.inputControllerDidPaste(paste);
      };
    } else if (dataTransferIsPlainText(dataTransfer)) {
      var _this$delegate19;

      paste.type = "text/plain";
      paste.string = dataTransfer.getData("text/plain");
      (_this$delegate19 = this.delegate) === null || _this$delegate19 === void 0 ? void 0 : _this$delegate19.inputControllerWillPaste(paste);
      this.withTargetDOMRange(function () {
        var _this$responder23;

        return (_this$responder23 = this.responder) === null || _this$responder23 === void 0 ? void 0 : _this$responder23.insertString(paste.string);
      });

      this.afterRender = () => {
        var _this$delegate20;

        return (_this$delegate20 = this.delegate) === null || _this$delegate20 === void 0 ? void 0 : _this$delegate20.inputControllerDidPaste(paste);
      };
    } else if (html) {
      var _this$delegate21;

      this.event.preventDefault();
      paste.type = "text/html";
      paste.html = html;
      (_this$delegate21 = this.delegate) === null || _this$delegate21 === void 0 ? void 0 : _this$delegate21.inputControllerWillPaste(paste);
      this.withTargetDOMRange(function () {
        var _this$responder24;

        return (_this$responder24 = this.responder) === null || _this$responder24 === void 0 ? void 0 : _this$responder24.insertHTML(paste.html);
      });

      this.afterRender = () => {
        var _this$delegate22;

        return (_this$delegate22 = this.delegate) === null || _this$delegate22 === void 0 ? void 0 : _this$delegate22.inputControllerDidPaste(paste);
      };
    }
  },

  insertFromYank() {
    return this.insertString(this.event.data);
  },

  insertLineBreak() {
    return this.insertString("\n");
  },

  insertLink() {
    return this.activateAttributeIfSupported("href", this.event.data);
  },

  insertOrderedList() {
    return this.toggleAttributeIfSupported("number");
  },

  insertParagraph() {
    var _this$delegate23;

    (_this$delegate23 = this.delegate) === null || _this$delegate23 === void 0 ? void 0 : _this$delegate23.inputControllerWillPerformTyping();
    return this.withTargetDOMRange(function () {
      var _this$responder25;

      return (_this$responder25 = this.responder) === null || _this$responder25 === void 0 ? void 0 : _this$responder25.insertLineBreak();
    });
  },

  insertReplacementText() {
    const replacement = this.event.dataTransfer.getData("text/plain");
    const domRange = this.event.getTargetRanges()[0];
    this.withTargetDOMRange(domRange, () => {
      this.insertString(replacement, {
        updatePosition: false
      });
    });
  },

  insertText() {
    var _this$event$dataTrans;

    return this.insertString(this.event.data || ((_this$event$dataTrans = this.event.dataTransfer) === null || _this$event$dataTrans === void 0 ? void 0 : _this$event$dataTrans.getData("text/plain")));
  },

  insertTranspose() {
    return this.insertString(this.event.data);
  },

  insertUnorderedList() {
    return this.toggleAttributeIfSupported("bullet");
  }

});

const staticRangeToRange = function (staticRange) {
  const range = document.createRange();
  range.setStart(staticRange.startContainer, staticRange.startOffset);
  range.setEnd(staticRange.endContainer, staticRange.endOffset);
  return range;
}; // Event helpers


const pasteEventHasPlainTextOnly = function (event) {
  const clipboard = event.clipboardData;

  if (clipboard) {
    return clipboard.types.includes("text/plain") && clipboard.types.length === 1;
  }
};

const keyboardCommandFromKeyEvent = function (event) {
  const command = [];

  if (event.altKey) {
    command.push("alt");
  }

  if (event.shiftKey) {
    command.push("shift");
  }

  command.push(event.key);
  return command;
};

const attributeButtonSelector = "[data-rico-attribute]";
const actionButtonSelector = "[data-rico-action]";
const toolbarButtonSelector = "".concat(attributeButtonSelector, ", ").concat(actionButtonSelector);
const dialogSelector = "[data-rico-dialog]";
const activeDialogSelector = "".concat(dialogSelector, "[data-rico-active]");
const dialogButtonSelector = "".concat(dialogSelector, " [data-rico-method]");
const dialogInputSelector = "".concat(dialogSelector, " [data-rico-input]");

const getInputForDialog = (element, attributeName) => {
  if (!attributeName) {
    attributeName = getAttributeName(element);
  }

  return element.querySelector("[data-rico-input][name='".concat(attributeName, "']"));
};

const getActionName = element => element.getAttribute("data-rico-action");

const getAttributeName = element => {
  return element.getAttribute("data-rico-attribute") || element.getAttribute("data-rico-dialog-attribute");
};

const getDialogName = element => element.getAttribute("data-rico-dialog");

class ToolbarController extends BasicObject {
  constructor(element) {
    super(element);
    this.didClickActionButton = this.didClickActionButton.bind(this);
    this.didClickAttributeButton = this.didClickAttributeButton.bind(this);
    this.didClickDialogButton = this.didClickDialogButton.bind(this);
    this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this);
    this.element = element;
    this.attributes = {};
    this.actions = {};
    this.resetDialogInputs();
    handleEvent("mousedown", {
      onElement: this.element,
      matchingSelector: actionButtonSelector,
      withCallback: this.didClickActionButton
    });
    handleEvent("mousedown", {
      onElement: this.element,
      matchingSelector: attributeButtonSelector,
      withCallback: this.didClickAttributeButton
    });
    handleEvent("click", {
      onElement: this.element,
      matchingSelector: toolbarButtonSelector,
      preventDefault: true
    });
    handleEvent("click", {
      onElement: this.element,
      matchingSelector: dialogButtonSelector,
      withCallback: this.didClickDialogButton
    });
    handleEvent("keydown", {
      onElement: this.element,
      matchingSelector: dialogInputSelector,
      withCallback: this.didKeyDownDialogInput
    });
  } // Event handlers


  didClickActionButton(event, element) {
    var _this$delegate;

    (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : _this$delegate.toolbarDidClickButton();
    event.preventDefault();
    const actionName = getActionName(element);

    if (this.getDialog(actionName)) {
      return this.toggleDialog(actionName);
    } else {
      var _this$delegate2;

      return (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : _this$delegate2.toolbarDidInvokeAction(actionName, element);
    }
  }

  didClickAttributeButton(event, element) {
    var _this$delegate3;

    (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : _this$delegate3.toolbarDidClickButton();
    event.preventDefault();
    const attributeName = getAttributeName(element);

    if (this.getDialog(attributeName)) {
      this.toggleDialog(attributeName);
    } else {
      var _this$delegate4;

      (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.toolbarDidToggleAttribute(attributeName);
    }

    return this.refreshAttributeButtons();
  }

  didClickDialogButton(event, element) {
    const dialogElement = findClosestElementFromNode(element, {
      matchingSelector: dialogSelector
    });
    const method = element.getAttribute("data-rico-method");
    return this[method].call(this, dialogElement);
  }

  didKeyDownDialogInput(event, element) {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      const attribute = element.getAttribute("name");
      const dialog = this.getDialog(attribute);
      this.setAttribute(dialog);
    }

    if (event.keyCode === 27) {
      // Escape key
      event.preventDefault();
      return this.hideDialog();
    }
  } // Action buttons


  updateActions(actions) {
    this.actions = actions;
    return this.refreshActionButtons();
  }

  refreshActionButtons() {
    return this.eachActionButton((element, actionName) => {
      element.disabled = this.actions[actionName] === false;
    });
  }

  eachActionButton(callback) {
    return Array.from(this.element.querySelectorAll(actionButtonSelector)).map(element => callback(element, getActionName(element)));
  } // Attribute buttons


  updateAttributes(attributes) {
    this.attributes = attributes;
    return this.refreshAttributeButtons();
  }

  refreshAttributeButtons() {
    return this.eachAttributeButton((element, attributeName) => {
      element.disabled = this.attributes[attributeName] === false;

      if (this.attributes[attributeName] || this.dialogIsVisible(attributeName)) {
        element.setAttribute("data-rico-active", "");
        return element.classList.add("rico-active");
      } else {
        element.removeAttribute("data-rico-active");
        return element.classList.remove("rico-active");
      }
    });
  }

  eachAttributeButton(callback) {
    return Array.from(this.element.querySelectorAll(attributeButtonSelector)).map(element => callback(element, getAttributeName(element)));
  }

  applyKeyboardCommand(keys) {
    const keyString = JSON.stringify(keys.sort());

    for (const button of Array.from(this.element.querySelectorAll("[data-rico-key]"))) {
      const buttonKeys = button.getAttribute("data-rico-key").split("+");
      const buttonKeyString = JSON.stringify(buttonKeys.sort());

      if (buttonKeyString === keyString) {
        triggerEvent("mousedown", {
          onElement: button
        });
        return true;
      }
    }

    return false;
  } // Dialogs


  dialogIsVisible(dialogName) {
    const element = this.getDialog(dialogName);

    if (element) {
      return element.hasAttribute("data-rico-active");
    }
  }

  toggleDialog(dialogName) {
    if (this.dialogIsVisible(dialogName)) {
      return this.hideDialog();
    } else {
      return this.showDialog(dialogName);
    }
  }

  showDialog(dialogName) {
    var _this$delegate5, _this$delegate6;

    this.hideDialog();
    (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : _this$delegate5.toolbarWillShowDialog();
    const element = this.getDialog(dialogName);
    element.setAttribute("data-rico-active", "");
    element.classList.add("rico-active");
    Array.from(element.querySelectorAll("input[disabled]")).forEach(disabledInput => {
      disabledInput.removeAttribute("disabled");
    });
    const attributeName = getAttributeName(element);

    if (attributeName) {
      const input = getInputForDialog(element, dialogName);

      if (input) {
        input.value = this.attributes[attributeName] || "";
        input.select();
      }
    }

    return (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : _this$delegate6.toolbarDidShowDialog(dialogName);
  }

  setAttribute(dialogElement) {
    const attributeName = getAttributeName(dialogElement);
    const input = getInputForDialog(dialogElement, attributeName);

    if (input.willValidate && !input.checkValidity()) {
      input.setAttribute("data-rico-validate", "");
      input.classList.add("rico-validate");
      return input.focus();
    } else {
      var _this$delegate7;

      (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 ? void 0 : _this$delegate7.toolbarDidUpdateAttribute(attributeName, input.value);
      return this.hideDialog();
    }
  }

  removeAttribute(dialogElement) {
    var _this$delegate8;

    const attributeName = getAttributeName(dialogElement);
    (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 ? void 0 : _this$delegate8.toolbarDidRemoveAttribute(attributeName);
    return this.hideDialog();
  }

  hideDialog() {
    const element = this.element.querySelector(activeDialogSelector);

    if (element) {
      var _this$delegate9;

      element.removeAttribute("data-rico-active");
      element.classList.remove("rico-active");
      this.resetDialogInputs();
      return (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 ? void 0 : _this$delegate9.toolbarDidHideDialog(getDialogName(element));
    }
  }

  resetDialogInputs() {
    Array.from(this.element.querySelectorAll(dialogInputSelector)).forEach(input => {
      input.setAttribute("disabled", "disabled");
      input.removeAttribute("data-rico-validate");
      input.classList.remove("rico-validate");
    });
  }

  getDialog(dialogName) {
    return this.element.querySelector("[data-rico-dialog=".concat(dialogName, "]"));
  }

}

const snapshotsAreEqual = (a, b) => rangesAreEqual(a.selectedRange, b.selectedRange) && a.document.isEqualTo(b.document);

class EditorController extends Controller {
  constructor(_ref) {
    let {
      editorElement,
      document,
      html
    } = _ref;
    super(...arguments);
    this.editorElement = editorElement;
    this.selectionManager = new SelectionManager(this.editorElement);
    this.selectionManager.delegate = this;
    this.composition = new Composition();
    this.composition.delegate = this;
    this.inputController = new Level2InputController(this.editorElement);
    this.inputController.delegate = this;
    this.inputController.responder = this.composition;
    this.compositionController = new CompositionController(this.editorElement, this.composition);
    this.compositionController.delegate = this;
    this.toolbarController = new ToolbarController(this.editorElement.toolbarElement);
    this.toolbarController.delegate = this;
    this.editor = new Editor(this.composition, this.selectionManager, this.editorElement);

    if (document) {
      this.editor.loadDocument(document);
    } else {
      this.editor.loadHTML(html);
    }
  }

  registerSelectionManager() {
    return selectionChangeObserver.registerSelectionManager(this.selectionManager);
  }

  unregisterSelectionManager() {
    return selectionChangeObserver.unregisterSelectionManager(this.selectionManager);
  }

  render() {
    return this.compositionController.render();
  }

  reparse() {
    return this.composition.replaceHTML(this.editorElement.innerHTML);
  } // Composition delegate


  compositionDidChangeDocument(document) {
    this.notifyEditorElement("document-change");

    if (!this.handlingInput) {
      return this.render();
    }
  }

  compositionDidChangeCurrentAttributes(currentAttributes) {
    this.currentAttributes = currentAttributes;
    this.toolbarController.updateAttributes(this.currentAttributes);
    this.updateCurrentActions();
    return this.notifyEditorElement("attributes-change", {
      attributes: this.currentAttributes
    });
  }

  compositionDidPerformInsertionAtRange(range) {
    if (this.pasting) {
      this.pastedRange = range;
    }
  }

  compositionDidRequestChangingSelectionToLocationRange(locationRange) {
    if (this.loadingSnapshot && !this.isFocused()) return;
    this.requestedLocationRange = locationRange;
    this.compositionRevisionWhenLocationRangeRequested = this.composition.revision;

    if (!this.handlingInput) {
      return this.render();
    }
  }

  compositionWillLoadSnapshot() {
    this.loadingSnapshot = true;
  }

  compositionDidLoadSnapshot() {
    this.compositionController.refreshViewCache();
    this.render();
    this.loadingSnapshot = false;
  }

  getSelectionManager() {
    return this.selectionManager;
  } // Document controller delegate


  compositionControllerWillSyncDocumentView() {
    this.inputController.editorWillSyncDocumentView();
    this.selectionManager.lock();
    return this.selectionManager.clearSelection();
  }

  compositionControllerDidSyncDocumentView() {
    this.inputController.editorDidSyncDocumentView();
    this.selectionManager.unlock();
    this.updateCurrentActions();
    return this.notifyEditorElement("sync");
  }

  compositionControllerDidRender() {
    if (this.requestedLocationRange) {
      if (this.compositionRevisionWhenLocationRangeRequested === this.composition.revision) {
        this.selectionManager.setLocationRange(this.requestedLocationRange);
      }

      this.requestedLocationRange = null;
      this.compositionRevisionWhenLocationRangeRequested = null;
    }

    if (this.renderedCompositionRevision !== this.composition.revision) {
      this.composition.updateCurrentAttributes();
      this.notifyEditorElement("render");
    }

    this.renderedCompositionRevision = this.composition.revision;
  }

  compositionControllerDidFocus() {
    if (this.isFocusedInvisibly()) {
      this.setLocationRange({
        index: 0,
        offset: 0
      });
    }

    this.toolbarController.hideDialog();
    return this.notifyEditorElement("focus");
  }

  compositionControllerDidBlur() {
    return this.notifyEditorElement("blur");
  } // Input controller delegate


  inputControllerWillHandleInput() {
    this.handlingInput = true;
    this.requestedRender = false;
  }

  inputControllerDidRequestRender() {
    this.requestedRender = true;
  }

  inputControllerDidHandleInput() {
    this.handlingInput = false;

    if (this.requestedRender) {
      this.requestedRender = false;
      return this.render();
    }
  }

  inputControllerDidAllowUnhandledInput() {
    return this.notifyEditorElement("change");
  }

  inputControllerDidRequestReparse() {
    return this.reparse();
  }

  inputControllerWillPerformTyping() {
    return this.recordTypingUndoEntry();
  }

  inputControllerWillPerformFormatting(attributeName) {
    return this.recordFormattingUndoEntry(attributeName);
  }

  inputControllerWillCutText() {
    return this.editor.recordUndoEntry("Cut");
  }

  inputControllerWillPaste(paste) {
    this.editor.recordUndoEntry("Paste");
    this.pasting = true;
    return this.notifyEditorElement("before-paste", {
      paste
    });
  }

  inputControllerDidPaste(paste) {
    paste.range = this.pastedRange;
    this.pastedRange = null;
    this.pasting = null;
    return this.notifyEditorElement("paste", {
      paste
    });
  }

  inputControllerWillMoveText() {
    return this.editor.recordUndoEntry("Move");
  }

  inputControllerWillPerformUndo() {
    return this.editor.undo();
  }

  inputControllerWillPerformRedo() {
    return this.editor.redo();
  }

  inputControllerDidReceiveKeyboardCommand(keys) {
    return this.toolbarController.applyKeyboardCommand(keys);
  }

  inputControllerDidStartDrag() {
    this.locationRangeBeforeDrag = this.selectionManager.getLocationRange();
  }

  inputControllerDidReceiveDragOverPoint(point) {
    return this.selectionManager.setLocationRangeFromPointRange(point);
  }

  inputControllerDidCancelDrag() {
    this.selectionManager.setLocationRange(this.locationRangeBeforeDrag);
    this.locationRangeBeforeDrag = null;
  } // Selection manager delegate


  locationRangeDidChange(locationRange) {
    this.composition.updateCurrentAttributes();
    this.updateCurrentActions();
    return this.notifyEditorElement("selection-change");
  } // Toolbar controller delegate


  toolbarDidClickButton() {
    if (!this.getLocationRange()) {
      return this.setLocationRange({
        index: 0,
        offset: 0
      });
    }
  }

  toolbarDidInvokeAction(actionName, invokingElement) {
    return this.invokeAction(actionName, invokingElement);
  }

  toolbarDidToggleAttribute(attributeName) {
    this.recordFormattingUndoEntry(attributeName);
    this.composition.toggleCurrentAttribute(attributeName);
    this.render();

    if (!this.selectionFrozen) {
      return this.editorElement.focus();
    }
  }

  toolbarDidUpdateAttribute(attributeName, value) {
    this.recordFormattingUndoEntry(attributeName);
    this.composition.setCurrentAttribute(attributeName, value);
    this.render();

    if (!this.selectionFrozen) {
      return this.editorElement.focus();
    }
  }

  toolbarDidRemoveAttribute(attributeName) {
    this.recordFormattingUndoEntry(attributeName);
    this.composition.removeCurrentAttribute(attributeName);
    this.render();

    if (!this.selectionFrozen) {
      return this.editorElement.focus();
    }
  }

  toolbarWillShowDialog(dialogElement) {
    this.composition.expandSelectionForEditing();
    return this.freezeSelection();
  }

  toolbarDidShowDialog(dialogName) {
    return this.notifyEditorElement("toolbar-dialog-show", {
      dialogName
    });
  }

  toolbarDidHideDialog(dialogName) {
    this.thawSelection();
    this.editorElement.focus();
    return this.notifyEditorElement("toolbar-dialog-hide", {
      dialogName
    });
  } // Selection


  freezeSelection() {
    if (!this.selectionFrozen) {
      this.selectionManager.lock();
      this.composition.freezeSelection();
      this.selectionFrozen = true;
      return this.render();
    }
  }

  thawSelection() {
    if (this.selectionFrozen) {
      this.composition.thawSelection();
      this.selectionManager.unlock();
      this.selectionFrozen = false;
      return this.render();
    }
  }

  canInvokeAction(actionName) {
    if (this.actionIsExternal(actionName)) {
      return true;
    } else {
      var _this$actions$actionN, _this$actions$actionN2;

      return !!((_this$actions$actionN = this.actions[actionName]) !== null && _this$actions$actionN !== void 0 && (_this$actions$actionN2 = _this$actions$actionN.test) !== null && _this$actions$actionN2 !== void 0 && _this$actions$actionN2.call(this));
    }
  }

  invokeAction(actionName, invokingElement) {
    if (this.actionIsExternal(actionName)) {
      return this.notifyEditorElement("action-invoke", {
        actionName,
        invokingElement
      });
    } else {
      var _this$actions$actionN3, _this$actions$actionN4;

      return (_this$actions$actionN3 = this.actions[actionName]) === null || _this$actions$actionN3 === void 0 ? void 0 : (_this$actions$actionN4 = _this$actions$actionN3.perform) === null || _this$actions$actionN4 === void 0 ? void 0 : _this$actions$actionN4.call(this);
    }
  }

  actionIsExternal(actionName) {
    return /^x-./.test(actionName);
  }

  getCurrentActions() {
    const result = {};

    for (const actionName in this.actions) {
      result[actionName] = this.canInvokeAction(actionName);
    }

    return result;
  }

  updateCurrentActions() {
    const currentActions = this.getCurrentActions();

    if (!objectsAreEqual(currentActions, this.currentActions)) {
      this.currentActions = currentActions;
      this.toolbarController.updateActions(this.currentActions);
      return this.notifyEditorElement("actions-change", {
        actions: this.currentActions
      });
    }
  } // Editor filters


  runEditorFilters() {
    let snapshot = this.composition.getSnapshot();
    Array.from(this.editor.filters).forEach(filter => {
      const {
        document,
        selectedRange
      } = snapshot;
      snapshot = filter.call(this.editor, snapshot) || {};

      if (!snapshot.document) {
        snapshot.document = document;
      }

      if (!snapshot.selectedRange) {
        snapshot.selectedRange = selectedRange;
      }
    });

    if (!snapshotsAreEqual(snapshot, this.composition.getSnapshot())) {
      return this.composition.loadSnapshot(snapshot);
    }
  } // Private


  updateInputElement() {
    const element = this.compositionController.getSerializableElement();
    const value = serializeToContentType(element, "text/html");
    return this.editorElement.setInputElementValue(value);
  }

  notifyEditorElement(message, data) {
    switch (message) {
      case "document-change":
        this.documentChangedSinceLastRender = true;
        break;

      case "render":
        if (this.documentChangedSinceLastRender) {
          this.documentChangedSinceLastRender = false;
          this.notifyEditorElement("change");
        }

        break;

      case "change":
        this.updateInputElement();
        break;
    }

    return this.editorElement.notify(message, data);
  }

  recordFormattingUndoEntry(attributeName) {
    const blockConfig = getBlockConfig(attributeName);
    const locationRange = this.selectionManager.getLocationRange();

    if (blockConfig || !rangeIsCollapsed(locationRange)) {
      return this.editor.recordUndoEntry("Formatting", {
        context: this.getUndoContext(),
        consolidatable: true
      });
    }
  }

  recordTypingUndoEntry() {
    return this.editor.recordUndoEntry("Typing", {
      context: this.getUndoContext(this.currentAttributes),
      consolidatable: true
    });
  }

  getUndoContext() {
    for (var _len = arguments.length, context = new Array(_len), _key = 0; _key < _len; _key++) {
      context[_key] = arguments[_key];
    }

    return [this.getLocationContext(), this.getTimeContext(), ...Array.from(context)];
  }

  getLocationContext() {
    const locationRange = this.selectionManager.getLocationRange();

    if (rangeIsCollapsed(locationRange)) {
      return locationRange[0].index;
    } else {
      return locationRange;
    }
  }

  getTimeContext() {
    if (undo.interval > 0) {
      return Math.floor(new Date().getTime() / undo.interval);
    } else {
      return 0;
    }
  }

  isFocused() {
    var _this$editorElement$o;

    return this.editorElement === ((_this$editorElement$o = this.editorElement.ownerDocument) === null || _this$editorElement$o === void 0 ? void 0 : _this$editorElement$o.activeElement);
  } // Detect "Cursor disappears sporadically" Firefox bug.
  // - https://bugzilla.mozilla.org/show_bug.cgi?id=226301


  isFocusedInvisibly() {
    return this.isFocused() && !this.getLocationRange();
  }

  get actions() {
    return this.constructor.actions;
  }

}

_defineProperty(EditorController, "actions", {
  undo: {
    test() {
      return this.editor.canUndo();
    },

    perform() {
      return this.editor.undo();
    }

  },
  redo: {
    test() {
      return this.editor.canRedo();
    },

    perform() {
      return this.editor.redo();
    }

  },
  link: {
    test() {
      return this.editor.canActivateAttribute("href");
    }

  },
  increaseNestingLevel: {
    test() {
      return this.editor.canIncreaseNestingLevel();
    },

    perform() {
      return this.editor.increaseNestingLevel() && this.render();
    }

  },
  decreaseNestingLevel: {
    test() {
      return this.editor.canDecreaseNestingLevel();
    },

    perform() {
      return this.editor.decreaseNestingLevel() && this.render();
    }

  }
});

EditorController.proxyMethod("getSelectionManager().setLocationRange");
EditorController.proxyMethod("getSelectionManager().getLocationRange");

var controllers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CompositionController: CompositionController,
  Controller: Controller,
  EditorController: EditorController,
  InputController: InputController,
  Level2InputController: Level2InputController,
  ToolbarController: ToolbarController
});

var observers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MutationObserver: MutationObserver,
  SelectionChangeObserver: SelectionChangeObserver
});

class RicoToolbarElement extends HTMLElement {
  // Element lifecycle
  connectedCallback() {
    if (this.innerHTML === "") {
      this.innerHTML = toolbar.getDefaultHTML();
    }
  }

}

let id = 0; // Contenteditable support helpers

const autofocus = function (element) {
  if (!document.querySelector(":focus")) {
    if (element.hasAttribute("autofocus") && document.querySelector("[autofocus]") === element) {
      return element.focus();
    }
  }
};

const makeEditable = function (element) {
  if (element.hasAttribute("contenteditable")) {
    return;
  }

  element.setAttribute("contenteditable", "");
  return handleEventOnce("focus", {
    onElement: element,

    withCallback() {
      return configureContentEditable(element);
    }

  });
};

const configureContentEditable = function (element) {
  disableObjectResizing(element);
  return setDefaultParagraphSeparator(element);
};

const disableObjectResizing = function (element) {
  var _document$queryComman, _document;

  if ((_document$queryComman = (_document = document).queryCommandSupported) !== null && _document$queryComman !== void 0 && _document$queryComman.call(_document, "enableObjectResizing")) {
    document.execCommand("enableObjectResizing", false, false);
    return handleEvent("mscontrolselect", {
      onElement: element,
      preventDefault: true
    });
  }
};

const setDefaultParagraphSeparator = function (element) {
  var _document$queryComman2, _document2;

  if ((_document$queryComman2 = (_document2 = document).queryCommandSupported) !== null && _document$queryComman2 !== void 0 && _document$queryComman2.call(_document2, "DefaultParagraphSeparator")) {
    const {
      tagName
    } = attributes.default;

    if (["div", "p"].includes(tagName)) {
      return document.execCommand("DefaultParagraphSeparator", false, tagName);
    }
  }
}; // Accessibility helpers


const addAccessibilityRole = function (element) {
  if (element.hasAttribute("role")) {
    return;
  }

  return element.setAttribute("role", "textbox");
};

const ensureAriaLabel = function (element) {
  if (element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby")) {
    return;
  }

  const update = function () {
    const texts = Array.from(element.labels).map(label => {
      if (!label.contains(element)) return label.textContent;
    }).filter(text => text);
    const text = texts.join(" ");

    if (text) {
      return element.setAttribute("aria-label", text);
    } else {
      return element.removeAttribute("aria-label");
    }
  };

  update();
  return handleEvent("focus", {
    onElement: element,
    withCallback: update
  });
}; // Style


class RicoEditorElement extends HTMLElement {
  // Properties
  get ricoId() {
    if (this.hasAttribute("rico-id")) {
      return this.getAttribute("rico-id");
    } else {
      this.setAttribute("rico-id", ++id);
      return this.ricoId;
    }
  }

  get labels() {
    const labels = [];

    if (this.id && this.ownerDocument) {
      labels.push(...Array.from(this.ownerDocument.querySelectorAll("label[for='".concat(this.id, "']")) || []));
    }

    const label = findClosestElementFromNode(this, {
      matchingSelector: "label"
    });

    if (label) {
      if ([this, null].includes(label.control)) {
        labels.push(label);
      }
    }

    return labels;
  }

  get toolbarElement() {
    if (this.hasAttribute("toolbar")) {
      var _this$ownerDocument;

      return (_this$ownerDocument = this.ownerDocument) === null || _this$ownerDocument === void 0 ? void 0 : _this$ownerDocument.getElementById(this.getAttribute("toolbar"));
    } else if (this.parentNode) {
      const toolbarId = "rico-toolbar-".concat(this.ricoId);
      this.setAttribute("toolbar", toolbarId);
      const element = makeElement("rico-toolbar", {
        id: toolbarId
      });
      this.parentNode.insertBefore(element, this);
      return element;
    } else {
      return undefined;
    }
  }

  get form() {
    var _this$inputElement;

    return (_this$inputElement = this.inputElement) === null || _this$inputElement === void 0 ? void 0 : _this$inputElement.form;
  }

  get inputElement() {
    if (this.hasAttribute("input")) {
      var _this$ownerDocument2;

      return (_this$ownerDocument2 = this.ownerDocument) === null || _this$ownerDocument2 === void 0 ? void 0 : _this$ownerDocument2.getElementById(this.getAttribute("input"));
    } else if (this.parentNode) {
      const inputId = "rico-input-".concat(this.ricoId);
      this.setAttribute("input", inputId);
      const element = makeElement("input", {
        type: "hidden",
        id: inputId
      });
      this.parentNode.insertBefore(element, this.nextElementSibling);
      return element;
    } else {
      return undefined;
    }
  }

  get editor() {
    var _this$editorControlle;

    return (_this$editorControlle = this.editorController) === null || _this$editorControlle === void 0 ? void 0 : _this$editorControlle.editor;
  }

  get name() {
    var _this$inputElement2;

    return (_this$inputElement2 = this.inputElement) === null || _this$inputElement2 === void 0 ? void 0 : _this$inputElement2.name;
  }

  get value() {
    var _this$inputElement3;

    return (_this$inputElement3 = this.inputElement) === null || _this$inputElement3 === void 0 ? void 0 : _this$inputElement3.value;
  }

  set value(defaultValue) {
    var _this$editor;

    this.defaultValue = defaultValue;
    (_this$editor = this.editor) === null || _this$editor === void 0 ? void 0 : _this$editor.loadHTML(this.defaultValue);
  } // Controller delegate methods


  notify(message, data) {
    if (this.editorController) {
      return triggerEvent("rico-".concat(message), {
        onElement: this,
        attributes: data
      });
    }
  }

  setInputElementValue(value) {
    if (this.inputElement) {
      this.inputElement.value = value;
    }
  } // Element lifecycle


  connectedCallback() {
    if (!this.hasAttribute("data-rico-internal")) {
      makeEditable(this);
      addAccessibilityRole(this);
      ensureAriaLabel(this);

      if (!this.editorController) {
        triggerEvent("rico-before-initialize", {
          onElement: this
        });
        this.editorController = new EditorController({
          editorElement: this,
          html: this.defaultValue = this.value
        });
        requestAnimationFrame(() => triggerEvent("rico-initialize", {
          onElement: this
        }));
      }

      this.editorController.registerSelectionManager();
      this.registerResetListener();
      this.registerClickListener();
      autofocus(this);
    }
  }

  disconnectedCallback() {
    var _this$editorControlle2;

    (_this$editorControlle2 = this.editorController) === null || _this$editorControlle2 === void 0 ? void 0 : _this$editorControlle2.unregisterSelectionManager();
    this.unregisterResetListener();
    return this.unregisterClickListener();
  } // Form support


  registerResetListener() {
    this.resetListener = this.resetBubbled.bind(this);
    return window.addEventListener("reset", this.resetListener, false);
  }

  unregisterResetListener() {
    return window.removeEventListener("reset", this.resetListener, false);
  }

  registerClickListener() {
    this.clickListener = this.clickBubbled.bind(this);
    return window.addEventListener("click", this.clickListener, false);
  }

  unregisterClickListener() {
    return window.removeEventListener("click", this.clickListener, false);
  }

  resetBubbled(event) {
    if (event.defaultPrevented) return;
    if (event.target !== this.form) return;
    return this.reset();
  }

  clickBubbled(event) {
    if (event.defaultPrevented) return;
    if (this.contains(event.target)) return;
    const label = findClosestElementFromNode(event.target, {
      matchingSelector: "label"
    });
    if (!label) return;
    if (!Array.from(this.labels).includes(label)) return;
    return this.focus();
  }

  reset() {
    this.value = this.defaultValue;
  }

}

var elements = /*#__PURE__*/Object.freeze({
  __proto__: null,
  RicoEditorElement: RicoEditorElement,
  RicoToolbarElement: RicoToolbarElement
});

const Rico = {
  VERSION: version,
  config,
  core,
  models,
  views,
  controllers,
  observers,
  elements
}; // Expose models under the Rico constant for compatibility with v1

Object.assign(Rico, models);

function start() {
  if (!customElements.get("rico-toolbar")) {
    customElements.define("rico-toolbar", RicoToolbarElement);
  }

  if (!customElements.get("rico-editor")) {
    customElements.define("rico-editor", RicoEditorElement);
  }
}

window.Rico = Rico;
setTimeout(start, 0);

export { Rico as default };
