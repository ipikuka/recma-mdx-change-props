# recma-mdx-change-props

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]

This package provides using the expression containing for example {props.foo} in the mdx.

It is compatible with [MDX][MDX] version 3.

**This plugin is a [recma][recma] plugin that transforms the ESAST which stands for Ecma Script Abstract Syntax Tree (AST) that is used in production of compiled source for the MDX.**

## When should I use this?

**This plugin is useful if you want to use for example {props.foo} in the mdx** The `recma-mdx-change-props` changes the "props" parameter into "_props" in the function "_createMdxContent"; and makes appropriate changes in order to do so.

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

Now, running `node example.js` produces the `compiled source` like below; 
and provide us to pass an object containing the `props` key into the `run` function.
```js
{
  title: "My Article",
  props: {
    foo: "foofoo",
    bar: "barbar",
  }
}
``` 

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

Without the `recma-mdx-change-props`, the statements `props.foo` and `props.baz` will be undefined while running.

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
  funcName?: string; // default is "_createMdxContent"
  propName?: string; // default is "props"
  propAs?: string; // default is "_props"
};
```

The options are self-explainotary, so that is why no need to represent more example here.

```javascript
use(recmaMdxChangeProps, {propsAs: "__props__"} as ChangePropsOptions);
```

## Syntax tree

This plugin only modifies the ESAST (Ecma Script Abstract Syntax Tree) as explained.

## Types

This package is fully typed with [TypeScript][typeScript]. The plugin options is exported as `ChangePropsOptions`.

## Compatibility

This plugin works with unified version 6+ and estree version 2+. **It is compatible with mdx version 3**.

## Security

Use of `recma-mdx-change-props` does not involve user content so there are no openings for cross-site scripting (XSS) attacks.

## License

[MIT][license] © ipikuka

### Keywords

[unified][unifiednpm] [recma][recmanpm] [recma-plugin][recmapluginnpm] [esast][esastnpm] [MDX][MDXnpm]

[unified]: https://github.com/unifiedjs/unified
[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[recma]: https://mdxjs.com/docs/extending-mdx/#list-of-plugins
[recmanpm]: https://www.npmjs.com/search?q=keywords:recma
[recmapluginnpm]: https://www.npmjs.com/search?q=keywords:recma%20plugin
[esast]: https://github.com/syntax-tree/esast
[esastnpm]: https://www.npmjs.com/search?q=keywords:esast
[MDX]: https://mdxjs.com/
[MDXnpm]: https://www.npmjs.com/search?q=keywords:mdx
[typescript]: https://www.typescriptlang.org/
[license]: https://github.com/ipikuka/recma-mdx-change-props/blob/main/LICENSE
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown
[recmaEMCnpm]: https://www.npmjs.com/search?q=keywords:recma%20custom%20escape%20missing%20components
[npm-url]: https://www.npmjs.com/package/recma-mdx-change-props
[npm-image]: https://img.shields.io/npm/v/recma-mdx-change-props
[github-license]: https://img.shields.io/github/license/ipikuka/recma-mdx-change-props
[github-license-url]: https://github.com/ipikuka/recma-mdx-change-props/blob/master/LICENSE
[github-build]: https://github.com/ipikuka/recma-mdx-change-props/actions/workflows/publish.yml/badge.svg
[github-build-url]: https://github.com/ipikuka/recma-mdx-change-props/actions/workflows/publish.yml
[npm-typescript]: https://img.shields.io/npm/types/recma-mdx-change-props
