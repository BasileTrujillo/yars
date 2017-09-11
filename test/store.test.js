'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;
const Store = require('../index.js');

describe('Store Tests', function() {
  it('Should create a new store', () => {
    expect(new Store()).to.be.an.instanceof(Store);
  });
});

