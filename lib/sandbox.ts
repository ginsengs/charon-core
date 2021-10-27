import { parseScript } from "esprima";
import * as vm from "vm";

type ContextVariables = Record<string, any>;

function asyncWrapper(code: string) {
  const ast = parseScript(code);
  const hasMainFunction = ast.body.some(
    (node) =>
      node.type === "FunctionDeclaration" &&
      node.id.type === "Identifier" &&
      node.id.name === "main"
  );
  if (!hasMainFunction) {
    throw new Error("Reqired main function");
  }

  function _callable(fn) {
    try {
      this.response = fn();
    } catch (e) {
      this.error = e;
    }
    this.callback(this.error, this.response);
  }
  return `${code}\n (${_callable.toString()}).call(this, main);`;
}

export function executeVirtualCode(code: string, context?: ContextVariables) {
  const executable = asyncWrapper(code);

  return new Promise((resolve, reject) => {
    context = {
      ...context,
      callback: (err, res) => {
        err && reject(err);
        resolve(res);
      },
    };
    vm.runInContext(executable, vm.createContext(context));
  });
}
