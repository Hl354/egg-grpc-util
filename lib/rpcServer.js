'use strict';
const grpc = require('grpc');
const fs = require('fs');

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

    if (this.config.autoConfig) {
      await this.autoConfig(address, server);
    } else {
      await this.manualConfig(address, server);
    }

    server.bind(address, grpc.ServerCredentials.createInsecure());
    server.start();
    this.ctx.app.logger.info('[egg-util-grpc]:Successfully create of service on ' + address);
  }

  async autoConfig (address, server) {
    const protos = [];
    this.collectProto(protos, '');
    const len = protos.length;
    for (let i = 0; i < len; i++) {
      const p = protos[i];
      const proto = grpc.load(`${this.app.baseDir}/${this.config.protoPath}${p.path}`)[p.name];
      const pointFunction = this.replaceAll(p.path.slice(1).replace('.proto', ''), '/', '.') + '.' + p.name;
      server.addProtoService(proto[p.name].service, await this.generateImplementation(
          [p.name], [pointFunction]));
    }
  }

  async manualConfig (address, server) {
    const protoArray = this.config.protoArray;
    const len = protoArray.length;
    for (let i = 0; i < len; i++) {
      const p = protoArray[i];
      const protoInfo = p.packageService.split('.');
      const packageName = protoInfo[0];
      const serviceName = protoInfo[1];
      const proto = grpc.load(this.app.baseDir + '/' + p.path)[packageName];
      server.addProtoService(proto[serviceName].service,
          await this.generateImplementation(p.functionArray, p.pointFunArray, p.paramArray));
    }
  }

  async generateImplementation (functionArray, pointFunArray, paramArray) {
    const funImplementation = {};
    for (let i = 0; i < functionArray.length; i++) {
      const func = this.mountRealFunction(pointFunArray[i]);
      funImplementation[functionArray[i]] = async function (req, callback) {
        if (paramArray) {
          const arr = [];
          for (let i = 0; i < paramArray.length; i++) {
            arr[i] = req.request[paramArray[i]];
          }
          callback(null, await func.apply(this, arr));
        } else {
          callback(null, await func(req.request));
        }
      }
    }
    return funImplementation;
  }

  mountRealFunction (realFunction) {
    const address = realFunction.split('.');
    let fun = this.ctx.service;
    for (const a of address) { fun = fun[a]; }
    return fun;
  }

  collectProto (protos, path) {
    const files = fs.readdirSync(`${this.app.baseDir}/${this.config.protoPath}` + path);
    const len = files.length;
    for (let i = 0; i < len; i++){
      const file = files[i];
      if (file.endsWith('.proto')) {
        protos.push({path: path + '/' + file, name: file.split('.')[0]});
      } else if (file.indexOf('.') === -1) {
        this.collectProto(protos, `${path}/${file}`);
      }
    }
  }

  replaceAll (str, source, target) {
    return str.split(source).join(target);
  }
}

module.exports = RpcServer;
