import { executeVirtualCode, Sandbox } from '../lib/sandbox';
import * as fs from 'fs-extra';

test('Sandbox check', async () => {
  const sandbox = new Sandbox();
  sandbox.bindModule('fs', fs);

  await new Promise((resolve) => {
    sandbox.on('message', (msg) => {
      console.log('emitter', msg);
      resolve('');
    });
    sandbox.execute(`
      runtime.emit('message', 'hello!!!!');
    `);
  });
});

test.todo('Not allowed eval');

test.todo('Not allowed new Function');

test.todo('Not allowed script.onload');

