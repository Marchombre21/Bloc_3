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

  useEffect(() => {
    const abortController = new AbortController()

    const getRestaurants = async () => {
      try {
        const restaurants = await fetch(
          `/api.php?radius=${radius}&position1=${position[0]}&position2=${position[1]}`,
          {
            signal: abortController.signal
          }
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
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log("Requête annulée.");
        } else {
          console.error(err)
        }
      }
    }

    getRestaurants()

    return () => {
      abortController.abort()
    }
  }, [radius, position])

  return (
    <>
<SearchBar
  onPositionChange={setPosition}
  onMarkersChange={setMarkers}
  onRadiusChange={setRadius}
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
        <MapController position={position}></MapController>
        {markers}
      </MapContainer>
    </>
  )
}

export default App
