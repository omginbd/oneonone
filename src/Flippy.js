import React, { useState } from 'react'
import './Flippy.css'

const Flippy = ({ front, back }) => {
    const [flipped, setFlipped] = useState(false)

    return (
        <div className={"Flippy-container"}>
            <div className={["Flippy", flipped ? "Flippy-flipped" : ""].join(" ")}>
                <div className={"Flippy-front"}>
                    {front}
                    <div className="Flippy-close" onClick={() => setFlipped(!flipped)}>✏️ Edit Participants</div>
                </div>
                <div className={"Flippy-back"}>
                    {back}
                    <div className="Flippy-close" onClick={() => setFlipped(!flipped)}>👀 See pairs</div>
                </div>
            </div>
        </div>
    )
}

export default Flippy