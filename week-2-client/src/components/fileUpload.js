/*
This file contains file upload functionality
for Deliverables.

Also contains validation to upload only
.zip files.

*/


import React from 'react';
import { faPlayCircle, faEllipsisH, faPlus, faFileArchive, faArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function FileUpload(props) {
    // alert(props.isSubmitted);
    var widget = window.cloudinary.createUploadWidget({
        cloudName: "sarthaksadh", uploadPreset: "orbnpafv", multiple: false,
        resourceType: "raw"
    }, (error, result) => {
        if (error) {
            return;

        }
        if (!error && result && result.event === "success") {
            var str = result.info.secure_url;
            if(str.endsWith(".zip")){
                props.changeSubmission("fileUrl", result.info.secure_url)
                props.changeSubmission("fileName",result.info.original_filename)

            }
            else{
                alert("Invalid File type")
            }
            
        }
    })
    return (

        <div style={{ marginLeft: "25%" }} className="text-center col-md-6 mt-5">
            <div class="card h-100 shadow">
                <div class="bg-dark text-white card-header">
                    Submit Task
                                </div>
                <div class="text-center card-body">
                    <h5 onClick={() => { if (!props.isSubmitted) widget.open() }} class="text-center card-title"> <FontAwesomeIcon className="text-dark" icon={faFileArchive} /> {props.isSubmitted ? "File Uploaded" : "Add or create"}</h5>
                    {props.fileUrl == "" ? <div></div> : <a href={props.fileUrl}>file uploaded</a>}
                </div>
                <div className="card-footer text-center">
                    <div class="p-1 form-group">
                        <input disabled={props.isSubmitted} onChange={(e) => { props.changeSubmission("privateComment", e.target.value) }} placeholder="comment.." type="text" class="form-control" id="exampleInputPassword1" />
                    </div>
                    <button onClick={() => { if (!props.isSubmitted) props.uploadFile() }} class="text-center  btn btn-outline-dark">{props.isSubmitted ? "Completed" : "Mark as completed"}</button>
                </div>
            </div>
        </div>




    );
}
export default FileUpload;