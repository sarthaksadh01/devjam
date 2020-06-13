/* 

This file is used as a Experience Section component for 
Create Profile Form.

*/

import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function ExperienceForm(props) {
    return (

        <div>
            <div className="mt-4">
                <h4 class="personal p-1  mb-0" s>Experience</h4>
                {props.isEditable ? <button onClick={() => { props.experienceAdded() }} class="btn round-shape-btn" style={{ verticalAlign: "top", display: "inline-block", float: "right", backgroundColor: "rgb(10, 10, 88)", color: "white" }}>Add More</button>:<div></div>}
                <hr className="hr" />
            </div>


            {props.formData.experience.map((value, index) => {
                return (
                    <div class="card shadow px-3 txt mb-2" >
                        <div class="row  p-2">
                            <div class="col-md-6 mb-3">
                                <label for="Company" > Company</label>
                                <input disabled ={!props.isEditable} onChange={(event) => { props.experienceChage(index, "company", event) }} type="text" class="form-control" value={value.company} />

                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="position" >Position</label>
                                <input disabled ={!props.isEditable} onChange={(event) => { props.experienceChage(index, "position", event) }} type="text" class="form-control" value={value.position} />

                            </div>
                        </div>

                        <div class="row  p-2">
                            <div class="col-md-6 mb-3">
                                <label for="sdate" > Start Date</label> <br/>
                                <DatePicker
                                    selected={new Date(value.startDate)}
                                    onChange={(date) => { props.experienceDateChange(index, "startDate", date) }}
                                />

                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="edate" >End Date</label> <br/>
                                <DatePicker 
                                    selected={new Date(value.endDate)}
                                    onChange={(date) => { props.experienceDateChange(index, "endDate", date) }}
                                />

                            </div>
                        </div>

                        <div class="m-2 mb-3">
                            <label for="desc" > Description</label>
                            <textarea disabled ={!props.isEditable} onChange={(event) => { props.experienceChage(index, "desc", event) }} type="text" class="form-control" value={value.desc}></textarea>

                        </div>
                        <div className="col-md-2">
                        {props.isEditable ? <button onClick={() => { props.experienceRemoved(index) }} class="mb-3 form-control btn btn-danger">Remove</button>:<div></div>}
                        </div>

                    </div>
                );

            })}


        </div>


    );
}
export default ExperienceForm;