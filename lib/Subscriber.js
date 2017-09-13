const has = require('lodash.has');

/**
 * Subscriber class
 * Handle component and watched data
 */
class Subscriber {
  /**
   * Set Component and Watched Data
   *
   * @param {React.Component} component A React Component
   * @param {Array} watchedData Array of string defining key to watch from this.data (use _.has() formating)
   *
   * @see https://lodash.com/docs/4.17.4#has
   */
  constructor(component, watchedData) {
    this.component = component;
    this.watchedData = watchedData;
  }

  /**
   * Return whether the component should render or not depending on this.watchedData
   * If this.watchedData is not defined or null or empty, the component will render.
   * Else component will render only if the watched property is a part of newData argument
   *
   * @param {Object} newData New Data merged into store data
   * @return {boolean} Return whether the component should render or not
   */
  shouldComponentUpdate(newData) {
    let shouldRender = false;
    const watchedDataLenght = this.watchedData ? this.watchedData.length : 0;

    if (watchedDataLenght > 0) {
      for (let i = 0; i < watchedDataLenght; i++) {
        if (has(newData, this.watchedData[i])) {
          shouldRender = true;
          break;
        }
      }
    } else {
      shouldRender = true;
    }

    return shouldRender;
  }

  /**
   * Render this.component is this.shouldComponentUpdate() === true
   * This render a component by setting an arbitrary state property
   * to properly force the rendering without using forceUpdate()
   *
   * @param {Object} newData New Data merged into store data
   * @return {Promise} A Promise that should render a component
   */
  renderComponent(newData) {
    return new Promise(resolve => {
      if (this.shouldComponentUpdate(newData) === true) {
        const index =
          this.component.state && this.component.state.__shouldRender ?
            this.component.state.__shouldRender :
            0;

        this.component.setState({ __shouldRender: index + 1 });
      }

      resolve();
    });
  }
}

module.exports = Subscriber;
