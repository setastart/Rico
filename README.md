# <img style="margin-right: 0.2em;" src="assets/gfx/icon-rico/icon-rico-512.png" alt="Rico Logo" width="64" height="64"> Rico

## A Rich Text Editor for basic WYSIWYG HTML editing on the web.


Try Rico **now** [here inside your browser](https://setastart.com/en/rico)!


### Features for editors:
- Basic text editing:
  - <strong>Bold</strong>, <em>italic</em>, <small>small</small>, <del>striketrough</del>, [links](https://setastart.com/en/rico).
  - Headings, subheadings, ordered and unordered lists, blockquotes and code sections.
  - Undo and redo.
- <kbd>Enter</kbd> starts a new paragraph.
- <kbd>Shift</kbd> + <kbd>Enter</kbd> starts a new line in the same paragraph.
- The editor height expands automatically with text without scrollbars. No more scrollbars within scrollbars, because those are very annoying.
- Intuitive and accessible user interface.
- All toolbar actions are accessible using the keyboard shortcuts (see below).
- Just text. No images, attachments, uploads or anything else.


### Features for developers:
- Only HTML5 Semantic tags, so no div tags inside the editor text.
- p tag is the default tag, for normal paragraphs.
- Bring your own CSS (basic CSS included). No CSS inside javascript.
- Smallish size (for a web rich text editor): 125 KB minified.
- To use it, upload the provided file [dist/rico.iife.min.js](dist/rico.iife.min.js) to your server and include it in your html.


### Screenshot:

You can customize the look of Rico using CSS. This is how it looks with the default styling:

<img src="design/Screenshot - Rico Text Editor - Setastart.com.png" alt="Screenshot" width="640">

### Keyboard shortcuts:

| Action            | Icon                                                                         | Keys                                                 | Tag            |
|-------------------|------------------------------------------------------------------------------|------------------------------------------------------|----------------|
| Bold              | <img width="16" alt="Bold" src="assets/gfx/rico/rico-bold.png">              | <kbd>Command</kbd> + <kbd>B</kbd>                    | `<strong>`     |
| Italic            | <img width="16" alt="Italic" src="assets/gfx/rico/rico-italic.png">          | <kbd>Command</kbd> + <kbd>I</kbd>                    | `<em>`         |
| Small             | <img width="16" alt="Small" src="assets/gfx/rico/rico-small.png">            | <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> | `<small>`      |
| Strikethrough     | <img width="16" alt="Striketrough" src="assets/gfx/rico/rico-strike.png">    | <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> | `<del>`        |
| Link              | <img width="16" alt="Link" src="assets/gfx/rico/rico-link.png">              | <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> | `<a>`          |
| Undo              | <img width="16" alt="Undo" src="assets/gfx/rico/rico-undo.png">              | <kbd>Command</kbd> + <kbd>Z</kbd>                    |                |
| Redo              | <img width="16" alt="Redo" src="assets/gfx/rico/rico-redo.png">              | <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> |                |
| Heading T1        | <img width="16" alt="Heading T1" src="assets/gfx/rico/rico-t1.png">          | <kbd>Command</kbd> + <kbd>G</kbd>                    | `<h1>`         |
| Heading T2        | <img width="16" alt="Subheading T2" src="assets/gfx/rico/rico-t2.png">       | <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd> | `<h2>`         |
| Quoted text       | <img width="16" alt="Quoted text" src="assets/gfx/rico/rico-quote.png">      | <kbd>Command</kbd> + <kbd>E</kbd>                    | `<blockquote>` |
| Preformatted text | <img width="16" alt="Preformatted text" src="assets/gfx/rico/rico-code.png"> | <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd> | `<pre>`        |
| Bulleted list     | <img width="16" alt="Bulleted list" src="assets/gfx/rico/rico-bullets.png">  | <kbd>Command</kbd> + <kbd>B</kbd>                    | `<ul>`         |
| Numbered list     | <img width="16" alt="Numbered list" src="assets/gfx/rico/rico-numbers.png">  | <kbd>Command</kbd> + <kbd>B</kbd>                    | `<ol>`         |
| Indent            | <img width="16" alt="Indent" src="assets/gfx/rico/rico-indent.png">          | <kbd>Tab</kbd>                                       |                |
| Unindent          | <img width="16" alt="Unindent" src="assets/gfx/rico/rico-unindent.png">      | <kbd>Shift</kbd> + <kbd>Tab</kbd>                    |                |

*Note: Linux and Windows users use <kbd>Control</kbd> instead of <kbd>Command</kbd>.*



# Rico is a fork of [Trix](https://github.com/basecamp/rico).


## Motivation:
We've been using Trix since 2017, and it was our editor of choice because it is open source, extensible, intuitive and much nicer overall than the alternatives.  
But we had different needs and made lots of changes, so we decided to fork it.


### Changes we've made:
- Remove all attachment and image upload code and assets.
- Remove all CSS and SVG from the javascript.
- Use `<p>` instead of `<div>` for default text blocks.
- Add `<h2>` for subheadings.
- Add `<small>` for small text.
- Remove the ability to nest `<blockquote>`.
- Pressing <kbd>Shift</kbd> + <kbd>Enter</kbd> inserts a `<br>`.
- Pressing <kbd>Enter</kbd> inside a `<p>` adds a new paragraph.
- Rename all code instances of Trix and trix by Rico and rico, respectively.
- Keep most of the tests and update them to make them pass with our changes.


## Thank you:

Trix was created by [Javan Makhmali](https://twitter.com/javan) and [Sam Stephenson](https://twitter.com/sstephenson), with development sponsored by [Basecamp](https://basecamp.com/).

Thanks to [Alberto Fernández-Capel](https://github.com/afcapel) for the translation from coffeescript to javascript.


# Copyright and licensing

Trix is copyright of 37signals, LLC. and has a [MIT license](/LICENSE-TRIX).

Rico is copyright of setastart.com.   
Rico is licensed with the [EUPL 1.2 license](/LICENSE).

© 2023 setastart.com
