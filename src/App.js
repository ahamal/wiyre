import React, { Component } from 'react';
import Intro from './Intro';
import Map from './Map';
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Map
          lat={37.0902}
          lng={-95.7129} />
      </div>
    );
  }
}

export default App;
