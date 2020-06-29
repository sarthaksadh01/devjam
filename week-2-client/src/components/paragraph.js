import React from 'react';
function Paragraph(props) {
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <textarea disabled ={props.disabled}    className="form-control" rows={7} value={props.ansValue} onChange={(e)=>{props.selectAns(e.target.value)}}></textarea>

                </div>
                {/* <div><button className="rounded-pill btn btn-primary m-3">Save Ans</button></div> */}

            </div>
        </div>
    )
}
export default Paragraph;