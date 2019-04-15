/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const root = require('rootrequire');

const dist = path.resolve(root, 'dist');
const binname = process.platform === 'win32' ? 'dcraw.exe' : 'dcraw';
const bin = process.platform === 'win32'?
  path.resolve(root, 'windows', binname) :
  process.platform === 'darwin' ?
    path.resolve(root, 'macos', binname) :
    path.resolve(root, 'linux', binname);

const file = name => path.resolve(dist, name);

(async () => {
  await fs.ensureDir(dist);
  await fs.emptyDir(dist);

  const pkg = require('./package.json');
  await fs.outputJson(file('package.json'), Object.assign({}, pkg, {
    name: `${pkg.name}-${process.platform}`,
    main: 'index.js',
    private: undefined
  }), { spaces: 2 });

  await fs.copy(bin, file(binname));
  await fs.copy('./README.md', file('README.md'));

  await fs.outputFile(file('index.js'), `
module.exports = require('path').resolve(__dirname, process.platform === 'win32' ? 'dcraw.exe' : 'dcraw');
`);
})().then(() => {
  console.log('building package succeeded');
}).catch(err => {
  console.error('building package failed');
  console.error(err);
  process.exitCode = 1;
});
