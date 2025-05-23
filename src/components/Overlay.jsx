import React, { useState } from 'react'

const Overlay = ({ title, address }) => {
  return (
    <div id='overlay'>
        <h3>{title}</h3>
        <p>{address}</p>
        <button id='continue' hidden={address === ""} >Continuer</button>
    </div>
  )
}

export default Overlay