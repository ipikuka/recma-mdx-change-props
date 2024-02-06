import { compile } from "@mdx-js/mdx";
import dedent from "dedent";

import recmaMdxChangeProps, { type ChangePropsOptions } from "../src";

describe("without the plugin", () => {
  // ******************************************
  it("sets no default value for the components (the default behaviour)", async () => {
    const source = dedent`
      # Hi {props.foo}
            
      <Test name={props.baz} />
    `;

    const compiledSource = await compile(source);

    expect(String(compiledSource)).toMatchInlineSnapshot(`
      "import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
      function _createMdxContent(props) {
        const _components = {
          h1: "h1",
          ...props.components
        }, {Test} = _components;
        if (!Test) _missingMdxReference("Test", true);
        return _jsxs(_Fragment, {
          children: [_jsxs(_components.h1, {
            children: ["Hi ", props.foo]
          }), "\\n", _jsx(Test, {
            name: props.baz
          })]
        });
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = props.components || ({});
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
      function _missingMdxReference(id, component) {
        throw new Error("Expected " + (component ? "component" : "object") + " \`" + id + "\` to be defined: you likely forgot to import, pass, or provide it.");
      }
      "
    `);
  });
});

describe("with the plugin (no option)", () => {
  // ******************************************
  it("sets the default value '() => null' for all components", async () => {
    const source = dedent`
      # Hi {props.foo}
              
      <Test name={props.baz} />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [recmaMdxChangeProps],
    });

    expect(String(compiledSource)).toMatchInlineSnapshot(`
      "import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
      function _createMdxContent(_props) {
        const _components = {
          h1: "h1",
          ..._props.components
        }, {Test} = _components;
        if (!Test) _missingMdxReference("Test", true);
        return _jsxs(_Fragment, {
          children: [_jsxs(_components.h1, {
            children: ["Hi ", props.foo]
          }), "\\n", _jsx(Test, {
            name: props.baz
          })]
        });
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = props.components || ({});
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
      function _missingMdxReference(id, component) {
        throw new Error("Expected " + (component ? "component" : "object") + " \`" + id + "\` to be defined: you likely forgot to import, pass, or provide it.");
      }
      "
    `);
  });
});

describe("with the plugin (has options)", () => {
  // ******************************************
  it("sets the default value '() => null' for the component passes the test (string)", async () => {
    const source = dedent`
      # Hi {props.foo}
              
      <Test name={props.baz} />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [[recmaMdxChangeProps, { propAs: "__props__" } as ChangePropsOptions]],
    });

    expect(String(compiledSource)).toMatchInlineSnapshot(`
      "import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
      function _createMdxContent(__props__) {
        const _components = {
          h1: "h1",
          ...__props__.components
        }, {Test} = _components;
        if (!Test) _missingMdxReference("Test", true);
        return _jsxs(_Fragment, {
          children: [_jsxs(_components.h1, {
            children: ["Hi ", props.foo]
          }), "\\n", _jsx(Test, {
            name: props.baz
          })]
        });
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = props.components || ({});
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
      function _missingMdxReference(id, component) {
        throw new Error("Expected " + (component ? "component" : "object") + " \`" + id + "\` to be defined: you likely forgot to import, pass, or provide it.");
      }
      "
    `);
  });
});
