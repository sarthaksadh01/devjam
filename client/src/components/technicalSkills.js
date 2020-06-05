/* 

This file is used as a Technical Skills Section 
component for Create Profile Form.

*/

import React from 'react';
function TechSkillsForm(props) {
    return (

        <div>
            <div className="mt-4">
                <h4 class="personal p-1  mb-0" s>Technical Skills</h4>
                {props.isEditable ? <button onClick={() => { props.skillsHobbiesAdded("technicalSkills") }} class="btn round-shape-btn " style={{ verticalAlign: "top", display: "inline-block", float: "right", backgroundColor: "rgb(10, 10, 88)", color: "white" }}>Add More</button>:<div></div>}
                <hr className="hr" />
            </div>


            {props.formData.technicalSkills.map((value, index) => {
                return (
                    <div className="shadow card mb-2">
                        <div class="m-2 mb-3">
                            <label for="desc" > Skill</label>
                            <input  disabled ={!props.isEditable} onChange={(event) => { props.skillsHobbiesChanged(index,"technicalSkills", event) }} type="text" class="form-control" value={value} />
                        </div>
                        <div className="col-md-2">
                        {props.isEditable ? <button onClick={() => { props.skillsHobbiesRemoved(index,"technicalSkills") }} class="mb-3 form-control btn btn-danger">Remove</button>:<div></div>}
                        </div>
                    </div>
                );

            })}


        </div>


    );
}
export default TechSkillsForm;