import React, { useRef, useState } from 'react'
import { FaSearchLocation } from 'react-icons/fa'
import CityButtons from './CityButtons'

const SearchBar = ({ action, action2, action3, radius }) => {
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

  const flyTo = (chosenCity, dataName) => {
    setResults([]);
    setInputValue(dataName);
    const lat = chosenCity.lat
    const lon = chosenCity.lon
    action([lat, lon])
    action2([])
  }

  const getResults = list => {
    const results = list.map((result, index) => {
      const postcode = result.address.postcode ?? ''
      const addressType = result.addresstype
      let dataName = result.address[addressType];
      dataName += ", " + postcode;
      dataName += " " + result.address.county;
      dataName += " " + result.address.country;
      return (
        <CityButtons
          key={index}
          name={result.address[addressType]}
          county={result.address.county}
          CP={postcode}
          country={result.address.country}
          action={(e) => flyTo(result, dataName)}
        ></CityButtons>
      )
    })
    setResults(results)
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
      </section>
      <section>
        <label htmlFor="radius">Zone de recherche: </label>
        <select name="radius" id="radius" value={radius} onChange={(e) => action3(e.target.value)}>
          <option value="1000">1 km</option>
          <option value="3000">3 km</option>
          <option value="5000">5 km</option>
          <option value="10000">10 km</option>
        </select>
      </section>
      <section>{results}</section>
    </div>
  )
}

export default SearchBar
