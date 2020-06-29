import React from 'react';
function TestFinish(props) {
    return (

        <div style={{ marginTop: "200px" }} className="container">
            <div className="cad  rounded">
                <div className="text-center">
                    <i class={`rounded-circle ${props.image}  details`} style={{ fontSize: "120px" }} aria-hidden="true" ></i>
                </div>
                <div className="rounded text-center">
                    <h2 class="details text-center  mt-5 inline-block font-weight-bold">{props.message} </h2>
                </div>
            </div>
        </div>

    );
}
export default TestFinish