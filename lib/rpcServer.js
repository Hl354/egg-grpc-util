'use strict';
const grpc = require('grpc');

class RpcServer {

  constructor(app) {
    this.config = app.config.grpcUtil.rpcServer;
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

  async addService() {
    if (!this.config) {
      return;
    }
    if (!this.config.host || !this.config.port) {
      throw new Error('Not RPC Server Config Info');
    }
    const protoArray = this.config.protoArray;
    const address = `${this.config.host}:${this.config.port}`;
    const server = new grpc.Server();
    for (const p of protoArray) {
      const protoInfo = p.protoInfo.split('.');
      const packageName = protoInfo[0];
      const serviceName = protoInfo[1];
      const functionName = protoInfo[2];
      const proto = grpc.load(this.app.baseDir + '/' + p.path)[packageName];
      server.addProtoService(proto[serviceName].service, { [functionName]: this.getRealFunction(p.realFunction) });
    }
    server.bind(address, grpc.ServerCredentials.createInsecure());
    server.start();
  }

  getRealFunction(realFunction) {
    const address = realFunction.split('.');
    let fun = this.ctx.service;
    for (const a of address) {
      fun = fun[a];
    }
    return fun;
  }
}

module.exports = RpcServer;
