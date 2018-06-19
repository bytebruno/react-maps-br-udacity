import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map';
import Places from './components/Places';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <Map />
          <Places />
        </p>
      </div>
    );
  }
}

export default App;
