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
    autoConfig: 0,
    protoPath: 'app/proto',
    protoArray: [{
      path: 'app/proto/login.proto',
      packageService: 'login.login',
      functionArray: ['login', 'signUp'],
      pointFunArray: ['user.login', 'user.signUp'],
    }],
  },
  rpcClient: {
    host: '0.0.0.0',
    port: 50051,
    autoConfig: 0,
    protoPath: 'app/proto',
    protoArray: [{
      path: 'app/proto/login.proto',
      packageService: 'login.login',
    }],
  },
};
