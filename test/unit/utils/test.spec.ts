import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

describe('Test unit test', () => {
  it('Default test since no unit tests are available', async () => {
      var test = 'test';
      test.should.be.a('string');
  });
})
