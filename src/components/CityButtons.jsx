import React from 'react'

const CityButtons = ({ name, county, CP, country, action }) => {

  return (
    <button onClick={action} type='button'>{name} {county}, {CP} {country}</button>
  )
}

export default CityButtons