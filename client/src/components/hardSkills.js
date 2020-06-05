/* 

This file is used as a Hard Skills Section component for 
Create Profile Form.

*/

import React from 'react';
function HardSkillsForm(props) {
    return (
        <div>
            <div className="mt-4">
                <h4 class="personal p-1  mb-0" s>Hard Skills</h4>
                {props.isEditable ? <button onClick={() => { props.hardSkillAdded() }} class="btn round-shape-btn" style={{ verticalAlign: "top", display: "inline-block", float: "right", backgroundColor: "rgb(10, 10, 88)", color: "white" }}>Add More</button> : <div></div>}
                <hr className="hr" />
            </div>


            {props.formData.hardSkills.map((hardSkill, index1) => {
                return (
                    <div class="card shadow px-3 txt mb-3" >
                        <div class="col-md-12 mt-2 mb-3">
                            <label for="Company" > Name</label>
                            <input disabled={!props.isEditable} onChange={(event) => { props.hardSkillChange(index1, event) }} type="text" class="form-control" value={hardSkill.name} />
                            <div className="col-md-2 float-right mt-3">
                            {props.isEditable ?  <button onClick={() => { props.hardSkillSubSkillAdded(index1) }} class="btn round-shape-btn form-control" style={{ verticalAlign: "top", display: "inline-block", float: "right", backgroundColor: "rgb(10, 10, 88)", color: "white" }}>Add {hardSkill.name}</button>:<div></div>}
                            </div>
                            <div className="col-md-2 mt-3">
                                {props.isEditable ? <button onClick={() => { props.hardSkillRemoved(index1) }} class="mb-3 form-control btn btn-danger">Remove</button> : <div></div>}
                            </div>

                        </div>
                        {hardSkill.subSkills.map((value, index2) => {
                            return (
                                <div class="card shadow px-3 txt mb-3" >
                                    <div class="row  p-2">
                                        <div class="col-md-12 mb-3">
                                            <label for="Company" > Name</label>
                                            <input disabled={!props.isEditable} onChange={(event) => { props.hardSkillSubSkillChange(index1, index2, "name", event) }} type="text" class="form-control" value={value.name} />

                                        </div>
                                        <div class="col-md-6 mb-1">
                                            <label for="rate">Rating </label>
                                            <div class="form-group">
                                                <select disabled={!props.isEditable} onChange={(event) => { props.hardSkillSubSkillChange(index1, index2, "rating", event) }} value={value.rating} class="form-control">
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </select>
                                            </div>

                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="desc" > Experience</label>
                                            <input disabled={!props.isEditable} onChange={(event) => { props.hardSkillSubSkillChange(index1, index2, "experience", event) }} type="number" class="form-control" value={value.experience} />

                                        </div>
                                        <div className="col-md-2">
                                            {props.isEditable ? <button onClick={() => { props.hardSkillSubSKillRemoved(index1, index2) }} class="mb-3 form-control btn btn-danger">Remove</button> : <div></div>}
                                        </div>

                                    </div>

                                </div>
                            )
                        })}

                    </div>

                );

            })}


        </div>
    )
}
export default HardSkillsForm;