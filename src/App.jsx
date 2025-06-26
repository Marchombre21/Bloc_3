import { MapContainer, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import MapController from './components/MapController.jsx'
import Overlay from './components/Overlay.jsx'
import PopupCloser from './components/PopupCloser.jsx'
import LocationMarker from './components/LocationMarker.jsx'
import './fixLeaflet.js'

function App () {
  const [position, setPosition] = useState([48.8534951, 2.3483915])
  const [radius, setRadius] = useState('3000')
  const [popupContent, setPopupContent] = useState({})
  const [markerData, setMarkerData] = useState([])
  const [title, setTitle] = useState('Aucun restaurant sélectionné')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getAllResults = async (token, signalController, markers) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000)) 
    const nextPage = await fetch(
      `${import.meta.env.VITE_APP_URL}?token=${token}`,
      {
        signal: signalController
      }
    )
    if (!nextPage.ok) {
      setIsLoading(false)
      throw new Error('Ville introuvable!')
    } else {
      const response = await nextPage.json()
      if (!response.results) {
        throw new Error('Structure de la réponse API invalide')
      } else {
        const restaurantsListNext = response.results
        markers = [
          ...markers,
          ...restaurantsListNext.map(restaurant => ({
            lat: restaurant.geometry?.location?.lat,
            lon: restaurant.geometry?.location?.lng
          }))
        ]
        if (response.next_page_token) {
          getAllResults(response.next_page_token, signalController, markers)
        } else {
          setMarkerData(markers)
          setIsLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController()
    const getRestaurants = async () => {
      try {
        setIsLoading(true)
        const restaurants = await fetch(
          `${import.meta.env.VITE_APP_URL}?radius=${radius}&position1=${
            position[0]
          }&position2=${position[1]}`,
          {
            signal: abortController.signal
          }
        )
        if (!restaurants.ok) {
          setIsLoading(false)
          throw new Error('Ville introuvable!')
        } else {
          const response = await restaurants.json()
          if (!response.results) {
            throw new Error('Structure de la réponse API invalide')
          } else {
            const restaurantsList = response.results
            let markersList = restaurantsList.map(restaurant => ({
              lat: restaurant.geometry?.location?.lat,
              lon: restaurant.geometry?.location?.lng
            }))

            if (response.next_page_token) {
              getAllResults(response.next_page_token, abortController.signal, markersList)
            } else {
              setMarkerData(markersList)
              setIsLoading(false)
            }
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
        } else {
          console.error(err)
          setIsLoading(false)
        }
      }
    }

    getRestaurants()
    setTitle('Aucun restaurant sélectionné')
    setAddress('')
    return () => {
      abortController.abort()
    }
  }, [radius, position])

  const getAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL}?lat=${lat}&lon=${lon}`
      )
      if (!response.ok) {
        throw new Error('Restaurant introuvable')
      } else {
        const data = await response.json()
        if (!data.address) {
          throw new Error('Invalid address data')
        }
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
        <PopupCloser trigger={`${radius}-${position}`}></PopupCloser>
        <MapController position={position}></MapController>
        <LocationMarker changePosition={setPosition}></LocationMarker>
        {markerData.map(marker => {
          return (
            <Marker
              key={`${marker.lat}-${marker.lon}`}
              eventHandlers={{
                click: () => getAddress(marker.lat, marker.lon)
              }}
              position={[marker.lat, marker.lon]}
            >
              <Popup>
                <div id='popupContent'>
                  {popupContent[`${marker.lat}, ${marker.lon}`] ||
                    'Chargement...'}
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
      </MapContainer>
      <Overlay title={title} address={address}></Overlay>
    </>
  )
}

export default App
