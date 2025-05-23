import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const MapController = ({ position, action }) => {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, map.getZoom());
    action()
  }, [position])
}

export default MapController
