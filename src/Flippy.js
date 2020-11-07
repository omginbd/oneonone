import React, { useState } from 'react'
import './Flippy.css'

export default ({ children, front, back }) => {
    const [flipped, setFlipped] = useState(false)

    return (
        <div className={"Flippy-container"}>
            <div className="Flippy-close" onClick={() => setFlipped(!flipped)}>🔄</div>
            <div className={["Flippy", flipped ? "Flippy-flipped" : ""].join(" ")}>
                <div className={"Flippy-front"}>
                    {front}
                </div>
                <div className={"Flippy-back"}>
                    {back}
                </div>
            </div>
        </div>
    )
}