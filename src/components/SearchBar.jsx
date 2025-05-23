import React, { useRef, useState } from 'react'
import { FaSearchLocation } from 'react-icons/fa'
import CityButtons from './CityButtons'
import { ClipLoader } from 'react-spinners'

const SearchBar = ({
  onPositionChange,
  isLoading,
  onRadiusChange,
  radius
}) => {
  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState([])

  const getList = async city => {
    const location = await fetch(`/api.php?city=${city}`)
    if (!location.ok) {
      throw new Error('Ville introuvable!')
    } else {
      const listLocations = await location.json()
      getResults(listLocations)
    }
  }

  const flyTo = (locationResults, dataName) => {
    setResults([])
    setInputValue(dataName)
    const lat = locationResults.lat
    const lon = locationResults.lon
    onPositionChange([lat, lon])
  }

  const getResults = list => {
    const resultsList = list.map((result, index) => {
      const postcode = result.address.postcode ?? ''
      const addressType = result.addresstype
      const addressParts = [
        result.address[addressType],
        postcode,
        result.address.county,
        result.address.country
      ].filter(Boolean)
      const dataName = addressParts.join(', ')

      return (
        <CityButtons
          key={index}
          name={result.address[addressType]}
          county={result.address.county}
          CP={postcode}
          country={result.address.country}
          action={() => flyTo(result, dataName)}
        ></CityButtons>
      )
    })
    setResults(resultsList)
  }

  return (
    <div id='searchBar'>
      <h3>Entrez le nom d'une ville</h3>
      <section>
        <input
          type='text'
          name='city'
          id='searchInput'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button onClick={() => getList(inputValue)} type='button'>
          <FaSearchLocation></FaSearchLocation>
        </button>
        <ClipLoader loading={isLoading} size={25}/>
      </section>
      <section>
        <label htmlFor='radius'>Zone de recherche: </label>
        <select
          name='radius'
          id='radius'
          value={radius}
          onChange={e => onRadiusChange(e.target.value)}
        >
          <option value='1000'>1 km</option>
          <option value='3000'>3 km</option>
          <option value='5000'>5 km</option>
          <option value='10000'>10 km</option>
        </select>
      </section>
      <section>{results}</section>
    </div>
  )
}

export default SearchBar
