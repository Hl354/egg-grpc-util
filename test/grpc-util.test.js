'use strict';

const mock = require('egg-mock');

describe('test/grpc-util.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/grpc-util-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, grpcUtil')
      .expect(200);
  });
});
