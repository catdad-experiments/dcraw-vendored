# dcraw vendored

[![travis][travis.svg]][travis.link]
[![appveyor][appveyor.svg]][appveyor.link]

[travis.svg]: https://travis-ci.org/catdad-experiments/dcraw-vendored.svg?branch=master
[travis.link]: https://travis-ci.org/catdad-experiments/dcraw-vendored
[appveyor.svg]: https://ci.appveyor.com/api/projects/status/github/catdad-experiments/dcraw-vendored?branch=master&svg=true
[appveyor.link]: https://ci.appveyor.com/project/catdad/dcraw-vendored

This projects distributes the `dcraw` binary through a series of npm modules, in order to allow using the binaries through `child_process`. This project compiles and distributes binaries for the following operating systems:

* Linux: [dcraw-vendored-linux](https://www.npmjs.com/package/dcraw-vendored-linux)
* Windows: [dcraw-vendored-win32](https://www.npmjs.com/package/dcraw-vendored-win32)
* MacOS: [dcraw-vendored-darwin](https://www.npmjs.com/package/dcraw-vendored-darwin)

All the modules can be in the following way:

```javascript
const dcraw = require('dcraw-vendored-linux');
const { promisify } = require('util');
const { execFile } = require('child_process');

// call dcraw with any command line arguments you want
// bonus points: it's a promise now
promisify(execFile)(dcraw, ['-w', '-W'])
  .then(result => {
    console.log(result);
  }).catch(err => {
    console.error(err);
  });
```

## Versions

The versions of these packages will follow the versions of `dcraw` itself. For example, version `9.28` of `dcraw` will be published as `9.28.x`, with path versions reflecting updates to the surrounding module (likely related to the build, as there isn't much to the module itself). However, I do not know how `dcraw` itself is versioned, so I recommend pinning this dependency just in case.

All versions are compiled using `NODEPS`, so some functionality may not work. Please look at the original source code for information on what functionality is provided by dependencies. If you'd like to see any dependencies included, please feel free to submit a PR.

## License

The original [`dcraw` code by Dave Coffin](https://www.cybercom.net/~dcoffin/dcraw/) is compiled without modifications. Regardless of modification, these modules are distributed under the GPL version 2 license, because that is what the header in the source code says and I do not want to get in trouble.

To the extent possible under law, I am waiving all copyright and related or neighboring rights to the build scripts and build-related code in this repository.
