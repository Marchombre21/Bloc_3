import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const MapController = ({ position }) => {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position])
    
  
  return null;//Apparemment il faut qu'un composant retourne soit du jsx, soit null.
}

export default MapController
