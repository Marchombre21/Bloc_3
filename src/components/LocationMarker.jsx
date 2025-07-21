import { latLng } from 'leaflet'
import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const LocationMarker = ({ changePosition }) => {
  const map = useMap()

  useEffect(() => {
    //Demande à l'utilisateur puis lance la geolocalisation.
    map.locate()

    const onLocationFound = e => {
      changePosition([e.latlng?.lat, e.latlng?.lng])
    }
    const onLocationError = e => {
      alert('Il y a eu un soucis pendant votre géolocalisation.')
      console.error(e.message)
    }
// map.on = addeventlistener en js. Quand la geolocalisation est finie, soit leaflet lance un "locationfound" en cas de réussite soit un "locationerror" en cas d'échec.
// Ce qui lancera la fonction associée.
    map.on('locationfound', onLocationFound)
    map.on('locationerror', onLocationError)

    return () => {
      map.off('locationfound', onLocationFound)
      map.off('locationerror', onLocationError)
    }
  }, [])

  return null
}

export default LocationMarker
