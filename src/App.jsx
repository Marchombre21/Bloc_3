import { MapContainer, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';

function App () {
  const [position, setPosition] = useState([51.505, -0.09]);


  

  const MapController = ({ position }) => {
      const map = useMap();

      useEffect(() => {
        map.flyTo(position, map.getZoom());
      },[position]);
  }



  return (
    <>
    <SearchBar action={setPosition}></SearchBar>
    <MapContainer className='leaflet-container' center={position} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <MapController position={position}></MapController>
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
    </>
    
  )
}

export default App
