

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;
const Store = require('../index.js');

let testStore = null;
const FakeComponent = class {
  constructor() {
    this.state = {};
  }

  setState(newData) {
    this.state = { ...this.state, ...newData };
  }
};

const component1 = new FakeComponent();
const component2 = new FakeComponent();
const component3 = new FakeComponent();

class FakeComponentWithError extends FakeComponent {
  setState() {
    throw new Error('_test_ Unable to render component _test_');
  }
}

const componentWithError = new FakeComponentWithError();

describe('Store Tests', function() {
  it('Should create a new store with initial data', () => {
    expect(() => testStore = new Store({ foo: 'bar' })).to.not.throw();
    expect(testStore).to.be.an.instanceof(Store);
  });

  it('Should create a new store without initial data', () => {
    expect(() => testStore = new Store()).to.not.throw();
    expect(testStore).to.be.an.instanceof(Store);
  });

  it('Should Set and get data from store', () => {
    const newData = { username: 'foo' };

    expect(testStore.setData(newData)).to.be.fulfilled;
    expect(testStore.getData()).to.deep.equal(newData);
    expect(testStore.getData('username')).to.equal(newData.username);
  });

  it('Should subscribe a component without watched data.', () => {
    expect(() => testStore.subscribe(component1)).to.not.throw();
  });

  it('Should subscribe a component with existing watched data.', () => {
    expect(() => testStore.subscribe(component2, ['username'])).to.not.throw();
  });

  it('Should subscribe a component with non-existing watched data.', () => {
    expect(() => testStore.subscribe(component3, ['bar'])).to.not.throw();
  });

  it('Should unsubscribe a component .', () => {
    expect(() => testStore.unsubscribe(component3)).to.not.throw();
  });

  it('Should Set data from store and render components', () => {
    const newData = { username: 'baz' };

    return expect(testStore.subscribe(component3, ['bar']).setData(newData)).to.be.fulfilled;
  });

  it('Should fails if component rendering fails', () => {
    const newData = { username: 'baz' };

    return expect(testStore.subscribe(componentWithError).setData(newData)).to.be.rejectedWith(Error);
  });
});

