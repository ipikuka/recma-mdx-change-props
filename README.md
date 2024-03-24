# recma-mdx-change-props

[![NPM version][badge-npm-version]][npm-package-url]
[![NPM downloads][badge-npm-download]][npm-package-url]
[![Build][badge-build]][github-workflow-url]
[![codecov](https://codecov.io/gh/ipikuka/recma-mdx-change-props/graph/badge.svg?token=MPKUA07Z6N)](https://codecov.io/gh/ipikuka/recma-mdx-change-props)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Frecma-mdx-change-props%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/recma-mdx-change-props)
[![typescript][badge-typescript]][typescript-url]
[![License][badge-license]][github-license-url]

> [!WARNING]  
> The `recma-mdx-change-props` is useful for **`next-mdx-remote`** or **`next-mdx-remote-client`** users in `nextjs` applications.

This package is a [unified][unified] ([recma][recma]) plugin to provide using the expression like `{props.foo}` in a MDX document.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[recma][recma]** adds support for producing a javascript code by transforming **[esast][esast]** which stands for Ecma Script Abstract Syntax Tree (AST) that is used in production of compiled source for the **[MDX][MDX]**.

## When should I use this?

**This plugin is useful if you want to use expressions like {props.foo} in a MDX document**. 

Thanks to the plugin, you can pass "props" object in the `scope` variable in `next-mdx-remote` or `next-mdx-remote-client` projects.

```javascript
const scope = {
  props: {
    foo: "foofoo",
    baz: "bazbaz"
  }
}

<MDXRemote scope={scope} /* ... */ />
```

The `recma-mdx-change-props` changes the **`props`** parameter into **`_props`** in the function **`_createMdxContent`** in the compiled source; and makes appropriate changes in order to do so. Without `recma-mdx-change-props`, there will be a confliction caused by "props" in the `function _createMdxContent(props){}` and the expression like `{props.foo}` in a MDX document will not work.

## Installation

This package is suitable for ESM only. In Node.js (version 16+), install with npm:

```bash
npm install recma-mdx-change-props
```

or

```bash
yarn add recma-mdx-change-props
```

## Usage

Say we have the following file, `example.mdx`,

```mdx
# Hi {props.foo}
      
<Test name={props.baz} />
```

And our module, `example.js`, looks as follows:

```javascript
import { read } from "to-vfile";
import { compile } from "@mdx-js/mdx";
import recmaMdxChangeProps from "recma-mdx-change-props";

main();

async function main() {
  const source = await read("example.mdx");

  const compiledSource = await compile(source, {
    recmaPlugins: [recmaMdxChangeProps],
  });

  return String(compiledSource);
}
```

Now, running `node example.js` produces the `compiled source` like below:

```js
function _createMdxContent(_props) {
  const _components = {
    h1: "h1",
    ..._props.components
  }, {Test} = _components;
  // ...
  return _jsxs(_Fragment, {
    children: [_jsxs(_components.h1, {
      children: ["Hi ", props.foo]
    }), "\\n", _jsx(Test, {
      name: props.baz
    })]
  });
}
```

And, this provides us to pass an object containing the `props` key during function construction of the compiled source.

```js
const scope = {
  title: "My Article",
  props: {
    foo: "foofoo",
    bar: "barbar",
  }
}
``` 

Without the `recma-mdx-change-props`, the statements `props.foo` and `props.baz` will be `undefined` during function construction.

```js
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    ...props.components
  }, {Test} = _components;
  // ...
  return _jsxs(_Fragment, {
    children: [_jsxs(_components.h1, {
      children: ["Hi ", props.foo]
    }), "\\n", _jsx(Test, {
      name: props.baz
    })]
  });
}
```

## Options

All options are optional, and implemented as for being more flexible in case of need to change the names.

```typescript
export type ChangePropsOptions = {
  funcName?: string; // default is "_createMdxContent" which the plugin looks for
  propName?: string; // default is "props" which the plugin looks for
  propAs?: string; // default is "_props" which the plugin converts into
};
```

The options are self-explainotary, so that is why no need to represent more example here.

```javascript
use(recmaMdxChangeProps, {propAs: "__props__"} as ChangePropsOptions);
```

## Syntax tree

This plugin only modifies the ESAST (Ecma Script Abstract Syntax Tree) as explained.

## Types

This package is fully typed with [TypeScript][typescript]. The plugin options is exported as `ChangePropsOptions`.

## Compatibility

This plugin works with `unified` version 6+. It is compatible with `mdx` version 3+.

## Security

Use of `recma-mdx-change-props` does not involve user content so there are no openings for cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

### My Remark Plugins

- [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
- [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
- [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown
- [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
- [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
- [`remark-flexible-toc`](https://www.npmjs.com/package/remark-flexible-toc)
  – Remark plugin to expose the table of contents via `vfile.data` or via an option reference
- [`remark-mdx-remove-esm`](https://www.npmjs.com/package/remark-mdx-remove-esm)
  – Remark plugin to remove import and/or export statements (mdxjsEsm)

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.

## License

[MIT License](./LICENSE) © ipikuka

### Keywords

🟩 [unified][unifiednpm] 🟩 [recma][recmanpm] 🟩 [recma plugin][recmapluginnpm] 🟩 [esast][esastnpm] 🟩 [MDX][MDXnpm] 🟩 [recma mdx][recmamdxnpm]

[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[recmanpm]: https://www.npmjs.com/search?q=keywords:recma
[recmapluginnpm]: https://www.npmjs.com/search?q=keywords:recma%20plugin
[esastnpm]: https://www.npmjs.com/search?q=keywords:esast
[MDXnpm]: https://www.npmjs.com/search?q=keywords:mdx
[recmamdxnpm]: https://www.npmjs.com/search?q=keywords:recma%20mdx

[unified]: https://github.com/unifiedjs/unified
[recma]: https://mdxjs.com/docs/extending-mdx/#list-of-plugins
[esast]: https://github.com/syntax-tree/esast
[MDX]: https://mdxjs.com/
[micromark]: https://github.com/micromark/micromark
[typescript]: https://www.typescriptlang.org/

[badge-npm-version]: https://img.shields.io/npm/v/recma-mdx-change-props
[badge-npm-download]:https://img.shields.io/npm/dt/recma-mdx-change-props
[npm-package-url]: https://www.npmjs.com/package/recma-mdx-change-props

[badge-license]: https://img.shields.io/github/license/ipikuka/recma-mdx-change-props
[github-license-url]: https://github.com/ipikuka/recma-mdx-change-props/blob/main/LICENSE

[badge-build]: https://github.com/ipikuka/recma-mdx-change-props/actions/workflows/publish.yml/badge.svg
[github-workflow-url]: https://github.com/ipikuka/recma-mdx-change-props/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/recma-mdx-change-props
[typescript-url]: https://www.typescriptlang.org/
