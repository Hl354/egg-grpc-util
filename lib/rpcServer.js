'use strict';
const grpc = require('grpc');
const fs = require('fs');
const p = require('path');

class RpcServer {

  constructor(app) {
    this.config = app.config.grpcUtil.rpcServer;
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

  async addService() {
    if (!this.config)  return;

    if (!this.config.host || !this.config.port) {
      throw new Error('No RPC Server Config Info');
    }

    const server = new grpc.Server();
    const address = `${this.config.host}:${this.config.port}`;
    const autoConfig = this.config.autoConfig ? this.config.autoConfig : 0;

    switch (autoConfig) {
      case 1:
        const protos = [];
        this.collectProto(protos, '');
        for (const p of protos) {
          const proto = grpc.load(`${this.app.baseDir}/${this.config.protoPath}${p.path}`)[p.name];
          const pointFunction = this.replaceAll(p.path.slice(1).replace('.proto', ''), '/', '.') + '.' + p.name;
          server.addProtoService(proto[p.name].service, {[p.name]: this.mountRealFunction(pointFunction)});
        }
        break;

      default:
        const protoArray = this.config.protoArray;
        for (const p of protoArray) {
          const protoInfo = p.packageService.split('.');
          const packageName = protoInfo[0];
          const serviceName = protoInfo[1];
          const proto = grpc.load(this.app.baseDir + '/' + p.path)[packageName];
          server.addProtoService(proto[serviceName].service, this.generateImplementation(p.functionArray, p.pointFunArray));
        }
        break;
    }

    server.bind(address, grpc.ServerCredentials.createInsecure());
    server.start();
    this.ctx.app.logger.info('[egg-util-grpc]:Successfully create of service on ' + address);
  }

  generateImplementation(functionArray, pointFunArray){
    const funImplementation = {};
    for (let i = 0; i < functionArray.length; i++) {
      funImplementation[functionArray[i]] = this.mountRealFunction(pointFunArray[i]);
    }
    return funImplementation;
  }

  mountRealFunction(realFunction) {
    const address = realFunction.split('.');
    let fun = this.ctx.service;
    for (const a of address) { fun = fun[a]; }
    return fun;
  }

  collectProto(protos, path){
    const files = fs.readdirSync(`${this.app.baseDir}/${this.config.protoPath}` + path);
    for (const file of files) {
      if (file.endsWith('.proto')) {
        protos.push({path: path+ '/' + file, name: file.split('.')[0]});
      } else if (file.indexOf('.') === -1) {
        this.collectProto(protos, `${path}/${file}`);
      }
    }
  }

  replaceAll(str, source, target){
    return str.split(source).join(target);
  }
}

module.exports = RpcServer;
