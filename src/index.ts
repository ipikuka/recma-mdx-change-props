import type { Plugin } from "unified";
import type { FunctionDeclaration, Node, Program } from "estree";
import { CONTINUE, SKIP, visit } from "estree-util-visit";

export type ChangePropsOptions = {
  funcName?: string;
  propName?: string;
  propAs?: string;
};

const DEFAULT_SETTINGS: ChangePropsOptions = {
  funcName: "_createMdxContent",
  propName: "props",
  propAs: "_props",
};

/**
 * It is a recma plugin which transforms the esAST / esTree.
 *
 * This recma plugin changes the "props" parameter into "_props" in the function "_createMdxContent";
 * and makes appropriate changes in order to be able to use the expression containing for example {props.foo} in the mdx.
 *
 * The "recma-mdx-change-props" basically converts into:
 *
 * function _createMdxContent(_props) {
 *   // ...
 *   const components = {
 *     // ...
 *     ..._props.components
 *   }
 * }
 *
 */
const plugin: Plugin<[ChangePropsOptions?], Program> = (options = {}) => {
  const settings = Object.assign({}, DEFAULT_SETTINGS, options) as Required<ChangePropsOptions>;

  return (tree: Node) => {
    let functionNode: FunctionDeclaration | undefined;

    visit(tree, (node, _, index) => {
      if (index === undefined) return;

      if (node.type !== "FunctionDeclaration") return SKIP;

      if (node.id.name === settings.funcName) {
        functionNode = node;

        node.params.forEach((param) => {
          if (param.type === "Identifier" && param.name === settings.propName) {
            param.name = settings.propAs;

            return;
          }
        });
      }

      return CONTINUE;
    });

    /* istanbul ignore next */
    if (!functionNode) return;

    visit(functionNode, (node) => {
      if (
        node.type === "MemberExpression" &&
        node.object.type === "Identifier" &&
        node.object.name === settings.propName &&
        node.property.type === "Identifier" &&
        node.property.name === "components"
      ) {
        node.object.name = settings.propAs;
      }
    });
  };
};

export default plugin;
