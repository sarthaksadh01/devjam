import React from 'react';
import "../assets/css/sidebar.css"
import 'react-notifications/lib/notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faEdit } from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'react-bootstrap'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getContent, createTopic, removeTopic } from '../data/data'
import ReactDragListView from 'react-drag-listview/lib/index.js';
import { reArrangeList } from "../data/data"

import history from "../components/history"


class Content extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            data: [],
            createdBy:props.userName
        }
    }

    componentDidMount() {
        this.populate();
    }
    populate() {
        this.props.toggleLoading();
        getContent(this.state.createdBy).then((data) => {
            console.log(data);
            this.setState({ data })
        }).catch((err) => {
            console.log(err);
            NotificationManager.error('Error', 'Error loading webpage');
        }).finally(() => {
            this.props.toggleLoading();
        })

    }
    onClickCreate() {
        this.props.toggleLoading("Creating Topic");
        createTopic(this.state.createdBy).then((topicDetail) => {
            NotificationManager.success('Success', 'New Topic Created');
            history.push(`/topic/${topicDetail._id}`);
            window.location.reload()

        }).catch((err) => {
            NotificationManager.error('Error', 'Error Creating Topic');
        }).finally(() => {
            this.props.toggleLoading();
        })


    }

    onClickRemoveTopic(index) {
        this.props.toggleLoading("Removing Topic");
        removeTopic(this.state.data[index]._id).then((topicDetail) => {
            NotificationManager.success('Success', 'Topic Rmoved');
            this.setState(this.state.data.splice(index, 1));

        }).catch((err) => {
            NotificationManager.error('Error', 'Error Removing Topic');
        }).finally(() => {
            this.props.toggleLoading();

        })

    }

    onClickRearrangeTopic(_id1, _id2, p1, p2) {
        this.props.toggleLoading("Rearranging Topics");
        reArrangeList(_id1, _id2, p1, p2).then((doc) => {
            NotificationManager.success('Success', 'Topics Rearranged');
        }).catch((err) => {
            NotificationManager.error('Error', 'Error Rearranging Topics');
        }).finally(() => {
            this.props.toggleLoading();

        })

    }

    render() {
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const { data } = that.state;
                var _id1 = data[fromIndex]._id;
                var _id2 = data[toIndex]._id;
                var p1 = data[toIndex].priority;
                var p2 = data[fromIndex].priority
                const item = data.splice(fromIndex, 1)[0];
                data.splice(toIndex, 0, item);
                that.setState({ data });
                that.onClickRearrangeTopic(_id1, _id2, p1, p2);
            },
            nodeSelector: 'li',
            handleSelector: 'section'
        };
        return (
            <div>
                <div class="bg-dark sidenav">
                    {this.state.data.map((topic, index) => {
                        return <a className="text-center text-truncate" href={"#" + topic._id}>{topic.title}</a>
                    })}
                </div>

                <div class="main">
                    <div className="container">
                        <div className="mb-5 create-button" onClick={() => { this.onClickCreate() }} ><span>Create </span></div>

                        {/* <hr /> */}
                        <ReactDragListView {...dragProps}>
                            <ul>

                                {this.state.data.map((topic, index) => {

                                    return (


                                        <li key={topic._id} id={topic._id} className="topic">
                                            <div className="row">
                                                <div className="col-md-10"><h4 className=" text-truncate text-topic">{topic.title}</h4>

                                                </div>
                                                <div className="float-right col-md-1">
                                                    <Dropdown>
                                                        <Dropdown.Toggle className="btn button-edit" variant="" id="dropdown-basic">
                                                            <FontAwesomeIcon icon={faEllipsisV} />
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item href={`topic/${topic._id}`}>Edit</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { this.onClickRemoveTopic(index) }}>Remove</Dropdown.Item>
                                                            {/* <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                                                        </Dropdown.Menu>
                                                    </Dropdown>

                                                    <section className="btn text-white button-edit">Drag</section>
                                                </div>
                                            </div>
                                            <hr className="hr" />
                                            <div className="row mt-3">
                                                {topic.subTopics.map((subTopic, index) => {
                                                    return (
                                                        <div className="col-md-6">
                                                            <div class=" card mb-2">
                                                                <div class="card-body">
                                                                    <div className="row">
                                                                        <div className="text-truncate text-sub-topic col-md-9">
                                                                            {subTopic.title}
                                                                        </div>
                                                                        <div className="float-right  col-md-2">
                                                                            <a href={subTopic.type === "video" ? `video/${topic._id}-${subTopic.subTopicId}` : `deliverable/${topic._id}-${subTopic.subTopicId}`} className="text-white btn  button-edit"><FontAwesomeIcon icon={faEdit} /></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                    );

                                                })}
                                            </div>
                                            <br />
                                        </li>

                                    );

                                })}
                            </ul>
                        </ReactDragListView>

                    </div>
                </div>
                <NotificationContainer />
            </div>
        );
    }
}
export default Content;