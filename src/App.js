import React, { Component } from 'react';

import Conversation from 'chat-template/dist/Conversation';

import logo from './logo.svg';
import './App.css';

/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from './redux/configureStore';

class App extends Component {
  constructor(props) {
    super(props);

    console.log(this.props);
  }

  render() {
    var messages = [{
      message: 'How do I use this messaging app?',
      from: 'right',
      backColor: '#3d83fa',
      textColor: "white",
      avatar: 'https://www.seeklogo.net/wp-content/uploads/2015/09/google-plus-new-icon-logo.png',
      duration: 2000,
      inbound: false
    }];

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Conversation height={300} messages={messages} />
      </div>
    );
  }
}

export default App;
