import React from 'react';
import Wave from 'react-wavify'
import "../assets/css/home.css"
function Home() {
    return (
        <div className="container-outer-2 bg-light ">

            <a href="/content" className="blueText logo">CRYPTX</a>
            <Wave fill='#060c22'
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
