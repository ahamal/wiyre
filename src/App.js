import React, { Component } from 'react';
import Intro from './Intro';
import Map from './Map';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [
        { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
        { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
        { name: 'New York', lat: 40.7128, lng: -74.0060 }
      ]
    };
  }

  render() {
    return (
      <div className="app">
        <Intro />
                
        <Map
          lat={37.7749}
          lng={-122.4194}
          places={this.state.places} />
      </div>
    );
  }
}

export default App;
