import { executeVirtualCode } from "../lib/sandbox";

test("Sandbox check", async () => {
  const code = `
    function main() {
        return new Promise((resolve, reject) => {
            fs.readdir('.', (err, files) => {
                resolve(files);
            });
        });
    }
    `;
  const promise = executeVirtualCode(code, {
    fs: require("fs"),
  });
  const res = await promise;
  console.log(res);
});

test.todo('Not allowed eval');

test.todo('Not allowed new Function');

test.todo('Not allowed script.onload');

