'use strict';
const grpc = require('grpc');
const fs = require('fs');
const p = require('path');
const pc = require('promisify-call')

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

    if (this.config.autoConfig) {
      this.autoConfig(address);
    } else {
      this.manualConfig(address);
    }

    this.ctx.app.logger.info('[egg-util-grpc]:Successfully connect of service with ' + address);
  }

  // 自动配置
  autoConfig (address) {
    const protos = [];
    this.collectProto(protos, '');
    const len = protos.length;
    for (let i = 0; i < len; i++) {
      const p = protos[i];
      this.mountUnaryFunction(address,
          `${this.app.baseDir}/${this.config.protoPath}${p.path}`,
          p.name,
          p.name,
          [p.name]);
    }
  }

  // 手动配置
  manualConfig (address) {
    const protoArray = this.config.protoArray;
    const len = protoArray.length;
    for (let i = 0; i < len; i++) {
      const p = protoArray[i];
      const protoInfo = p.packageService.split('.');
      const packageName = protoInfo[0];
      const serviceName = protoInfo[1];
      this.mountUnaryFunction(address,
          `${this.app.baseDir}/${p.path}`,
          packageName,
          serviceName,
          p.functionArray);
    }
  }

  mountUnaryFunction (address, protoPath, packageName, serviceName, functionArray) {
    const proto = grpc.load(protoPath)[packageName];
    const client = new proto[serviceName](address, grpc.credentials.createInsecure());

    // 回调函数转为回调函数模式和Promise模式
    const len = functionArray.length;
    for (let i = 0; i < len; i++) {
      const sourceFunc = client[functionArray[i]];
      client[functionArray[i]] = function (data, fn) {
        return pc(this, sourceFunc, ...arguments);
      }
    }

    this.ctx.app[this.generateClientName(packageName, serviceName)] = client;
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

  generateClientName (packageName, serviceName) {
    return packageName + serviceName.slice(0,1).toUpperCase() + serviceName.slice(1);
  }
}

module.exports = RpcClient;
