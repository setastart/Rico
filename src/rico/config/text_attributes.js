export default {
  bold: {
    tagName: "strong",
    inheritable: true,
    parser(element) {
      const style = window.getComputedStyle(element)
      return style.fontWeight === "bold" || style.fontWeight >= 600
    },
  },
  italic: {
    tagName: "em",
    inheritable: true,
    parser(element) {
      const style = window.getComputedStyle(element)
      return style.fontStyle === "italic"
    },
  },
  small: {
    tagName: "small",
    inheritable: true,
    parser(element) {
      const style = window.getComputedStyle(element)
      return style.fontStyle === "small"
    },
  },
  href: {
    groupTagName: "a",
    parser(element) {
      const matchingSelector = "a"
      const link = element.closest(matchingSelector)
      if (link) {
        return link.getAttribute("href")
      }
    },
  },
  strike: {
    tagName: "del",
    inheritable: true,
  },
  frozen: {
    style: { backgroundColor: "highlight" },
  },
}
