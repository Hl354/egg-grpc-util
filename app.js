'use strict';

const RpcServer = require('lib/rpcServer');
const RpcClient = require('lib/rpcClient');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  /**
     * 这一步可以使用app创建ctx上下文，并可以成功加载到service等服务
     * @return {Promise<void>}
     */
  async didLoad() {
    const rpcServer = new RpcServer(this.app);
    rpcServer.addService();
    const rpcClient = new RpcClient(this.app);
    rpcClient.addService();
  }

}

module.exports = AppBootHook;
