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

## Prompt
```
目前只支持简单的RPC服务，不支持带有流的。
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
    // rpcServer为grpc服务的配置，意味提供服务的 可选
    // rpcClient为调用服务的配置 可选
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
            functionArray: ['userInfo'],
          },{
            path: 'app/proto/login.proto',
            packageService: 'login.login',
            functionArray: ['login', 'signUp'],
          },{
            path: 'app/proto/user/admin/adminInfo.proto',
            packageService: 'adminInfo.adminInfo',
            functionArray: ['adminInfo'],
          }],
        },
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

```js
   // 下面是一个路径在app/prroto中的login.proto文件
   // package name = login <=> (package login;)
   // service name = login <=> (service login)
   // 函数有两个 1：login 函数 <=> (rpc login(pingRequest))
   //           2: signUp 函数 <=> (rpc signUp(pingRequest))
   syntax = "proto3";
   
   package login;
   
   service login{
       rpc login(pingRequest) returns (pingReply) {};
       rpc signUp(pingRequest) returns (pingReply) {}
   }
   
   message pingRequest {
       string userName = 1;
       string password = 2;
   }
   
   message pingReply {
       int32 code = 1;
       string msg = 2;
   }

```
```js
   // 所希望指向的函数为在app/service下的login文件中的login和signUp函数 <=> (pointFunArray: ['login.login', 'login.signUp'])
   // 在login.js中有两个函数，分别为login和signUp，注意这两个函数的参数格式为{userName, password}
   // 而不是(userName, password)，因为传过来的是对象，并不能确定顺序，所以切记参数形式必须为{userName, password}这种
  'use strict';
   const Service = require('egg').Service;
   class Login extends Service {
       async login({userName, password}) {
           if (userName === 'abc' && password === 'abc') {
             return { code: 1, msg: 'login' };
           }
           return { code: 0, msg: 'login' };
         }
       async signUp({userName, password}) {
           if (userName === 'abc' && password === 'abc') {
             return { code: 1, msg: 'signUp' };
           }
           return { code: 0, msg: 'signUp' };
         }
   }
   module.exports = Login;
```
```config
   // 这个proto文件在rpcServer的手动配置为
   {
       path: 'app/proto/login.proto',
       packageService: 'login.login',
       functionArray: ['login', 'signUp'],
       pointFunArray: ['login.login', 'login.signUp'],
   }
   // 这个proto文件在rpcClient的手动配置为
   {
       path: 'app/proto/login.proto',
       packageService: 'login.login',
       functionArray: ['login', 'signUp'],
   }
```
```js
   // 当配置了客户端之后如何使用？
   // 不管是自动配置还是手动配置，所挂载到app的Client都是proto中的package名称+service名称
   // 例如packageName = 'user',serviceName = 'login' 则Client为userLogin
   // 函数名称functionName为functionArray中配置的，若是自动配置则packageName==serviceName==functionName
   // userLogin <=> user + login的首字母大写
   // 使用方式一：回调函数
    ctx.app.userLogin.login({userName: '123', password: '123'}, (err, response){
      /**
        在这里可以处理返回来的结果
      */
      doTo();
    });
   // 使用方式二：async/await
    const res1 = await ctx.app.userLogin.login({userName: '123', password: '123'});
    console.log(res1);

      
```
## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
