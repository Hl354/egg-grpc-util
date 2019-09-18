# egg-grpc-util

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/egg-grpc-util.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-grpc-util

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
// 自动配置config写法
exports.grpcUtil = {
    // rpcServer为grpc服务的配置，意味提供服务的
    // rpcClient为调用服务的配置
    rpcServer: {
          // host为建立服务绑定的ip，port为端口
          host: '0.0.0.0',
          port: 50051,
          // autoConfig是否自动配置 1为自动配置。意思为自动扫描protoPath字段下的
          // 路径的proto文件，自动配置有一些限制，主要有以下几点
          // 1：proto文件的文件名,package,service,function名字必须统一
          // 2：对应的函数必须在app/service的路径和在指定的proto路径致
          // 3：proto中的函数名和指定的函数名致，且一个proto文件只能有一个函数
          autoConfig: 1,
          // protoPath设定为自动配置时指定的proto文件路径
          protoPath: 'app/proto',
        },
        rpcClient: {
          // host:服务提供方的Ip，host:端口号，其余同rpcServer
          host: '0.0.0.0',
          port: 50051,
          autoConfig: 1,
          protoPath: 'app/proto',
        },
};
// 手动配置config写法
exports.grpcUtil = {
    rpcServer: {
          // host为建立服务绑定的ip，port为端口
          host: '0.0.0.0',
          port: 50051,
          // 手动输入配置protoArray唯一个数组，个数对应想要配置为服务的proto文件
          // path：proto文件路径
          // packageService： proto文件中的package和service名字的组合，.隔开
          // functionArray：proto文件中函数的名称数组
          // pointFunArray：对应的真实函数，login.login代表为service下的login文件中的login函数
          protoArray: [{
            path: 'app/proto/login.proto',
            packageService: 'login.login',
            functionArray: ['login', 'signUp'],
            pointFunArray: ['login.login', 'login.signUp'],
          },{
            path: 'app/proto/user/userInfo.proto',
            packageService: 'userInfo.userInfo',
            functionArray: ['userInfo'],
            pointFunArray: ['user.userInfo.userInfo'],
          },{
            path: 'app/proto/user/admin/adminInfo.proto',
            packageService: 'adminInfo.adminInfo',
            functionArray: ['adminInfo'],
            pointFunArray: ['user.admin.adminInfo.adminInfo'],
          }],
        },
        rpcClient: {
          host: '0.0.0.0',
          port: 50051,
          protoArray: [{
            path: 'app/proto/user/userInfo.proto',
            packageService: 'userInfo.userInfo',
          },{
            path: 'app/proto/login.proto',
            packageService: 'login.login',
          },{
            path: 'app/proto/user/admin/adminInfo.proto',
            packageService: 'adminInfo.adminInfo',
          }],
        },
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
