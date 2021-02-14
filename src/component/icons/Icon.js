import React from 'react'
import "./Icon.css"

function Icon({src,alt}) {
    return (
        <div className="icon">
            <img className="iconimg" src={src} alt={alt}/>
        </div>
    )
}

export default Icon
