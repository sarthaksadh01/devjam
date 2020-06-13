import React from 'react';
import Wave from 'react-wavify'
import "../assets/css/home.css"
function Home() {
    return (
        <div className="container-outer-2 bg-light ">

            <a href="/content" className="display-1 logo">CRYPTX</a>
            <Wave fill='#c850c0'
            className ="fixed-bottom"
                paused={false}
                options={{
                    height: 20,
                    amplitude: 200,
                    speed: 0.2,
                    points: 3
                }}
            />

        </div>
    )
}

export default Home;
