/* eslint-env mocha */
/* eslint-disable no-console */

const { promisify } = require('util');
const { pipeline } = require('stream');
const { execFile } = require('child_process');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const root = require('rootrequire');
const { expect } = require('chai');

const bin = process.env.PKG_TEST ? require(path.resolve(root, 'dist')) :
  process.platform === 'win32'?
    path.resolve(root, 'windows/dcraw.exe') :
    process.platform === 'darwin' ?
      path.resolve(root, 'macos/dcraw') :
      path.resolve(root, 'linux/dcraw');

console.log(`testing using binary at ${bin}`);

const fileroot = path.resolve(root, 'temp');
const resolve = (name = '') => path.resolve(fileroot, name);
const drive = id => `http://drive.google.com/uc?export=view&id=${id}`;

const images = [{
  url: drive('1moh6PXVRXQ70IwdanJsT-UBitCRxLQxq'),
  name: 'kestrel.dng',
  imagepath: resolve('kestrel.dng'),
  hash: '76336ee9af7539d10170792a529d5eab723c54dc2eaedac09663dc37c2091f63',
  result: '3658619edf6ed01c929442e2e27932856ddaf265cfdfd1d418c4b08badb380e5'
}];

const fetchImage = async (image) => {
  console.log(`fetching "${image.name}" from ${image.url}`);

  const res = await fetch(image.url);

  if (res.ok) {
    await promisify(pipeline)(res.body, fs.createWriteStream(image.imagepath));
  } else {
    throw new Error(`"${image.name}" responded with ${res.statusCode}`);
  }
};

const hashFile = async (imgpath) => {
  const hash = crypto.createHash('sha256');
  hash.setEncoding('hex');

  await promisify(pipeline)(fs.createReadStream(imgpath), hash);

  return hash.read();
};

const fileExists = async (filepath) => {
  try {
    const stat = await fs.stat(filepath);
    return stat.isFile();
  } catch (e) {
    return false;
  }
};

const validImage = async (imgpath, hash) => {
  if (!(await fileExists(imgpath))) {
    return false;
  }

  const filehash = await hashFile(imgpath);

  return filehash === hash;
};

const getAllImages = async () => {
  for (let image of images) {
    if (await validImage(image.imagepath, image.hash)) {
      console.log(`using valid local copy of "${image.name}"`);
      continue;
    }

    await fetchImage(image);

    if (!(await validImage(image.imagepath, image.hash))) {
      throw new Error(`could not download "${image.name}"`);
    }
  }
};

describe('dcraw', () => {
  before(async () => {
    await fs.ensureDir(fileroot);
    await getAllImages();
  });

  images.forEach(({ name, result }) => {
    it(`converts "${name}"`, async () => {
      const filename = path.parse(name).name;
      const resultfile = path.resolve(fileroot, `${filename}.ppm`);

      try {
        await promisify(execFile)(bin, ['-W', '-w', name], {
          cwd: fileroot
        });

        expect(await fileExists(resultfile)).to.equal(true);
        const resulthash = await hashFile(resultfile);

        expect(resulthash).to.equal(result);
      } catch (e) {
        throw e;
      } finally {
        await fs.remove(resultfile);
      }
    });
  });
});
