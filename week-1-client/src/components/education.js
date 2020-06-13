/* 

This file is used as a Education Section component for 
Create Profile Form.

*/

import React from 'react';
function EducationForm(props) {
    return (

        <div>
            <div className="mt-4">
                <h4 class="personal p-1  mb-0" s>Education</h4>
                {props.isEditable ?   <button onClick={() => { props.educationAdded() }} class="btn round-shape-btn" style={{ verticalAlign: "top", display: "inline-block", float: "right", backgroundColor: "rgb(10, 10, 88)", color: "white" }}>Add More</button>:<div></div>}
                <hr className="hr" />
            </div>


            {props.formData.education.map((value, index) => {
                return (
                    <div class="card shadow px-3 txt mb-2" >
                        <div class="row  p-2">
                            <div class="col-md-6 mb-3">
                                <label for="Company" > University</label>
                                <input   disabled ={!props.isEditable} onChange={(event) => { props.educationChage(index, "university", event) }} type="text" class="form-control" value={value.university} />

                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="position" >Branch</label>
                                <input  disabled ={!props.isEditable} onChange={(event) => { props.educationChage(index, "branch", event) }} type="text" class="form-control" value={value.branch} />

                            </div>
                        </div>

                        <div class="m-2 mb-3">
                            <label for="desc" > Comment</label>
                            <textarea  disabled ={!props.isEditable} onChange={(event) => { props.educationChage(index, "comment", event) }} type="text" class="form-control" value={value.comment}></textarea>

                        </div>
                        <div className="col-md-2">
                        {props.isEditable ?<button onClick={() => { props.educationRemoved(index) }} class="mb-3 form-control btn btn-danger">Remove</button>:<div></div>}
                        </div>

                    </div>
                );

            })}


        </div>


    );
}
export default EducationForm;