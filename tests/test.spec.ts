import { compile } from "@mdx-js/mdx";
import dedent from "dedent";

import recmaMdxChangeProps, { type ChangePropsOptions } from "../src";

describe("without the plugin", () => {
  // ******************************************
  it("keep 'props' as it is", async () => {
    const source = dedent`
      # Hi {props.foo}
            
      <Test name={props.baz} />
    `;

    const compiledSource = await compile(source);

    expect(String(compiledSource)).toContain("function _createMdxContent(props)");
    expect(String(compiledSource)).toContain("...props.components");
  });
});

describe("with the plugin (no option)", () => {
  // ******************************************
  it("converts 'props' into '_props'", async () => {
    const source = dedent`
      # Hi {props.foo}
              
      <Test name={props.baz} />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [recmaMdxChangeProps],
    });

    expect(String(compiledSource)).toContain("function _createMdxContent(_props)");
    expect(String(compiledSource)).toContain("..._props.components");
  });
});

describe("with the plugin (has options)", () => {
  // ******************************************
  it("converts 'props' into '__props__'", async () => {
    const source = dedent`
      # Hi {props.foo}
              
      <Test name={props.baz} />
    `;

    const compiledSource = await compile(source, {
      recmaPlugins: [[recmaMdxChangeProps, { propAs: "__props__" } as ChangePropsOptions]],
    });

    expect(String(compiledSource)).toContain("function _createMdxContent(__props__)");
    expect(String(compiledSource)).toContain("...__props__.components");
  });
});
