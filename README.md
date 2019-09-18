# egg-grpc-util

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-grpc-util.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-grpc-util
[travis-image]: https://img.shields.io/travis/eggjs/egg-grpc-util.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-grpc-util
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-grpc-util.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-grpc-util?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-grpc-util.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-grpc-util
[snyk-image]: https://snyk.io/test/npm/egg-grpc-util/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-grpc-util
[download-image]: https://img.shields.io/npm/dm/egg-grpc-util.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-grpc-util

<!--
Description here.
-->

## Install

```bash
$ npm i egg-grpc-util --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.grpcUtil = {
  enable: true,
  package: 'egg-grpc-util',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.grpcUtil = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)