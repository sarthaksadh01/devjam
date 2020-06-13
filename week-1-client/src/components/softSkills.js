/* 

This file is used as a Soft Skills Section 
component for Create Profile Form.

*/

import React from 'react';
function SoftSkillsForm(props) {
    return (

        <div>
            <div className="mt-4">
                <h4 class="personal p-1  mb-0" s>Soft Skills</h4>
                {props.isEditable ? <button onClick={() => { props.softSkillAdded() }} class="btn round-shape-btn" style={{ verticalAlign: "top", display: "inline-block", float: "right", backgroundColor: "rgb(10, 10, 88)", color: "white" }}>Add More</button>:<div></div>}
                <hr className="hr" />
            </div>


            {props.formData.softSkills.map((value, index) => {
                return (
                    <div class="card shadow px-3 txt mb-3" >
                        <div class="row  p-2">
                            <div class="col-md-6 mb-3">
                                <label for="Company" > Name</label>
                                <input  disabled ={!props.isEditable} onChange={(event)=>{props.softSkillsChange(index, "name", event)}} type="text" class="form-control" value={value.name} />

                            </div>
                            <div class="col-md-6 mb-1">
                                <label for="rate">Rating </label>
                                <div class="form-group">
                                    <select  disabled ={!props.isEditable} onChange={(event) => { props.softSkillsChange(index, "rating", event) }} value={value.rating} class="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </select>
                                </div>

                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="desc" > Comment</label>
                                <textarea  disabled ={!props.isEditable} onChange={(event) => { props.softSkillsChange(index, "comment", event) }} type="text" class="form-control" value={value.comment}></textarea>

                            </div>
                            <div className="col-md-2">
                            {props.isEditable ?  <button onClick={() => { props.softSkillRemoved(index) }} class="mb-3 form-control btn btn-danger">Remove</button>:<div></div>}
                            </div>

                        </div>

                    </div>

                );

            })}


        </div>


    );
}
export default SoftSkillsForm;