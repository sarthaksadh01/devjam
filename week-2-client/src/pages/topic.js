import React from 'react';
import { faPlayCircle, faEllipsisH, faPlus, faFileArchive, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ReactList from 'react-list';
import { DiscussionEmbed } from 'disqus-react';
import Truncate from 'react-truncate';
import { getTopic, getSubmission, submitFile } from '../data/data'
import VideoPlayer from '../components/videoPlayer';
import FileUpload from '../components/fileUpload';
import { reactLocalStorage } from 'reactjs-localstorage';
import { NotificationManager } from 'react-notifications';
const ReactMarkdown = require('react-markdown')
class Topic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                title: "",
                subTopics: []
            },
            currentSubTopic: {
                type: "video"
            },
            isFullTopic: true,
            isFullVideoTitle: true,
            prev: "/#",
            next: "/#",
            playbackRate: 1,
            privateComment: "",
            fileUrl: "",
            isSubmitted: true,
            videoUrl: ""
        };
        this.renderItem = this.renderItem.bind(this);
        this.changePlayback = this.changePlayback.bind(this);


        this.changeSubmission = this.changeSubmission.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.changeVideoQuality = this.changeVideoQuality.bind(this);
    }

    calculateCurrentSubtopic(data) {
        var currentSubTopic = data.subTopics.filter((subTopic) => {
            return subTopic.subTopicId === this.props.match.params.videoId
        });
        this.setState({ videoUrl: currentSubTopic[0].videoLink });
        var prev = "#";
        var next = "#";
        for (var i = 0; i < data.subTopics.length; i++) {
            if (data.subTopics[i].subTopicId === this.props.match.params.videoId) {

                if (i != 0) {
                    prev = `/topic/${data._id}/subtopic/${data.subTopics[i - 1].subTopicId}`

                }
                if (i != (data.subTopics.length - 1)) {
                    next = `/topic/${data._id}/subtopic/${data.subTopics[i + 1].subTopicId}`

                }
            }
        }

        this.setState({ prev, next });
        if (currentSubTopic[0].type != "video") {
            var email = reactLocalStorage.getObject("user").email
            getSubmission(email, currentSubTopic[0].subTopicId).then((docs) => {

                if (docs.length > 0) {
                    this.setState({ isSubmitted: true, currentSubTopic: currentSubTopic[0] })
                }
                else {
                    this.setState({ isSubmitted: false, currentSubTopic: currentSubTopic[0] })
                }
            }).catch((err) => {

            }).finally(() => {
                this.props.toggleLoading();
            })
        } else {
            this.setState({ currentSubTopic: currentSubTopic[0] })
            this.props.toggleLoading();

        }


    }

    changeVideoQuality(value) {
        if (value === "HD") {
            this.setState({ videoUrl: this.state.currentSubTopic.videoLink })

        }
        else {
            this.setState({ videoUrl: "https://zaio-videos.s3.ap-south-1.amazonaws.com/y2mate.com+-+Learn+The+MERN+Stack+%5B1%5D+-+Series+Introduction_PBTYxXADG_k_360p.mp4" })

        }

    }

    changeSubmission(type, value) {
        if (type == "fileUrl") {
            this.setState({ fileUrl: value });

        }
        if (type == "privateComment") {
            this.setState({ privateComment: value });
        }

    }

    uploadFile() {
        if (this.state.fileUrl === "") {
            NotificationManager.error("No file Selected");
            return;
        }
        this.props.toggleLoading("Uploading..")
        var data = {
            email: reactLocalStorage.getObject("user").email,
            subTopicId: this.state.currentSubTopic.subTopicId,
            fileUrl: this.state.fileUrl,
            comment: this.state.privateComment,
        };
        submitFile(data).then((doc) => {
            this.setState({ isSubmitted: true });
        }).finally(() => {
            this.props.toggleLoading("Uploading..")
        })

    }

    changePlayback(val) {
        var value = parseFloat(val);
        this.setState({ playbackRate: value })
    }




    renderItem(index, key) {


        var icon = this.state.data.subTopics[index].type === "video" ? faPlayCircle : faFileArchive;
        var duration = this.state.data.subTopics[index].type === "video" ? <span class="duration">{this.state.data.subTopics[index].duration}</span> : <span> </span>;
        var border = this.state.data.subTopics[index].subTopicId === this.props.match.params.videoId ? "border-dark card rounded  mb-3" : "card rounded  mb-3";
        return <div className={border}>

            <div className="row shadow rounded">
                <div className="col-md-6 bg-dark">
                    <img className="p-2 w-100" src="https://images.squarespace-cdn.com/content/v1/5a5906400abd0406785519dd/1552662149940-G6MMFW3JC2J61UBPROJ5/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/baelen.jpg?format=1500w" />
                    {duration}

                </div>
                <div className="text-center col-md-6 bg-light">
                    <div className="text-truncate  mb-3">
                        <h5>{this.state.data.subTopics[index].title}</h5>
                    </div>

                    <a href={`/topic/${this.state.data._id}/subtopic/${this.state.data.subTopics[index].subTopicId}`}><FontAwesomeIcon className="border-white " style={{ fontSize: "45", color: "#4633af" }} icon={icon} /></a>
                    <div className="mt-2 row">
                        {this.state.data.subTopics[index].type === "video" ? <div></div> : <div className="text-muted col-md-12 text-center">{this.state.data.subTopics[index].points} points</div>}
                    </div>
                </div>


            </div>
        </div>
    }



    componentDidMount() {
        this.props.toggleLoading();
        getTopic(this.props.match.params.topicId).then((data) => {
            this.setState({ data })
            this.calculateCurrentSubtopic(data)

        }).catch((err) => {
            this.props.toggleLoading();
        }).finally(() => {

        })
    }




    render() {
        const disqusShortname = "chrome-chat-extension" //found in your Disqus.com dashboard
        const disqusConfig = {
            url: window.location.href, //this.props.pageUrl
            identifier: this.props.match.params.videoId, //this.props.uniqueId
            title: this.state.currentSubTopic.title //this.props.title
        }
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var data = this.state.currentSubTopic.type == "video" ?
         this.state.currentSubTopic.desc :
         `${this.state.currentSubTopic.instruction} <br/> **Points** : ${this.state.currentSubTopic.points} <br/> **Due Date** ${new Date(this.state.currentSubTopic.due).toLocaleDateString("en-US", options)} ` ;
        return (
            <div  >
                <div className="container mb-0">
                    <div className="row">
                        <div className="title text-dark col-md-12">
                            <h3>{this.state.data.title}</h3>

                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-2 mt-1 text-muted col-md-12">
                            {this.state.isFullTopic ? this.state.data.desc : ""}
                            <FontAwesomeIcon onClick={() => {
                                var isFullTopic = !this.state.isFullTopic;
                                this.setState({ isFullTopic })
                            }} className="border-white text-dark" icon={faEllipsisH} />


                        </div>
                    </div>
                    <hr className="hr" />
                </div>





                <div className="row">

                    <div className="col-md-8">

                        <div className="row">
                            {
                                this.state.currentSubTopic.type === "video"
                                    ? <VideoPlayer
                                        prev={this.state.prev}
                                        next={this.state.next}
                                        videoUrl={this.state.videoUrl}
                                        playbackRate={this.state.playbackRate}
                                        changePlayback={this.changePlayback}
                                        changeVideoQuality={this.changeVideoQuality}
                                    />
                                    : <FileUpload
                                        isSubmitted={this.state.isSubmitted}
                                        changeSubmission={this.changeSubmission}
                                        fileUrl={this.state.fileUrl}
                                        uploadFile={this.uploadFile}
                                    />}
                        </div>
                        <div class="caption">
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className="mt-5"><b>{this.state.currentSubTopic.title}</b></h5>
                                    <hr className="hr" />
                                </div>
                            </div>

                            <div className="row ">

                                <div className="text-muted col-md-12">
                                    {this.state.isFullVideoTitle ?
                                        <ReactMarkdown escapeHtml={false} source={data} /> : ""}
                                    <FontAwesomeIcon onClick={() => {
                                        var isFullVideoTitle = !this.state.isFullVideoTitle;
                                        this.setState({ isFullVideoTitle })
                                    }} className="border-white text-dark" icon={faEllipsisH} />


                                </div>
                            </div>
                        </div>



                        <section class="bg-style">
                            <div className="row">

                                <div className="col-md-12">
                                    <DiscussionEmbed
                                        shortname={disqusShortname}
                                        config={disqusConfig}

                                    />
                                </div>
                            </div>
                        </section>

                    </div>

                    <div className="col-md-4">
                        <div className="container left-side">
                            <h5 className="text-truncate">{this.state.data.title}</h5>
                            <hr />
                            <div className=" border-dark" style={{ overflow: 'auto', maxHeight: 400 }}>

                                <ReactList

                                    itemRenderer={this.renderItem}
                                    length={this.state.data.subTopics.length}
                                    type='uniform'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }


}
export default Topic;