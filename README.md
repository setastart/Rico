# <img style="margin-right: 0.2em;" src="assets/gfx/icon-rico-512.png" alt="Rico Logo" width="64" height="64"> Rico

### A Rich Text Editor for basic WYSIWYG HTML editing on the web.


Try Rico **now** [here inside your browser](https://setastart.com/rico)!


#### Features for editors:
- Basic text editing:
  - Bold, italic, small, striketrough, links.
  - Headings, subheadings, ordered and unordered lists, blockquotes and code sections.
  - Undo and redo.
- <kbd>Enter</kbd> starts a new paragraph.
- <kbd>Shift</kbd> + <kbd>Enter</kbd> starts a new line in the same paragraph.
- The editor height expands automatically with text without scrollbars. No more scrollbars within scrollbars, because those are very annoying.
- Intuitive and accessible user interface.
- All toolbar actions are accessible using the keyboard shortcuts (see below).
- Just text. No images, attachments, uploads or anything else.


#### Features for developers:
- Only HTML5 Semantic tags, so no div tags inside the editor text.
- p tag is the default tag, for normal paragraphs.
- Bring your own CSS (basic CSS included). No CSS inside javascript.
- Smallish size (for a web rich text editor): 128 KB minified.
- To use it, upload the provided file dist/rico.min.js to your server and include it in your html.


#### Keyboard shortcuts:

| Action            | Keys                                             | Tag            | Action                                                                     |
|-------------------|--------------------------------------------------|----------------|----------------------------------------------------------------------------|
| Bold              | <kbd>Command</kbd>+<kbd>B</kbd>                  | `<strong>`     | <img width="16" alt="Bold" src="assets/gfx/rico-bold@3x.png">              |
| Italic            | <kbd>Command</kbd>+<kbd>I</kbd>                  | `<em>`         | <img width="16" alt="Italic" src="assets/gfx/rico-italic@3x.png">          |
| Small             | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> | `<small>`      | <img width="16" alt="Small" src="assets/gfx/rico-small@3x.png">            |
| Striketrough      | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> | `<del>`        | <img width="16" alt="Striketrough" src="assets/gfx/rico-strike@3x.png">    |
| Link              | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>K</kbd> | `<a>`          | <img width="16" alt="Link" src="assets/gfx/rico-link@3x.png">              |
| Undo              | <kbd>Command</kbd>+<kbd>Z</kbd>                  |                | <img width="16" alt="Undo" src="assets/gfx/rico-undo@3x.png">              |
| Redo              | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> |                | <img width="16" alt="Redo" src="assets/gfx/rico-redo@3x.png">              |
| Heading T1        | <kbd>Command</kbd>+<kbd>G</kbd>                  | `<h1>`         | <img width="16" alt="Heading T1" src="assets/gfx/rico-t1@3x.png">          |
| Subheading T2     | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> | `<h2>`         | <img width="16" alt="Subheading T2" src="assets/gfx/rico-t2@3x.png">       |
| Quoted text       | <kbd>Command</kbd>+<kbd>E</kbd>                  | `<blockquote>` | <img width="16" alt="Quoted text" src="assets/gfx/rico-quote@3x.png">      |
| Preformatted text | <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd> | `<pre>`        | <img width="16" alt="Preformatted text" src="assets/gfx/rico-code@3x.png"> |
| Bulleted list     | <kbd>Command</kbd>+<kbd>B</kbd>                  | `<ul>`         | <img width="16" alt="Bulleted list" src="assets/gfx/rico-bullets@3x.png">  |
| Numbered list     | <kbd>Command</kbd>+<kbd>B</kbd>                  | `<ol>`         | <img width="16" alt="Numbered list" src="assets/gfx/rico-numbers@3x.png">  |
| Indent            | <kbd>Tab</kbd>                                   |                | <img width="16" alt="Indent" src="assets/gfx/rico-indent@3x.png">          |
| Unindent          | <kbd>Shift</kbd>+<kbd>Tab</kbd>                  |                | <img width="16" alt="Unindent" src="assets/gfx/rico-unindent@3x.png">      |

*Note: Linux and Windows users use <kbd>Control</kbd> instead of <kbd>Command</kbd>.*

### Rico is a fork of [Trix](https://github.com/basecamp/rico).


#### Motivation:
We've been using Trix since 2017, and it was our editor of choice because it is open source, extensible, intuitive and much nicer overall than the alternatives.  
But we had different needs and made lots of changes, so we decided to fork it.


#### Changes we've made:
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


### Thank you:

Trix was created by [Javan Makhmali](https://twitter.com/javan) and [Sam Stephenson](https://twitter.com/sstephenson), with development sponsored by [Basecamp](https://basecamp.com/).

A big thanks to [Alberto Fernández-Capel](https://github.com/afcapel) for the translation from coffeescript back to javascript.


### Copyright and licensing

Trix is copyright of 37signals, LLC. and has a [MIT license](/LICENSE-TRIX).

Rico is copyright of setastart.com.   
Rico is licensed with the [EUPL 1.2 license](/LICENSE).

© 2023 setastart.com
