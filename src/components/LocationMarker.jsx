import { latLng } from 'leaflet'
import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const LocationMarker = ({ changePosition }) => {
  const map = useMap()

  useEffect(() => {
    map.locate()

    const onLocationFound = e => {
      changePosition([e.latlng?.lat, e.latlng?.lng])
      map.flyTo([e.latlng?.lat, e.latlng?.lng], map.getZoom())
    }
    const onLocationError = e => {
      alert('Il y a eu un soucis pendant votre géolocalisation.')
      console.error(e.message)
    }

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
