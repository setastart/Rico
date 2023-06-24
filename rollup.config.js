import json from "@rollup/plugin-json"
import includePaths from "rollup-plugin-includepaths"
import commonjs from "@rollup/plugin-commonjs"
import { babel } from "@rollup/plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

import { version } from "./package.json"

const year = new Date().getFullYear()
const banner = `/*\nRico ${version}\nCopyright © ${year} setastart.com\n */`

const plugins = [
  json(),
  includePaths({
    paths: [ "src" ],
    extensions: [ ".js" ]
  }),
  nodeResolve({ extensions: [ ".js" ] }),
  commonjs({
    extensions: [ ".js" ]
  }),
  babel({ babelHelpers: "bundled" }),
]

const defaultConfig = {
  context: "window",
  treeshake: false,
  plugins: plugins,
  watch: {
    include: "src/**"
  }
}

const terserConfig = terser({
  mangle: true,
  compress: true,
  format: {
    comments: function (node, comment) {
      const text = comment.value
      const type = comment.type
      if (type == "comment2") {
        // multiline comment
        return /Copyright/.test(text)
      }
    },
  },
})

const compressedConfig = Object.assign({}, defaultConfig, { plugins: plugins.concat(terserConfig) })

export default [
  {
    input: "src/rico/rico.js",
    output: [
      {
        name: "Rico",
        file: "dist/rico.umd.js",
        format: "umd",
        banner
      },
      // {
      //   file: "dist/rico.esm.js",
      //   format: "es",
      //   banner
      // }
    ],
    ...defaultConfig,
  },
  {
    input: "src/rico/rico.js",
    output: [
      {
        name: "Rico",
        file: "dist/rico.umd.min.js",
        format: "umd",
        banner,
        sourcemap: true
      },
      // {
      //   file: "dist/rico.esm.min.js",
      //   format: "es",
      //   banner,
      //   sourcemap: true
      // }
    ],
    ...compressedConfig,
  },
  {
    input: "src/test/test.js",
    output: {
      name: "RicoTests",
      file: "dist/test.js",
      format: "es",
      sourcemap: true,
      banner
    },
    ...defaultConfig,
  },
  {
    input: "src/inspector/inspector.js",
    output: {
      name: "RicoInspector",
      file: "dist/inspector.js",
      format: "es",
      sourcemap: true,
      banner
    },
    ...defaultConfig,
  }
]
