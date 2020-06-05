import React from 'react';
import {  NotificationManager } from 'react-notifications';
import StarRatings from 'react-star-ratings';

function PersonalDetailsForm(props) {
    var widget = window.cloudinary.createUploadWidget({
        cloudName: "sarthaksadh", uploadPreset: "orbnpafv", multiple: false,
        resourceType: "image"
    }, (error, result) => {
        if (error) {
            NotificationManager.error('Error', 'Failed Uploading Image');
            return;

        }
        if (!error && result && result.event === "success") {
            NotificationManager.info('Info', 'Profile image Uploaded');
            props.personalDetailChange("profileImage", {
                target: {
                    value: result.info.secure_url
                }
            })
        }
    })

      

    
    return (

        

        <div>
            <div>
                <h4 class="personal p-1 mt-2 mb-0" s>Personal Details</h4>
                <hr className="hr" />
            </div>

            <div class="card shadow px-3 txt" >
                <div class="row">

                    <div class="text-center col-md-4 order-md-2 mb-4">
                        <br />
                        <br />
                        <img style={{ maxHeight: "250px" }} class="text-center img-fluid" src={props.formData.profileImage} alt="" />
                        <div class="my-3 mx-auto">
                            {props.isEditable ? <button onClick={() => { widget.open() }} class="btn round-shape-btn align-text-bottom  btn-block">Upload Profile Picture</button>
                                : <div>

                                    <StarRatings
                                    starDimension="30px"
                                        rating={props.rating()}
                                        starRatedColor="#c850c0"
                                        numberOfStars={5}
                                        name='rating'
                                    />

                                </div>}
                        </div>

                    </div>
                    <div class="col-md-8 order-md-1 p-3 ">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="firstName"> Title</label>
                                <input disabled={!props.isEditable} onChange={(event) => { props.personalDetailChange("title", event) }} type="text" class="form-control" value={props.formData.title}
                                />
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName">Name</label>
                                <input disabled={!props.isEditable} onChange={(event) => { props.personalDetailChange("name", event) }} type="text" class="form-control" value={props.formData.name} />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="username">Designation</label>
                            <div class="input-group">
                                <input disabled={!props.isEditable} onChange={(event) => { props.personalDetailChange("designation", event) }} type="text" class="form-control" value={props.formData.designation} />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="yprofile">Youtube Profile </label>

                                <input disabled={!props.isEditable} onChange={(event) => { props.personalDetailChange("youtubeProfile", event) }} type="text" class="form-control" value={props.formData.youtubeProfile} />

                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="gprofile">Github Profile </label>

                                <input disabled={!props.isEditable} onChange={(event) => { props.personalDetailChange("githubProfile", event) }} type="text" class="form-control" value={props.formData.githubProfile} />

                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="eduD">Specialization</label>
                            <input disabled={!props.isEditable} onChange={(event) => { props.personalDetailChange("specialization", event) }} type="text" class="form-control" value={props.formData.specialization} />
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}
export default PersonalDetailsForm;