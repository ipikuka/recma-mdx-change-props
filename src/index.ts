import { CONTINUE, SKIP, visit } from "estree-util-visit";
import type { Node } from "estree";

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
export default function recmaMdxChangeProps(options: ChangePropsOptions = {}) {
  const settings = Object.assign({}, DEFAULT_SETTINGS, options) as Required<ChangePropsOptions>;

  return (tree: Node) => {
    visit(tree, (node, _, index) => {
      if (!index) return;

      if (node.type !== "FunctionDeclaration") return SKIP;

      if (node.id.name !== settings.funcName) return SKIP;

      node.params.forEach((param) => {
        if (param.type === "Identifier" && param.name === settings.propName) {
          param.name = settings.propAs;

          return;
        }
      });

      const statements = node.body.body;

      statements.forEach((statement) => {
        if (statement.type === "VariableDeclaration") {
          const declarations = statement.declarations;

          declarations.forEach((direction) => {
            if (direction.id.type === "Identifier" && direction.id.name === "_components") {
              if (direction.init?.type === "ObjectExpression") {
                const properties = direction.init.properties;

                properties.forEach((property) => {
                  if (
                    property.type === "SpreadElement" &&
                    property.argument.type === "MemberExpression"
                  ) {
                    property.argument.object.type === "Identifier" &&
                      property.argument.object.name === settings.propName &&
                      (property.argument.object.name = settings.propAs);
                  }
                });
              }
            }
          });
        }
      });

      return CONTINUE;
    });
  };
}
