import { compile } from "@mdx-js/mdx";
import dedent from "dedent";

import recmaMdxChangeProps, { type ChangePropsOptions } from "../src";

const source = dedent`
  Hi <Test name={props.baz} />
`;

describe("without the plugin", () => {
  // ******************************************
  it("keep 'props' as it is, when outputFormat is program", async () => {
    const compiledSource = await compile(source, { outputFormat: "program" });

    expect(String(compiledSource)).toContain(dedent`
      function _createMdxContent(props) {
        const _components = {
          p: "p",
          ...props.components
        }, {Test} = _components;
    `);
  });

  // ******************************************
  it("keep 'props' as it is, when outputFormat is function-body", async () => {
    const compiledSource = await compile(source, { outputFormat: "function-body" });

    expect(String(compiledSource)).toContain(dedent`
      function _createMdxContent(props) {
        const _components = {
          p: "p",
          ...props.components
        }, {Test} = _components;
    `);
  });
});

describe("with the plugin (no option)", () => {
  // ******************************************
  it("converts 'props' into '_props', when outputFormat is program", async () => {
    const compiledSource = await compile(source, {
      recmaPlugins: [recmaMdxChangeProps],
      outputFormat: "program",
    });

    expect(String(compiledSource)).toContain(dedent`
      function _createMdxContent(_props) {
        const _components = {
          p: "p",
          ..._props.components
        }, {Test} = _components;
    `);
  });

  // ******************************************
  it("converts 'props' into '_props', when outputFormat is function-body", async () => {
    const compiledSource = await compile(source, {
      recmaPlugins: [recmaMdxChangeProps],
      outputFormat: "function-body",
    });

    expect(String(compiledSource)).toContain(dedent`
      function _createMdxContent(_props) {
        const _components = {
          p: "p",
          ..._props.components
        }, {Test} = _components;
    `);
  });
});

describe("with the plugin (with options)", () => {
  // ******************************************
  it("converts 'props' into '__props__', when outputFormat is program", async () => {
    const compiledSource = await compile(source, {
      recmaPlugins: [[recmaMdxChangeProps, { propAs: "__props__" } as ChangePropsOptions]],
      outputFormat: "program",
    });

    expect(String(compiledSource)).toContain(dedent`
      function _createMdxContent(__props__) {
        const _components = {
          p: "p",
          ...__props__.components
        }, {Test} = _components;
    `);
  });

  // ******************************************
  it("converts 'props' into '__props__', when outputFormat is function-body", async () => {
    const compiledSource = await compile(source, {
      recmaPlugins: [[recmaMdxChangeProps, { propAs: "__props__" } as ChangePropsOptions]],
      outputFormat: "function-body",
    });

    expect(String(compiledSource)).toContain(dedent`
      function _createMdxContent(__props__) {
        const _components = {
          p: "p",
          ...__props__.components
        }, {Test} = _components;
    `);
  });
});
