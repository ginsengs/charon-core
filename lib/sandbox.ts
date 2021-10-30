import * as vm from 'vm';
import { EventEmitter } from 'events';
import fetch from 'node-fetch';

export class Sandbox extends EventEmitter {
  protected modules: Record<string, any> = {};

  constructor(modules: Record<string, any> = {}) {
    super();
    this.modules = {
      ...modules,
      fetch,
    };
  }

  execute(code: string) {
    vm.runInContext(code, vm.createContext({
      ...this.modules,
      runtime: {
        on: this.on.bind(this),
        emit: this.emit.bind(this),
      },
    }));
  }

  bindModule(name: string, module: any) {
    this.modules[name] = module;
  }
}
