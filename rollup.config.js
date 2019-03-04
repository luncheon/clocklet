import resolve from 'rollup-plugin-node-resolve'
import pug from 'rollup-plugin-pug'

export default {
  output: {
    format: 'umd',
  },
  plugins: [
    resolve(),
    pug({
      basedir: 'src/demo/',
      pugRuntime: false,
      staticPattern: /\S/,
    }),
    typescript(),
  ],
}

function typescript() {
  const ts = require('typescript')
  const tsconfig = require('./tsconfig.json')
  const compilerOptions = Object.assign({}, tsconfig && tsconfig.compilerOptions, { module: ts.ModuleKind.ES2015, noEmitHelpers: true, importHelpers: true })
  const compilerHost = ts.createCompilerHost(compilerOptions)
  return {
    resolveId(importee, importer) {
      if (importer) {
        const resolved = ts.nodeModuleNameResolver(importee, importer.replace(/\\/g, '/'), compilerOptions, compilerHost)
        if (resolved.resolvedModule && !resolved.resolvedModule.resolvedFileName.endsWith('.d.ts')) {
          return resolved.resolvedModule.resolvedFileName
        }
      }
    },
    transform(code, id) {
      if (id.endsWith('.ts')) {
        const transformed = ts.transpileModule(code, { compilerOptions })
        return {
          code: transformed.outputText,
          map: transformed.sourceMapText && JSON.parse(transformed.sourceMapText),
        }
      }
    },
  }
}
