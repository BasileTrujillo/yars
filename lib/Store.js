const Subscriber = require('./Subscriber');

/**
 * Generic store
 * Extend it and subscribe to it
 */
class Store {
  /**
   * Define Data and Subscribers
   *
   * @param {Object} initialData Initial data object
   */
  constructor(initialData) {
    this.data = initialData || {};
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
   * @see https://lodash.com/docs/4.17.4#has
   *
   * @return {Store} Return this
   */
  subscribe(component, watchedData) {
    this.subscribers.push(new Subscriber(component, watchedData));

    return this;
  }

  /**
   * Remove a component from the subscriber list.
   *
   * @param {React.Component} component A React Component
   * @return {Store} Return this
   */
  unsubscribe(component) {
    for (let i = 0; i < this.subscribers.length; i++) {
      if (this.subscribers[i] && this.subscribers[i].component === component) {
        this.subscribers.splice(i, 1);
        break;
      }
    }

    return this;
  }

  /**
   * Merge this.data with the object
   * passed as argument (in an immutable way)
   * and render all subscribers
   *
   * @param {Object} newData New Data to merge into this.data
   * @return {Promise} A Promise that should render all components (in a Promise.All)
   */
  setData(newData) {
    this.data = { ...this.data, ...newData };

    return this.renderSubscribers(newData);
  }

  /**
   * Render asynchronously all subscribers
   *
   * @param {Object} newData New Data merged into this.data
   * @return {Promise} A Promise that should render all components (in a Promise.All)
   */
  renderSubscribers(newData) {
    return Promise.all(
      this.subscribers.map(subscriber => subscriber.renderComponent(newData))
    ).catch(error => {
      console.error('Unable to render component from Store.');
      throw error;
    });
  }

  /**
   * Get all or a part of data store
   *
   * @param {String} property The data store key. Leave undefined to get all data.
   * @return {*} The whole data object or a specified part
   */
  getData(property) {
    if (typeof property !== 'undefined') {
      return this.data[property];
    } else {
      return this.data;
    }
  }
}

module.exports = Store;
