'use strict';

/**
 * egg-grpc-util default config
 * @member Config#grpcUtil
 * @property {String} SOME_KEY - some description
 */
exports.grpcUtil = {
  rpcServer: {
    host: '0.0.0.0',
    port: 50051,
    protoArray: [{
      path: 'app/proto/login.proto',
      protoInfo: 'login.login.login',
      realFunction: 'user.login',
    }],
  },
  rpcClient: {
    host: '0.0.0.0',
    port: 50051,
    protoArray: [{
      path: 'app/proto/login.proto',
      protoInfo: 'login.login',
    }],
  },
};
