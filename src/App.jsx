import { MapContainer, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import MapController from './components/MapController.jsx'

function App () {
  const [position, setPosition] = useState([51.505, -0.09])
  const [markers, setMarkers] = useState([])
  const [radius, setRadius] = useState('3000')

  const getRestaurants = async () => {
    const restaurants = await fetch(
      `/api.php?radius=${radius}&position1=${position[0]}&position2=${position[1]}`
    )
    if (!restaurants.ok) {
      throw new Error('Ville introuvable!')
    } else {
      const response = await restaurants.json()
      const restaurantsList = response.elements
      const markersList = restaurantsList.map(restaurant => {
        const lat = restaurant['lat']
          ? restaurant['lat']
          : restaurant['center']['lat']
        const long = restaurant['lon']
          ? restaurant['lon']
          : restaurant['center']['lon']
        return <Marker key={restaurant.id} position={[lat, long]}></Marker>
      })
      setMarkers(markersList)
    }
  }

  useEffect(() => {
    getRestaurants()
  }, [radius])

  return (
    <>
      <SearchBar
        action={setPosition}
        action2={setMarkers}
        action3={setRadius}
        radius={radius}
      ></SearchBar>
      <MapContainer
        className='leaflet-container'
        center={position}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapController
          position={position}
          action={() => getRestaurants()}
        ></MapController>
        {markers}
      </MapContainer>
    </>
  )
}

export default App
