# YARS - Yet Another React Store

[![NPM Badge](https://img.shields.io/npm/v/yars.svg)](https://www.npmjs.com/package/yars)
[![CircleCI](https://circleci.com/gh/BasileTrujillo/yars.svg?style=shield)](https://circleci.com/gh/BasileTrujillo/yars)
[![Code Coverage](https://codeclimate.com/github/BasileTrujillo/yars/badges/coverage.svg)](https://codeclimate.com/github/BasileTrujillo/yars)

This project is a lightfull and powerful No-Flux OOP way to share data between react components.

No Actions, no Dipatcher, no Reducer, no Functionnal development, just a simple class representing a store with data, getters/setters and every related function to fetch and/or modify your data store.
Component subscribing alow your components to be rendered when data (or even just a part) has been changed.
Your store act as a single source of truth, no data copy inside component props or state.

Setting data in Store act as a `React.Component.setState()` function keeping data immutable.
Each time you use `setData()` from YARS, it will render all subscribed component by setting an arbitrary state property to properly force the rendering without using forceUpdate().

## Install

```bash
    $ npm i --save yars
```

## Usage

### Basic usage

First create a new store a export it:

```javascript
// stores.js
'use strict';

const Store = require('yars');
// Or 
// import Store from 'yars';

// Create an initialized data object
const initialData = {
  foo: 'bar'
}

// Create an initialized store
const myStore = new Store(initialData);

export { myStore };
```

Then in your react component you can subscribe to and drive your store:

```javascript
// footer.js

import React, { Component } from 'react';
import { myStore } from 'stores.js';

class Footer extends Component {
  componentWillMount() {
    // Subscribe to all store data modifications
    // myStore.subscribe(this);

    // Subscribe to 'foo' store data modifications
    myStore.subscribe(this, ['foo']);
  }

  componentWillUnmount() {
    myStore.unsubscribe(this);
  }

  render() {
    const foo = myStore.getData('foo');
    // Or
    // const foo = myStore.getData().foo;

    return (
      <footer className="footer">
        <span className="float-left">{foo}</span>
        <span className="float-right">&copy; Foo Bar.</span>
      </footer>
    )
  }
}

export default Footer;
```

### Advanced usage

Create a new custom store inherited from YARS:

```javascript
// stores.js
'use strict';

const Store = require('yars');
// Or 
// import Store from 'yars';

import axios from 'axios'; // HTTP Requests
import NProgress from 'nprogress'; // A so hype progress bar

export default class UserStore extends Store {
  
  // Define you initial data in constructor
  constructor() {
    super({
      username: 'default'
    });
  }

  // Create a methode to fetch user data
  fetchUser(id) {
    // Start progress bar
    NProgress.start();
    
    // Start http request
    return axios
      .get('https://jsonplaceholder.typicode.com/users/'+id)
      .then((response) => {
        // Set data using inherited setData() method
        // This will automaticaly render all subscribed components 
        this.setData({username: response.data.username});
        
        // Stop progess bar
        NProgress.done();
      })
      .catch((error) => {
        // Do something with error
        console.error(error);
        // Stop progess bar
        
        NProgress.done();
      });
  }
}

// Create an initialized store
const userStore = new UserStore();

export { userStore };
```

Then in your component you can call your own method and let YARS do the rest for you


```javascript
// componentA.js

import React, { Component } from 'react';
import { userStore } from 'stores.js';

class componentA extends Component {
  componentWillMount() {
    userStore.subscribe(this, ['username']);
  }

  componentWillUnmount() {
    userStore.unsubscribe(this);
  }
  
  handleFetchUser() {
    userStore.fetchUser(1);
  }

  render() {
    return (
      <button onClick={this.handleFetchUser.bind(this)}>Fetch user</button> 
      <span className="result">{userStore.getData('username')}</span>
    )
  }
}

export default componentA;
```
