'use strict';

const Subscriber = require('./Subscriber');

/**
 * Generic store
 * Extend it and subscribe to it
 */
class Store {
  /**
   * Define Data and Subscribers
   */
  constructor() {
    this.data = {};
    this.subscribers = [];
  }

  /**
   * Add a component to the subscriber list.
   * You can also attach a watchedData array
   * that contain a list of data key to watch
   * to render the component.
   *
   * @param {React.Component} component A React Component
   * @param {Array} watchedData Array of string defining key to watch from this.data (use _.has() formating)
   *
   * @see https://lodash.com/docs/4.17.4#has
   */
  subscribe(component, watchedData) {
    this.subscribers.push(new Subscriber(component, watchedData));
  }

  /**
   * Merge this.data with the object
   * passed as argument (in an immutable way)
   * and render all subscribers
   *
   * @param {Object} newData New Data to merge into this.data
   * @return {Promise}
   */
  setData(newData) {
    this.data = {...this.data, ...newData};

    return this.renderSubscribers(newData);
  }

  /**
   * Render asynchronously all subscribers
   *
   * @param {Object} newData New Data merged into this.data
   * @return {Promise.<*>}
   */
  renderSubscribers(newData) {
    return Promise.all(
      this.subscribers.map((subscriber) => subscriber.renderComponent(newData))
    ).catch((error) => {
      console.error('Unable to render component from Store.');
      throw error;
    });
  }
}

module.exports = Store;
