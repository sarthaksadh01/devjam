import React from 'react';
import { getTopic, updateTopic, insertSubtopic } from '../data/data'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {  Dropdown } from 'react-bootstrap'
import ReactDragListView from 'react-drag-listview/lib/index.js';
import history from "../components/history"
import "../assets/css/sidebar.css"

class Topic extends React.Component {

    constructor(props) {
        super(props)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)

    }

    state = {
        data: {
            title: "loading",
            desc: "loading",
            subTopics: []
        },
    }

    componentDidMount() {
        this.populate();
    }

    populate() {
        this.props.toggleLoading()
        var topicId = this.props.match.params.id
        getTopic(topicId).then((data) => {
            this.setState({ data })
        }).catch((err) => {
            NotificationManager.error('Error', 'Error loading webpage');
        }).finally(() => {
            this.props.toggleLoading()
        })

    }

    onClickUpdateTopic() {
        this.props.toggleLoading("Updating Topic")
        updateTopic(this.state.data).then((val) => {
            NotificationManager.success('Success', 'Topic Updated');

        }).catch((err) => {
            NotificationManager.error('Error', 'Error updating Topic');

        }).finally(() => {
            this.props.toggleLoading()

        })

    }

    onClickAddSubTopic(type) {
        this.props.toggleLoading(`Adding ${type}`)
        insertSubtopic(type, this.state.data._id).then((id) => {
            NotificationManager.success('Success', `${type} added`);
            history.push(`/${type}/${this.state.data._id}-${id}`);
            window.location.reload()

        }).catch((err) => {
            NotificationManager.error('Error', `Error Adding ${type}`);

        }).finally(() => {
            this.setState({ isLoading: false })
            this.props.toggleLoading()

        })


    }

    onClickRemoveSubTopic(index) {
        this.setState(this.state.data.subTopics.splice(index, 1));
        this.onClickUpdateTopic();

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

    render() {

        const that = this;
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const data = that.state.data;

                // reArrangeList(data[fromIndex]._id, data[toIndex]._id, data[toIndex].priority, data[fromIndex].priority);
                const item = data.subTopics.splice(fromIndex, 1)[0];
                data.subTopics.splice(toIndex, 0, item);
                that.setState({ data });
                that.onClickUpdateTopic();
            },
            nodeSelector: 'li',
            handleSelector: 'section'
        };


        return (
            <div className="mt-5 container">

                <div style={{ marginTop: "90px" }} className="row">
                    <div className="col-md-8">
                        <form>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Topic Title</label>
                                <input onChange={this.handleTitleChange} value={this.state.data.title} type="text" class="form-control" id="exampleFormControlInput1" placeholder="" />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Topic Description</label>
                                <textarea onChange={this.handleDescChange} value={this.state.data.desc} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <button onClick={() => { this.onClickUpdateTopic() }} className="btn hidden2 create-button ml-3">Save</button>
                    </div>
                </div>
                <div className="row mb-5">
                    <button onClick={() => { this.onClickAddSubTopic("video") }} className="btn float-left round-shape-btn  ml-3">Add</button>
                    <button onClick={() => { this.onClickAddSubTopic("deliverable") }} className="btn float-left round-shape-btn  ml-3">Create</button>
                    <button onClick={() => { this.onClickUpdateTopic() }} className="hidden btn round-shape-btn ml-3">Save</button>
                </div>

                <div className="row mt-3">
                    <div className="col-md-8">

                        <ReactDragListView {...dragProps}>
                            <ul className="p-0 m-0">

                                {this.state.data.subTopics.map((subTopic, index) => {
                                    return <li><div class="shadow card mb-2 ml-2">
                                        
                                        <div class="card-body">
                                            <div className="row">
                                                <div className="col-md-9">
                                                    <p className="text-truncate ">{subTopic.title}</p>
                                                </div>

                                                <div className="float-right  col-md-1">
                                                    <Dropdown>
                                                        <Dropdown.Toggle className="btn button-edit" variant="" id="dropdown-basic">
                                                            <FontAwesomeIcon icon={faEllipsisV} />
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item href={subTopic.type === "video" ? `/video/${this.state.data._id}-${subTopic.subTopicId}` : `/deliverable/${this.state.data._id}-${subTopic.subTopicId}`}>Edit</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { this.onClickRemoveSubTopic(index) }}>Remove</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                    <section className="btn text-white button-edit">Drag</section>


                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    </li>

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

export default Topic;