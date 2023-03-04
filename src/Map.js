import React, { Component } from 'react';
import { doc, updateDoc, deleteDoc, addDoc, onSnapshot, query, collection } from 'firebase/firestore';
import { db } from './firebase';
import './Map.css'

class Map extends Component {
  constructor(props) {
    super(props);
    this.collectionRef = collection(db, 'markers');
    this.mapMarkers = {};
    this.markers = {};
    this.lines = [];
    this.state = { fromId: null, toId: null, markerState: null }
  }

  componentDidMount() {
    this.setupMap();
    const q = query(this.collectionRef);
    this.unsubscribe = onSnapshot(q, qss => {
      qss.docChanges().forEach(change => {
        const { doc, type } = change;
        this.onMarker({ id: doc.id, ...doc.data() }, type);
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    for (let id in this.markers) {
      this.deleteMarker(id);
    }
  }

  setupMap() {
    const center = { lat: 37.0902, lng: -95.7129 };
    this.map = new window.google.maps.Map(this.refs.map, { center, zoom: 4 });
    this.map.addListener('click', this.handleMapClick);
  }

  onMarker(doc, type) {
    let { markers } = this;
    if (type === 'added') {
      this.addMarker(doc);
    } else if (type === 'modified') {
      this.updateMarker(doc);
    } else if (type === 'removed') {
      this.deleteMarker(doc.id);
    }
  }

  addMarker(doc) {
    this.markers[doc.id] = doc;

    const mapMarker = new window.google.maps.Marker({
      map: this.map,
      position: { lat: doc.lat, lng: doc.lng },
      title: doc.title,
      draggable: true
    });

    mapMarker.addListener('dragend', e => {
      const pos = mapMarker.getPosition();
      this.updateDoc(doc.id, { lat: pos.lat(), lng: pos.lng() });
    });

    mapMarker.addListener('click', e => {
      this.handleMarkerClick(doc.id);
    });


    this.mapMarkers[doc.id] = mapMarker;
  }

  updateMarker = (doc) => {
    this.markers[doc.id] = doc;
    console.log(doc);
    const pos = new window.google.maps.LatLng(doc.lat, doc.lng);
    this.mapMarkers[doc.id].setPosition(pos);
  }

  deleteMarker = (id) => {
    delete this.markers[id];
    this.mapMarkers[id].setMap(null);
    delete this.mapMarkers[id]
  }

  handleMapClick = (e) => {
    this.addNewMarker(e);
  }

  updateDoc = (id, data) => {
    return updateDoc(doc(db, 'markers', id), data);
  }

  deleteDoc = (id, data) => {
    return deleteDoc(doc(db, 'markers', id));
  }

  handleMarkerClick = (id) => {
    if (this.state.markerState === 'start') {
      this.setState({ startId: id, markerState: null });
      return;
    }
    if (this.state.markerState === 'end') {
      this.setState({ endId: id, markerState: null });
      return;
    }
    this.showMarkerPopup(id);
  }

  addNewMarker = (e) => {
    const title = prompt('Enter Title');    
    if (!title)
      return;
    addDoc(this.collectionRef, {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      title: title,
    });    
  }


  showMarkerPopup(id) {
    const
      doc = this.markers[id],
      mapMarker = this.mapMarkers[id];

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div>
          <div style="font-size: 2em;">${doc.title}</div>
          <br />
          <button id="edit" onclick="window.editItem('${id}')">Edit</button>
          <button id="delete" onclick="window.deleteItem('${id}')">Delete</button>
        </div>
      `
    });
    window.editItem = (id) => {
      let title = prompt('Enter a new title');
      infoWindow.close();
      this.updateDoc(id, { title });
    }
    window.deleteItem = (id) => {
      infoWindow.close();
      this.deleteDoc(id);
    }
    infoWindow.open(this.map, mapMarker);    
  }


  generatePath = () => {
    if (!this.state.endId || !this.state.startId) {
      return 
    }

    const
      endMarker = this.state.endId && this.markers[this.state.endId],
      startMarker = this.state.startId && this.markers[this.state.startId];

    this.clearPath();

    // Add lines connecting the markers
    const
      markers = Object.values(this.markers),
      lines = markers.map((doc, i) => {
        if (i === markers.length - 1) {
          return null;
        }

        const line = new window.google.maps.Polyline({
          path: [
            { lat: doc.lat, lng: doc.lng },
            { lat: markers[i + 1].lat, lng: markers[i + 1].lng }
          ],
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: this.map
        });
        return line;
      });
    this.lines = lines;
  }

  clearPath = () => {
    this.lines.forEach(line => line.setMap(null));
  }


  render() {
    const
      endMarker = this.state.endId && this.markers[this.state.endId],
      startMarker = this.state.startId && this.markers[this.state.startId];

    return (
      <>
        <div
          ref="map"
          style={{ height: '100%', width: '100%' }} />
          
        <div className="control">
          <div>
            Start
            <br />
            { this.state.markerState === 'start' && 'selecting' }

            <br />
            {startMarker && startMarker.title}

            <br />
            <button
              onClick={_ => this.setState({ markerState: 'start' })}>
              Select
            </button>
          </div>

          <hr />

          <div>
            End
            <br />
            {endMarker && endMarker.title}

            <br />
            { this.state.markerState === 'end' && 'selecting' }

            <br />
            <button
              onClick={_ => this.setState({ markerState: 'end' })}>
              Select
            </button>
          </div>
          <hr />

          <div className="">
            <button onClick={this.generatePath}>Generate</button>
            <br />
            <button onClick={this.clearPath}>Clear</button>
          </div>
        </div>
      </>
    );
  }
}

export default Map;