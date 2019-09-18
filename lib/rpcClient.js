'use strict';
const grpc = require('grpc');
const fs = require('fs');
const p = require('path');

class RpcClient {

  constructor(app) {
    this.config = app.config.grpcUtil.rpcClient;
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

  async addService() {
    if (!this.config) return ;

    if (!this.config.host || !this.config.port) {
      throw new Error('No RPC Server Config Info');
    }

    const address = `${this.config.host}:${this.config.port}`;
    const autoConfig = this.config.autoConfig ? this.config.autoConfig : 0;

    switch (autoConfig) {
      case 1:
        const protos = [];
        this.collectProto(protos, '');
        for (const p of protos) {
          const proto = grpc.load(`${this.app.baseDir}/${this.config.protoPath}${p.path}`)[p.name];
          const client = new proto[p.name](address, grpc.credentials.createInsecure());
          this.ctx.app[this.generateClientName(p.path)] = client;
        }
        break;

      default:
        const protoArray = this.config.protoArray;
        for (const p of protoArray) {
          const protoInfo = p.packageService.split('.');
          const packageName = protoInfo[0];
          const serviceName = protoInfo[1];
          const proto = grpc.load(`${this.app.baseDir}/${p.path}`)[packageName];
          const client = new proto[serviceName](address, grpc.credentials.createInsecure());
          this.ctx.app[packageName + serviceName.slice(0,1).toUpperCase() + serviceName.slice(1)] = client;
        }
        break;
    }

    this.ctx.app.logger.info('[egg-util-grpc]:Successfully connect of service with ' + address);
  }

  collectProto(protos, path){
    const files = fs.readdirSync(`${this.app.baseDir}/${this.config.protoPath}` + path);
    for (const file of files) {
      if (file.endsWith('.proto')) {
        protos.push({path: path + '/' + file, name: file.split('.')[0]});
      } else if (file.indexOf('.') === -1) {
        this.collectProto(protos, `${path}/${file}`);
      }
    }
  }

  generateClientName(path){
    path = path.slice(1).replace('.proto', '').split('/');
    let str = path[0];
    for (let i = 1; i < path.length; i++) {
      str += path[i].slice(0, 1).toUpperCase() + path[i].slice(1);
    }
    return str;
  }
}

module.exports = RpcClient;
