import { MapContainer, TileLayer } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import MapController from './components/MapController.jsx'
import Overlay from './components/Overlay.jsx'

function App () {
  const [position, setPosition] = useState([48.8534951, 2.3483915])
  const [radius, setRadius] = useState('3000')
  const [popupContent, setPopupContent] = useState({})
  const [markerData, setMarkerData] = useState([])
  const [title, setTitle] = useState('Aucun restaurant sélectionné')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()

    const getRestaurants = async () => {
      try {
        setIsLoading(true);
        const restaurants = await fetch(
          `/api.php?radius=${radius}&position1=${position[0]}&position2=${position[1]}`,
          {
            signal: abortController.signal
          }
        )
        if (!restaurants.ok) {
          setIsLoading(false)
          throw new Error('Ville introuvable!')
        } else {
          const response = await restaurants.json()
          const restaurantsList = response.elements
          const markersList = restaurantsList.map(restaurant => ({
            id: restaurant.id,
            lat: restaurant.lat ?? restaurant.center?.lat,
            lon: restaurant.lon ?? restaurant.center?.lon
          }))
          setMarkerData(markersList)
          setIsLoading(false)
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Requête annulée.')
        } else {
          console.error(err)
        }
      }
    }

    getRestaurants()
    setTitle("Aucun restaurant sélectionné")
    setAddress("")
    return () => {
      abortController.abort()
    }
  }, [radius, position])

  const getAddress = async (lat, lon) => {
    try {
      const response = await fetch(`/api.php?lat=${lat}&lon=${lon}`)
      if (!response.ok) {
        throw new Error('Restaurant introuvable')
      } else {
        const data = await response.json()
        const realAddress = [
          data.address.amenity,
          data.address.road,
          data.address.city_block,
          data.address.postcode,
          data.address.suburb,
          data.address.state,
          data.address.region,
          data.address.country
        ]
          .filter(Boolean)
          .join(', ')
        setPopupContent(prev => ({
          ...prev,
          [`${lat}, ${lon}`]: realAddress
        }))
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <SearchBar
        onPositionChange={setPosition}
        onRadiusChange={setRadius}
        isLoading={isLoading}
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
        {markerData.map(marker => {
          return (
            <Marker
              key={marker.id}
              eventHandlers={{
                click: () => getAddress(marker.lat, marker.lon)
              }}
              position={[marker.lat, marker.lon]}
            >
              <Popup>
                <div id='popupContent'>
                  {popupContent[`${marker.lat}, ${marker.lon}`] || "Chargement..."}
                  <button
                    type='button'
                    id='chose'
                    onClick={() => {
                      setTitle('Restaurant sélectionné')
                      setAddress(popupContent[`${marker.lat}, ${marker.lon}`])
                    }}
                  >
                    Choisir
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
        <Overlay title={title} address={address}></Overlay>
      </MapContainer>
    </>
  )
}

export default App
