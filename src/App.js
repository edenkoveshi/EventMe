import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Image } from 'semantic-ui-react';
import LoginForm from './LoginApp.js';
import HomepageLayout from './HomepageLayout.js';
import ImageExampleFluid from './ImageExampleFluid.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HomepageLayout/>
      </div>
    );
  }
}

export default App;
