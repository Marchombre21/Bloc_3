import React, { useRef, useState } from 'react'
import { FaSearchLocation } from 'react-icons/fa'
import CityButtons from './CityButtons'

const SearchBar = ({ action }) => {
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

  const flyTo = chosenCity => {
    const lat = chosenCity.lat
    const lon = chosenCity.lon
    action([lat, lon])
  }

  const getResults = list => {
    const results = list.map((result, index) => {
      const postcode = result.address.postcode ?? ''
      const addressType = result.addresstype
      return (
        <CityButtons
          key={index}
          name={result.address[addressType]}
          county={result.address.county}
          CP={postcode}
          country={result.address.country}
          action={() => flyTo(result)}
        ></CityButtons>
      )
    })
    setResults(results)
  }

  return (
    <div id='searchBar'>
      <h3>Entrez le nom d'une ville</h3>
      <div>
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
      </div>
      {results}
    </div>
  )
}

export default SearchBar
