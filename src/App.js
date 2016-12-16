import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import Chat from "./containers/Chat";

class App extends Component {
  constructor(props) {
    super(props);

    console.log(this.props);
    console.log(global.userAgent);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Chat />
      </div>
    );
  }
}

export default App;
