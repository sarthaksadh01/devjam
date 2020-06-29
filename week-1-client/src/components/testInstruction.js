import React from 'react';
function TestInstruction(props) {
    return (
        <div class="container mb-5  ">

            <div class="title text-center">
                <h2 class="details  inline-block font-weight-bold">{props.title}</h2>

            </div>

            <div class="row mt-3">

                <div class="col-md-12 mb-4 ">
                    {props.desc}
                </div>

            </div>


            <div class="container mt-5">
                <div class="card-group vgr-cards">
                    <div class="card shadow p-3 rounded">
                        <div class="card-img-body text-center">
                            <i class="fa fa-file-text  details" style={{ fontSize: "120px" }} aria-hidden="true" ></i>
                        </div>
                        <div class="card-body-2 p-3 rounded">
                            <h4 class="card-title">Instructions</h4>
                            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer. This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                    {props.isTimed ?
                        <div class="card p-3 shadow rounded">
                            <div class="card-img-body text-center">
                                <i class="fa fa-hourglass-half details" style={{ fontSize: "120px" }} aria-hidden="true"></i>

                            </div>
                            <div class="card-body-2 p-3 rounded">
                                <h4 class="card-title">Duration</h4>
                                <p class="card-text">This test will have a countdown timer.you will have <span class="font-weight-bold">{props.testTiming} minutes</span> to complete this assessment. Please ensure that you have stable internet connection. Once you start a test your timer will be tracked. If you leave the page and join again the timer will start from where you left off. </p>


                            </div>
                        </div>

                        : <div></div>
                    }


                </div>
            </div>


            <div className="row text-center" >
                <div className="col-12">
                    <button onClick={() => { props.onclickStartTest() }} className="btn btn-lg create-button">Start</button>

                </div>
            </div>

            {/* <div class="wrapper mt-3">
                <a class="a1" href="#"><span>Start !</span></a>
            </div> */}

        </div>

    )
}
export default TestInstruction