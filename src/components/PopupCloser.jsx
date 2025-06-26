import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const PopupCloser = ({ trigger }) => {
  const map = useMap()

  useEffect(() => {
    map.closePopup()
  }, [trigger])

  return null
}

export default PopupCloser
