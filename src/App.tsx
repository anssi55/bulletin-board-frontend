import React, { Component } from 'react';
import Posts from './components/Posts';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>Epic Posts </h1>
          </div>
        </header>
        <div className="container">
          <Posts />
        </div>
      </div>
    );
  }
}

export default App;
