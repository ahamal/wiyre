import React, { Component } from 'react';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      lines: []
    };
  }

  componentDidMount() {
    const { lat, lng } = this.props;
    this.map = new window.google.maps.Map(this.refs.map, {
      center: { lat, lng },
      zoom: 8
    });

    // Add markers for each place
    const markers = this.props.places.map(place => {
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: this.map,
        title: place.name
      });
      return marker;
    });

    // Store the markers in state
    this.setState({ markers });

    // Add lines connecting the markers
    const lines = this.props.places.map((place, i) => {
      if (i === this.props.places.length - 1) {
        return null;
      }

      const line = new window.google.maps.Polyline({
        path: [
          { lat: place.lat, lng: place.lng },
          { lat: this.props.places[i + 1].lat, lng: this.props.places[i + 1].lng }
        ],
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: this.map
      });
      return line;
    });

    // Store the lines in state
    this.setState({ lines });
  }

  componentWillUnmount() {
    // Remove all markers and lines from the map before unmounting
    this.state.markers.forEach(marker => marker.setMap(null));
    this.state.lines.forEach(line => line.setMap(null));
  }

  render() {
    return <div ref="map" style={{ height: '500px', width: '100%' }} />;
  }
}

export default Map;