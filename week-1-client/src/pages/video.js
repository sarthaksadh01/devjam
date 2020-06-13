import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { getSubTopic, updateSubTopic } from "../data/data"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import "../assets/css/sidebar.css"
class Video extends React.Component {

    state = {
        data: {
            title: "",
            desc: "",
            videoLink: "",
            fileName: "",
            thumbNail: ""
        },

    }
    constructor(props) {
        super(props)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)
    }
    onClickSave() {
        this.props.toggleLoading("Saving video")
        updateSubTopic(this.props.match.params.id, this.state.data).then((res) => {
            NotificationManager.success('Success', 'Video Saved');

        }).catch((err) => {
            NotificationManager.error('Error', 'Error Saving');

        }).finally(() => {
            this.props.toggleLoading()

        })

    }
    handleTitleChange(event) {
        var data = this.state.data;
        data.title = event.target.value
        this.setState({ data });

    }
    handleDescChange(event) {
        var data = this.state.data;
        data.desc = event.target.value
        this.setState({ data });
    }


    componentDidMount() {
        this.props.toggleLoading()
        getSubTopic(this.props.match.params.id, "video").then((data) => {
            this.setState({ data });
        }).catch((err) => {
            NotificationManager.error('Error', 'Error loading page');

        }).finally(() => {
            this.props.toggleLoading()

        })

    }

    render() {
        var widget = window.cloudinary.createUploadWidget({
            cloudName: "sarthaksadh", uploadPreset: "orbnpafv", multiple: false,
            resourceType: "video"
        }, (error, result) => {
            if (error) {
                NotificationManager.error('Error', 'Failed Uploading video');
                return;

            }
            if (!error && result && result.event === "success") {
                NotificationManager.info('Info', 'Video Uploaded');
                var data = this.state.data;
                data.fileName = result.info.original_filename;
                data.thumbNail = result.info.thumbnail_url;
                data.videoLink = result.info.secure_url;
                this.setState({ data })
                this.onClickSave()
            }
        })
        return (
            <div className="mt-5 container">
                <div style={{ marginTop: "90px" }} className="row">
                    <div className="col-md-8">
                        <form>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Video Title</label>
                                <textarea onChange={this.handleTitleChange} value={this.state.data.title} class="form-control" id="exampleFormControlTextarea1" rows="2"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Video Description</label>
                                <textarea onChange={this.handleDescChange} value={this.state.data.desc} class="form-control" id="exampleFormControlTextarea1" rows="8"></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <div className="row mt-4">
                            <div className="col-md-12">
                                <img className="img-fluid" src={this.state.data.thumbNail} alt ="" />

                            </div>
                        </div>
                        <div className="mt-3 row">
                            <div className=" col-md-12"><b>Link</b></div>
                            <div className="text-truncate col-md-10">
                                <a href={this.state.data.videoLink}>{this.state.data.videoLink}</a>
                            </div>
                            <div className="col-md-2">
                                <button onClick={()=>{
                                    navigator.clipboard.writeText(this.state.data.videoLink)
                                    NotificationManager.info('Info', 'Link Copied');
                                    }} className="text-white btn round-shape-btn "><FontAwesomeIcon icon={faCopy} /></button>
                            </div>
                        </div>
                        <div className="mt-3 row">
                            <div className="col-md-12"><b>File Name</b></div>
                            <div className="text-truncate col-md-12">
                                {this.state.data.fileName}
                            </div>

                        </div>
                    </div>
                </div>
                <div className=" align-text-bottom navbar-fixed-bottom row">
                    <div className="col-md-6">
                        <button onClick={() => { widget.open() }} class="round-shape-btn  btn">Upload Video</button>

                    </div>
                    <div className="col-md-2">
                        <button onClick={() => { this.onClickSave() }} href="#" class="btn round-shape-btn ">Save Video</button>

                    </div>
                </div>
                <NotificationContainer />
            </div>

        );

    }

}
export default Video;