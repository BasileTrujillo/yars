'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;
const Store = require('../index.js');

let testStore = null;
const fakeComponent = {
  setState: (newData) => fakeComponent.state = {...fakeComponent.state, ...newData},
  state: {}
};

describe('Store Tests', function() {
  it('Should create a new store with initial data', () => {
    expect(() => testStore = new Store({foo: 'bar'})).to.not.throw();
    expect(testStore).to.be.an.instanceof(Store);
  });

  it('Should create a new store without initial data', () => {
    expect(() => testStore = new Store()).to.not.throw();
    expect(testStore).to.be.an.instanceof(Store);
  });

  it('Should Set and get data from store', () => {
    const newData = {username: 'foo'};

    expect(testStore.setData(newData)).to.be.fulfilled;
    expect(testStore.getData()).to.deep.equal(newData);
    expect(testStore.getData('username')).to.equal(newData.username);
  });

  it('Should subscribe a component without watched data.', () => {
    expect(() => testStore.subscribe(fakeComponent)).to.not.throw();
  });

  it('Should subscribe a component with existing watched data.', () => {
    expect(() => testStore.subscribe(fakeComponent, [ 'username' ])).to.not.throw();
  });

  it('Should subscribe a component with non-existing watched data.', () => {
    expect(() => testStore.subscribe(fakeComponent, [ 'bar' ])).to.not.throw();
  });

  it('Should Set data from store and render components', () => {
    const newData = {username: 'baz'};

    expect(testStore.setData(newData)).to.be.fulfilled;
  });

  it('Should fails if component rendering fails', () => {
    const newData = {username: 'baz'};
    fakeComponent.setState = () => {
      throw new Error('_test_ Unable to render component _test_')
    };
    expect(testStore.setData(newData)).to.be.rejectedWith(Error);
  });
});

