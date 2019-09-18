'use strict';
const grpc = require('grpc');

class RpcClient {

  constructor(app) {
    this.config = app.config.grpcUtil.rpcClient;
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
    const address = `${this.config.host}:${this.config.port}`;
    const protoArray = this.config.protoArray;
    for (const p of protoArray) {
      const protoInfo = p.protoInfo.split('.');
      const packageName = protoInfo[0];
      const serviceName = protoInfo[1];
      const proto = grpc.load(this.app.baseDir + '/' + p.path)[packageName];
      const client = new proto[serviceName](address, grpc.credentials.createInsecure());
      this.ctx.app[packageName] = client;
    }
    this.ctx.app.logger.info('[egg-util-grpc]:Success connect server ' + address);
  }
}

module.exports = RpcClient;
