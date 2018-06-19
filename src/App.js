import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Google Maps with React - Udacity Nanodegree</h1>
        </header>
        <p className="App-intro">
        <Map />
        </p>
      </div>
      
    );
  }
}

export default App;
