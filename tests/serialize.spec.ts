import dedent from "dedent";
import { serialize } from "next-mdx-remote/serialize";
import { serialize as serialize_ } from "next-mdx-remote-client/serialize";

import recmaMdxChangeProps from "../src";

describe("without the plugin", () => {
  // ******************************************
  test("with single component in MDX", async () => {
    const source = dedent`
      <Test name={bar} />
    `;

    const result = await serialize(source, {
      mdxOptions: { recmaPlugins: [recmaMdxChangeProps] },
    });

    expect(String(result.compiledSource)).toContain(dedent`
      function _createMdxContent(_props) {
        const {Test} = {
          ..._provideComponents(),
          ..._props.components
        };
        if (!Test) _missingMdxReference("Test", true, "1:1-1:20");
        return _jsxDEV(Test, {
          name: bar
        }, undefined, false, {
          fileName: "<source.js>",
          lineNumber: 1,
          columnNumber: 1
        }, this);
      }
    `);

    const result_ = await serialize_({
      source,
      options: {
        mdxOptions: { recmaPlugins: [recmaMdxChangeProps] },
      },
    });

    if ("error" in result_) {
      throw "Shouldn't be any syntax error !";
    }

    expect(String(result_.compiledSource)).toContain(dedent`
      function _createMdxContent(_props) {
        const {Test} = {
          ..._provideComponents(),
          ..._props.components
        };
        if (!Test) _missingMdxReference("Test", true);
        return _jsx(Test, {
          name: bar
        });
      }
    `);
  });

  // ******************************************
  test("works with component names with a dot", async () => {
    const source = "<motion.p />";

    const result = await serialize(source, {
      mdxOptions: { recmaPlugins: [recmaMdxChangeProps] },
    });

    expect(String(result.compiledSource)).toContain(dedent`
      function _createMdxContent(_props) {
        const {motion} = {
          ..._provideComponents(),
          ..._props.components
        };
        if (!motion) _missingMdxReference("motion", false, "1:1-1:13");
        if (!motion.p) _missingMdxReference("motion.p", true, "1:1-1:13");
        return _jsxDEV(motion.p, {}, undefined, false, {
          fileName: "<source.js>",
          lineNumber: 1,
          columnNumber: 1
        }, this);
      }
    `);

    const result_ = await serialize_({
      source,
      options: {
        mdxOptions: { recmaPlugins: [recmaMdxChangeProps] },
      },
    });

    if ("error" in result_) {
      throw "Shouldn't be any syntax error !";
    }

    expect(String(result_.compiledSource)).toContain(dedent`
      function _createMdxContent(_props) {
        const {motion} = {
          ..._provideComponents(),
          ..._props.components
        };
        if (!motion) _missingMdxReference("motion", false);
        if (!motion.p) _missingMdxReference("motion.p", true);
        return _jsx(motion.p, {});
      }
    `);
  });

  // ******************************************
  test("fragments", async () => {
    const source = dedent`
      <Test content={<>Rendering a fragment</>} />
    `;

    const result = await serialize(source, {
      mdxOptions: { recmaPlugins: [recmaMdxChangeProps] },
    });

    expect(String(result.compiledSource)).toContain(dedent`
      function _createMdxContent(_props) {
        const {Test} = {
          ..._provideComponents(),
          ..._props.components
        };
        if (!Test) _missingMdxReference("Test", true, "1:1-1:45");
        return _jsxDEV(Test, {
          content: _jsxDEV(_Fragment, {
            children: "Rendering a fragment"
          }, undefined, false, {
            fileName: "<source.js>",
            lineNumber: 1,
            columnNumber: 16
          }, this)
        }, undefined, false, {
          fileName: "<source.js>",
          lineNumber: 1,
          columnNumber: 1
        }, this);
      }
    `);

    const result_ = await serialize_({
      source,
      options: {
        mdxOptions: { recmaPlugins: [recmaMdxChangeProps] },
      },
    });

    if ("error" in result_) {
      throw "Shouldn't be any syntax error !";
    }

    expect(String(result_.compiledSource)).toContain(dedent`
      function _createMdxContent(_props) {
        const {Test} = {
          ..._provideComponents(),
          ..._props.components
        };
        if (!Test) _missingMdxReference("Test", true);
        return _jsx(Test, {
          content: _jsx(_Fragment, {
            children: "Rendering a fragment"
          })
        });
      }
    `);
  });
});
