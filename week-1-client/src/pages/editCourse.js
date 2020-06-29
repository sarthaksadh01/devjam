import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { getCourse, getTopic, getContent, getAllTests, updateCourse } from '../data/data'
import Modal from 'react-bootstrap/Modal'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import DateTimePicker from 'react-datetime-picker';
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import MarkdownIt from 'markdown-it'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPlayer from 'react-player'
import { NotificationManager } from 'react-notifications'
import history from '../components/history'
const ReactMarkdown = require('react-markdown')


class EditCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null,
            currentEvents: [],
            showVideoModal: false,
            showDelivarableModal: false,
            showTestModal: false,
            showGenericModal: false,
            showOptionModal: false,
            topics: [],
            videos: [],
            deliverables: [],
            tests: [],
            selectedVideoTopic: -1,
            selectedDeliverableTopic: -1,
            queryVideos: [],
            queryDeliverables: [],
            queryTests: [],
            date: new Date(),
            eventInstruction: '',
            selectInfo: '',
            selectedVideos: [],
            selectedDeliverable: [],
            selectedTests: [],
            eventTitle: "",
            editEventIndex: 0,
            showEditEventModal: false,
            editEvent: null,
            clickInfo: null

        }
        this.changeVideoTopic = this.changeVideoTopic.bind(this);
        this.changeDeliverableTopic = this.changeDeliverableTopic.bind(this);
        this.onSearchVideo = this.onSearchVideo.bind(this);
        this.onSearchDeliverable = this.onSearchDeliverable.bind(this);
        this.onSearchTest = this.onSearchTest.bind(this);

    }
    componentDidMount() {
        this.props.toggleLoading();
        getCourse(this.props.match.params.id).then((course) => {
            getContent("cryptx").then((topics) => {
                getAllTests().then((tests) => {
                    this.setState({ course, topics, tests }, () => {
                        this.onSearchDeliverable("");
                        this.onSearchVideo("");
                        this.onSearchTest("")
                    })

                }).finally(()=>{
                    this.props.toggleLoading();
                })


            })

        })
    }
    changeVideoTopic(index) {
        this.setState({ selectedVideoTopic: index }, () => {
            this.onSearchVideo("")
        })

    }
    changeDeliverableTopic(index) {
        this.setState({ selectedDeliverableTopic: index }, () => {
            this.onSearchDeliverable("")
        })

    }
    onSearchTest(query) {
        var tests = this.state.tests;
        var queryTests = tests.filter((test) => {
            return test.title.toLowerCase().includes(query.toLowerCase());
        })
        this.setState({ queryTests });

    }
    onSearchVideo(query) {
        var queryVideos = [];
        var topics = this.state.topics;
        var selectedVideoTopic = this.state.selectedVideoTopic;
        if (selectedVideoTopic === -1) {
            topics.forEach((topic) => {
                topic.subTopics.forEach((subTopic) => {
                    if (subTopic.type === "video") {
                        if (subTopic.title.toLowerCase().includes(query.toLowerCase())) {
                            queryVideos.push(subTopic);
                        }
                    }

                })
            })
        }
        else {
            topics[selectedVideoTopic].subTopics.forEach((subTopic) => {
                if (subTopic.type === "video") {
                    if (subTopic.title.toLowerCase().includes(query.toLowerCase())) {
                        queryVideos.push(subTopic);
                    }
                }

            })
        }
        this.setState({ queryVideos })

    }
    buttonText = {
        draft: "Publish",
        published: "Close",
        closed: "View"
    }
    functionCall = {
        draft: () => {
            history.push(`/publish-course/${this.state.course._id}`)
            window.location.reload();
        },
        published: () => {
            if (window.confirm("Are you sure you want to close the Course")) {
                this.props.toggleLoading("loading....");
                var course = this.state.course;
                course.status = "closed";
                
                updateCourse(course).then(() => {
                    NotificationManager.success("Course Closed");
                    this.setState({ course })

                }).catch((err) => {
                    NotificationManager.error("Cannot connect to the Server!");

                }).finally(() => {
                    this.props.toggleLoading();

                })

            }

        },
        closed: () => {
            history.push(`/view-course/${this.state.course._id}`)
            window.location.reload();
           


        }
    }

    onSearchDeliverable(query) {
        var queryDeliverables = [];
        var topics = this.state.topics;
        var selectedDeliverableTopic = this.state.selectedDeliverableTopic;
        if (selectedDeliverableTopic === -1) {
            topics.forEach((topic) => {
                topic.subTopics.forEach((subTopic) => {
                    if (subTopic.type === "deliverable") {
                        if (subTopic.title.toLowerCase().includes(query.toLowerCase())) {
                            queryDeliverables.push(subTopic);
                        }
                    }

                })
            })
        }
        else {
            topics[selectedDeliverableTopic].subTopics.forEach((subTopic) => {
                if (subTopic.type === "deliverable") {
                    if (subTopic.title.toLowerCase().includes(query.toLowerCase())) {
                        queryDeliverables.push(subTopic);
                    }
                }

            })
        }
        this.setState({ queryDeliverables })

    }

    onClickUpdateCourse() {
        this.props.toggleLoading();
        updateCourse(this.state.course).then((docs) => {
            NotificationManager.success("Course Updated");

        }).catch((err) => {

        }).finally(()=>{
            this.props.toggleLoading();
        })
    }


    render() {
        const mdParser = new MarkdownIt();
        if (this.state.course === null) return null;
        return (
            <div className="container">
                <div style={{ marginTop: "90px" }} className="row">
                    <div className="col-md-6">
                        <div className="col-md-10"><h4 className=" text-truncate text-topic">{this.state.course.title}<span className="badge float-right rounded text-white badge-info">X {this.state.course.events.length}</span></h4></div>
                        <hr className="hr" />
                        <br />
                    </div>

                    <div className="col-md-6">

                        <a href={`/view-course/${this.state.course._id}`} className="btn float-left round-shape-btn  ml-3"><FontAwesomeIcon className="text-white mr-1" icon={faEye} /></a>
                        <button onClick={() => { this.onClickUpdateCourse() }} className="btn float-left round-shape-btn  ml-3">Save</button>
                        <button onClick ={()=>{this.functionCall[this.state.course.status]()}} className="btn text-white float-left round-shape-btn  ml-3">{this.buttonText[this.state.course.status]}</button>
                        <a href={`https://devjam-server.herokuapp.com/api/reminder`} className="btn text-white float-left round-shape-btn  ml-3">Reminder</a>
                    </div>
                </div>
                <div className="row">
                    {/* <div className="col-md-12"> */}
                    <div className="col-6">
                        <form>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Course Title</label>
                                <input onChange={(e) => {
                                    var course = this.state.course;
                                    course.title = e.target.value;
                                    this.setState({ course });
                                }} value={this.state.course.title} type="text" class="form-control" id="exampleFormControlInput1" placeholder="" />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Course Description</label>
                                <textarea onChange={(e) => {
                                    var course = this.state.course;
                                    course.desc = e.target.value;
                                    this.setState({ course });
                                }} value={this.state.course.desc} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="col-3 ">
                        <DatePicker
                            className="mb-3"
                            startDate={new Date()}
                            selected={new Date(this.state.course.startDate)}
                            onChange={(date) => { var course = this.state.course; course.startDate = date; this.setState({ course }) }}
                        />

                    </div>
                    <div className="col-3">
                        <DatePicker
                            className="ml-3 mb-3"
                            startDate={new Date()}
                            selected={new Date(this.state.course.endDate)}
                            onChange={(date) => {
                                // alert(date)
                                var course = this.state.course; course.endDate = date; this.setState({ course })
                            }}
                        />
                    </div>
                    {/* </div> */}
                </div>


                <div >
                    <hr />
                    <div style={{ marginTop: "80px" }} className='mb-3'>
                        <FullCalendar
                            eventColor={'#c850c0'}
                            validRange={
                                {
                                    start: new Date(this.state.course.startDate),
                                    end: new Date(this.state.course.endDate)
                                }
                            }
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            initialView='dayGridMonth'
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={true}
                            initialEvents={this.state.course.events} // alternatively, use the `events` setting to fetch from a feed
                            select={this.handleDateSelect}
                            eventContent={renderEventContent} // custom render function
                            eventClick={this.handleEventClick}
                            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                            eventChange={(arg) => {

                            }}
                        /* you can update a remote database when these fire:
                        eventAdd={function(){}}
                        eventChange={function(){}}
                        eventRemove={function(){}}
                        */
                        />
                    </div>
                </div>
                < Modal centered={true} show={this.state.showVideoModal} onHide={() => { this.setState({ showVideoModal: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Video(s)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row text-left">
                                <div className="col-12">
                                    <DropdownButton className="w-100" variant="success" title={this.state.selectedVideoTopic === -1 ? "All Topics" : this.state.topics[this.state.selectedVideoTopic].title}>
                                        <Dropdown.Item onClick={() => { this.changeVideoTopic(-1) }} href="#/action-1">All Topics</Dropdown.Item>
                                        {this.state.topics.map((topic, index) => {
                                            return <li>
                                                <Dropdown.Item onClick={() => { this.changeVideoTopic(index) }} href="#/action-1">{topic.title}</Dropdown.Item>
                                            </li>
                                        })}

                                    </DropdownButton>

                                </div>

                            </div>
                            <div className="row mt-3 text-center">
                                <div className="col-12">
                                    <input onChange={(e) => { this.onSearchVideo(e.target.value) }} placeholder="search Videos" className="form-control w-100" />
                                </div>

                            </div>
                            <div className="row mt-3 text-left">
                                <div className="col-12">
                                    <div class="card p-1 user-table">
                                        <div class="list-group checkbox-list-group">
                                            <div class="list-group-item">
                                                <ul>

                                                    {this.state.queryVideos.map((video) => {
                                                        return <li>
                                                            <label>
                                                                <input
                                                                    onChange={(e) => {

                                                                        var selectedVideos = this.state.selectedVideos;
                                                                        var isPresent = selectedVideos.find((v1) => {
                                                                            return v1 === video;
                                                                        });
                                                                        if (isPresent === undefined) {
                                                                            selectedVideos.push(video);
                                                                        }
                                                                        else {
                                                                            var index = selectedVideos.indexOf(video);
                                                                            if (index !== -1) selectedVideos.splice(index, 1);
                                                                        }
                                                                        this.setState({ selectedVideos })
                                                                    }}
                                                                    checked={this.state.selectedVideos.find((v1) => {
                                                                        return v1 === video
                                                                    }) !== undefined}
                                                                    type="checkbox" />
                                                                <span class="list-group-item-text">
                                                                    <i class="fa fa-fw"></i>
                                                                    {video.title}
                                                                </span>
                                                            </label>
                                                        </li>
                                                    })}
                                                </ul>


                                            </div>
                                        </div>

                                    </div>
                                    <button onClick={() => {

                                        let calendarApi = this.state.selectInfo.view.calendar
                                        var selectedVideos = this.state.selectedVideos;
                                        if (selectedVideos.length === 0) {
                                            alert("No videos Selected");
                                            return;
                                        }
                                        selectedVideos.forEach((video) => {
                                            var id = createEventId();
                                            calendarApi.addEvent({
                                                id,
                                                title: video.title,
                                                start: this.state.selectInfo.startStr,
                                                end: this.state.selectInfo.endStr,
                                                allDay: this.state.selectInfo.allDay,
                                                type: "videos",
                                                value: video
                                            })

                                        })
                                        calendarApi.unselect()
                                        this.setState({ showVideoModal: false, selectedVideoTopic: -1, selectedVideos: [] }, () => {
                                            this.onSearchVideo("")
                                        })

                                    }} className="btn mt-3 filter rounded-pill text-white">Create Event</button>
                                </div>

                            </div>

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>


                < Modal centered={true} show={this.state.showDelivarableModal} onHide={() => { this.setState({ showDelivarableModal: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Deliverable(s)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row text-left">
                                <div className="col-12">
                                    <DropdownButton className="w-100" variant="success" title={this.state.selectedDeliverableTopic === -1 ? "All Topics" : this.state.topics[this.state.selectedDeliverableTopic].title}>
                                        {this.state.topics.map((topic, index) => {
                                            return <li>
                                                <Dropdown.Item onClick={() => { this.changeDeliverableTopic(index) }} href="#/action-1">{topic.title}</Dropdown.Item>
                                            </li>
                                        })}

                                    </DropdownButton>

                                </div>

                            </div>
                            <div className="row mt-3 text-center">
                                <div className="col-12">
                                    <input
                                        onChange={(e) => { this.onSearchDeliverable(e.target.value) }} placeholder="search Deliverables" className="form-control w-100" />
                                </div>

                            </div>
                            <div className="row mt-3 text-left">
                                <div className="col-12">
                                    <div style={{ overflowY: "auto", minHeight: "300px", maxHeight: "300px" }} class="card p-1 user-table">
                                        <div class="list-group checkbox-list-group">
                                            <div class="list-group-item">
                                                <ul>

                                                    {this.state.queryDeliverables.map((deliverable) => {
                                                        return <li>
                                                            <label>
                                                                <input
                                                                    onChange={(e) => {

                                                                        var selectedDeliverable = this.state.selectedDeliverable;
                                                                        var isPresent = selectedDeliverable.find((v1) => {
                                                                            return v1 === deliverable;
                                                                        });
                                                                        if (isPresent === undefined) {
                                                                            selectedDeliverable.push(deliverable);
                                                                        }
                                                                        else {
                                                                            var index = selectedDeliverable.indexOf(deliverable);
                                                                            if (index !== -1) selectedDeliverable.splice(index, 1);
                                                                        }
                                                                        this.setState({ selectedDeliverable })
                                                                    }}
                                                                    checked={this.state.selectedDeliverable.find((v1) => {
                                                                        return v1 === deliverable
                                                                    }) !== undefined}

                                                                    checked={this.state.selectedDeliverable.find((v1) => {
                                                                        return v1 === deliverable
                                                                    }) !== undefined} type="checkbox" />
                                                                <span class="list-group-item-text">
                                                                    <i class="fa fa-fw"></i>
                                                                    {deliverable.title}
                                                                </span>
                                                            </label>
                                                        </li>
                                                    })}
                                                </ul>


                                            </div>
                                        </div>

                                    </div>
                                    <DatePicker
                                        showTimeSelect
                                        className="mt-3"
                                        startDate={new Date()}
                                        selected={new Date(this.state.date)}
                                        onChange={(d) => { this.setState({ date: d }) }
                                        }
                                    />

                                    <br />
                                    <button onClick={() => {

                                        let calendarApi = this.state.selectInfo.view.calendar
                                        var selectedDeliverable = this.state.selectedDeliverable;
                                        if (selectedDeliverable.length === 0) {
                                            alert("No Deliverables Selected");
                                            return;
                                        }
                                        selectedDeliverable.forEach((deliverable) => {
                                            var id = createEventId();
                                            calendarApi.addEvent({
                                                id,
                                                title: deliverable.title,
                                                start: this.state.selectInfo.startStr,
                                                end: this.state.selectInfo.endStr,
                                                allDay: this.state.selectInfo.allDay,
                                                type: "deliverables",
                                                value: deliverable,
                                                dueDate: this.state.date
                                            })

                                        })
                                        calendarApi.unselect()
                                        this.setState({ showDelivarableModal: false, selectedDeliverableTopic: -1, selectedDeliverable: [] }, () => {
                                            this.onSearchDeliverable("")
                                        })

                                    }} className="btn mt-3 filter rounded-pill text-white">Create Event</button>
                                </div>

                            </div>

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>


                < Modal centered={true} show={this.state.showTestModal} onHide={() => { this.setState({ showTestModal: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Tests(s)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row mt-3 text-center">
                                <div className="col-12">
                                    <input onChange={(e) => { this.onSearchTest(e.target.value) }} placeholder="search Tests" className="form-control w-100" />
                                </div>

                            </div>
                            <div className="row mt-3 text-left">
                                <div className="col-12">
                                    <div style={{ overflowY: "auto", minHeight: "300px", maxHeight: "300px" }} class="card p-1 user-table">
                                        <div class="list-group checkbox-list-group">
                                            <div class="list-group-item">
                                                <ul>

                                                    {this.state.queryTests.map((test) => {
                                                        return <li>
                                                            <label>
                                                                <input
                                                                    onChange={(e) => {

                                                                        var selectedTests = this.state.selectedTests;
                                                                        var isPresent = selectedTests.find((v1) => {
                                                                            return v1 === test;
                                                                        });
                                                                        if (isPresent === undefined) {
                                                                            selectedTests.push(test);
                                                                        }
                                                                        else {
                                                                            var index = selectedTests.indexOf(test);
                                                                            if (index !== -1) selectedTests.splice(index, 1);
                                                                        }
                                                                        this.setState({ selectedTests })
                                                                    }}
                                                                    checked={this.state.selectedTests.find((v1) => {
                                                                        return v1 === test
                                                                    }) !== undefined}
                                                                    type="checkbox" />
                                                                <span class="list-group-item-text">
                                                                    <i class="fa fa-fw"></i>
                                                                    {test.title}
                                                                </span>
                                                            </label>
                                                        </li>
                                                    })}
                                                </ul>


                                            </div>
                                        </div>

                                    </div>
                                    <br />
                                    <button

                                        onClick={() => {

                                            let calendarApi = this.state.selectInfo.view.calendar
                                            var selectedTests = this.state.selectedTests;
                                            if (selectedTests.length === 0) {
                                                alert("No Tests Selected");
                                                return;
                                            }
                                            selectedTests.forEach((test) => {
                                                var id = createEventId();
                                                calendarApi.addEvent({
                                                    id,
                                                    title: test.title,
                                                    start: this.state.selectInfo.startStr,
                                                    end: this.state.selectInfo.endStr,
                                                    allDay: this.state.selectInfo.allDay,
                                                    type: "tests",
                                                    value: test,
                                                })

                                            })
                                            calendarApi.unselect()
                                            this.setState({ showTestModal: false, selectedTests: [] }, () => {
                                                this.onSearchTest("")
                                            })

                                        }}


                                        className="btn mt-3 filter rounded-pill text-white">Create Event</button>
                                </div>

                            </div>

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>



                < Modal centered={true} show={this.state.showGenericModal} onHide={() => { this.setState({ showGenericModal: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Generic Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row mt-3 text-center">
                                <div className="col-12">
                                    <input onChange={(e) => { this.setState({ eventTitle: e.target.value }) }} placeholder="Event Title" className="form-control w-100" />
                                </div>

                            </div>
                            <div className="row mt-3 text-left">
                                <div className="col-12">
                                    <MdEditor
                                        value={this.state.eventInstruction}
                                        style={{ height: "350px" }}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={({ html, text }) => {
                                            this.setState({ eventInstruction: text })
                                        }}
                                    />


                                </div>
                                <button
                                    onClick={() => {

                                        let calendarApi = this.state.selectInfo.view.calendar
                                        var id = createEventId();
                                        calendarApi.addEvent({
                                            id,
                                            title: this.state.eventTitle,
                                            start: this.state.selectInfo.startStr,
                                            end: this.state.selectInfo.endStr,
                                            allDay: this.state.selectInfo.allDay,
                                            type: "generic",
                                            value: {
                                                title: this.state.eventTitle,
                                                instruction: this.state.eventInstruction
                                            },
                                        })
                                        calendarApi.unselect()
                                        this.setState({ showGenericModal: false, eventTitle: '', eventInstruction: '' })

                                    }}

                                    className="btn mt-3 filter rounded-pill text-white">Create Event</button>

                            </div>

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>


                < Modal size="sm" centered={true} show={this.state.showOptionModal} onHide={() => { this.setState({ showOptionModal: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title> Select Event type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container text-center">
                            <button onClick={() => {
                                this.setState({ showVideoModal: true, showOptionModal: false })

                            }} className="btn mt-3 filter rounded w-100 text-center text-white">Add Video</button>
                            {/* <br /> */}
                            <button onClick={() => {
                                this.setState({ showDelivarableModal: true, showOptionModal: false })
                                // this.setState({ showDelivarableModal: true, showOptionModal: false })
                            }} className="btn mt-3 filter rounded w-100 text-center text-white">Add Deliverable</button>
                            {/* <br /> */}
                            <button onClick={() => {
                                this.setState({ showTestModal: true, showOptionModal: false })
                            }} className="btn mt-3 filter rounded w-100 text-center text-white">Add tests</button>
                            {/* <br /> */}
                            <button onClick={() => {
                                this.setState({ showGenericModal: true, showOptionModal: false })
                            }} className="btn mt-3 filter rounded w-100 text-center text-white">Add Event</button>
                            {/* <br /> */}

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                < Modal size="md" centered={true} show={this.state.showEditEventModal} onHide={() => { this.setState({ showEditEventModal: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title> Edit Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.showEditEventModal ? this.renderEditModal() : <div></div>}


                    </Modal.Body>
                    <Modal.Footer>
                        <div className="row text-left">

                            <div className="col-6">
                                <button onClick={() => {
                                    var course = this.state.course;
                                    var editEvent = JSON.parse(JSON.stringify(this.state.editEvent));
                                    if (editEvent.extendedProps.type === "generic") {
                                        editEvent.title = editEvent.extendedProps.value.title;
                                    }

                                    course.events[this.state.editEventIndex] = editEvent;
                                    this.setState({ course, showEditEventModal: false }, () => {
                                        this.props.toggleLoading();

                                        updateCourse(this.state.course).then((docs) => {

                                            window.location.reload();

                                        }).catch((err) => {

                                        })

                                    });


                                }} className="btn mt-3 filter rounded w-100 text-center text-white">Save</button>

                            </div>
                            <div className="col-6">
                                <button onClick={() => {
                                    var clickInfo = this.state.clickInfo;
                                    clickInfo.event.remove();
                                    this.setState({ showEditEventModal: false });
                                }} className="btn mt-3 filter rounded w-100 text-center text-white">Delete</button>

                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>


            </div>
        )
    }

    handleWeekendsToggle = () => {
        this.setState({
            weekendsVisible: !this.state.weekendsVisible
        })
    }

    handleDateSelect = (selectInfo) => {
        this.setState({ selectInfo }, () => {
            this.setState({ showOptionModal: true })
        })
    }
    // extendedProps":{"randomValue":"lol"}

    handleEventClick = (clickInfo) => {
        // console.log(clickInfo)
        var course = this.state.course
        var i = 0;
        course.events.forEach((event, index) => {
            if (event.id === clickInfo.event.id) {
                i = index;
            }
        })
        this.setState({ editEventIndex: i, editEvent: JSON.parse(JSON.stringify(course.events[i])), clickInfo }, () => {
            this.setState({ showEditEventModal: true })
        });

    }

    handleEvents = (events) => {
        var course = this.state.course
        course.events = events
        this.setState({
            course
        })

    }

    renderEditModal() {
        switch (this.state.editEvent.extendedProps.type) {

            case "videos":
                return (<div>
                    <div className="w-100 mb-3">
                        <ReactMarkdown escapeHtml={false} source={this.state.editEvent.extendedProps.value.desc} />
                    </div>
                    <ReactPlayer
                        showNext={true}
                        width={"100%"}
                        height={"90%"}
                        controls={true}
                        config={{
                            file: {
                                attributes: {
                                    onContextMenu: e => e.preventDefault(),
                                    controlsList: 'nodownload'
                                }
                            }
                        }}
                        url={this.state.editEvent.extendedProps.value.videoLink}
                    />
                </div>)
            case "deliverables":
                return (
                    <div >
                        <div className="w-100 mb-3">
                            Due Date : {new Date(this.state.editEvent.extendedProps.dueDate).toLocaleDateString("en-US")}
                        </div>
                        <div className="w-100 mb-3">
                            <ReactMarkdown escapeHtml={false} source={this.state.editEvent.extendedProps.value.instruction} />
                        </div>
                        <div className="w-100 mb-3">
                            <DatePicker
                                showTimeSelect
                                className="ml-3 mb-3"
                                startDate={new Date()}
                                selected={new Date(this.state.editEvent.extendedProps.dueDate)}
                                onChange={(date) => {
                                    var editEvent = this.state.editEvent
                                    editEvent.extendedProps.dueDate = date
                                    this.setState({ editEvent })
                                }
                                }
                            />

                        </div>


                    </div>
                )
            case "generic":
                return (
                    <div className="container">
                        <div className="row mt-3 text-center">
                            <div className="col-12">
                                <input
                                    value={this.state.editEvent.extendedProps.value.title}
                                    onChange={(e) => {
                                        var editEvent = this.state.editEvent
                                        editEvent.extendedProps.value.title = e.target.value
                                        this.setState({ editEvent })
                                    }} placeholder="Event Title" className="form-control w-100" />
                            </div>

                        </div>
                        <div className="row mt-3 text-left">
                            <div className="col-12">
                                <MdEditor
                                    value={this.state.editEvent.extendedProps.value.instruction}
                                    style={{ height: "350px" }}
                                    renderHTML={(text) => new MarkdownIt().render(text)}
                                    onChange={({ html, text }) => {
                                        var editEvent = this.state.editEvent
                                        editEvent.extendedProps.value.instruction = text
                                        this.setState({ editEvent })
                                    }}
                                />


                            </div>


                        </div>

                    </div>
                )
            case "tests":
                return (
                    <div>
                        To change test timing switch to day view in the calendar and drag the test to required timing.

                    </div>
                )
        }
    }
}
function renderEventContent(eventInfo) {
    switch (eventInfo.event.extendedProps.type) {
        case "videos":
            return (
                <>
                    <b>{eventInfo.timeText}</b>
                    <i className="text-truncate"><i class="fa mr-1 ml-1 fa-video-camera" aria-hidden="true"></i>{eventInfo.event.title}</i>
                </>
            )
        case "tests":
            return (
                <>
                    <b>{eventInfo.timeText}</b>
                    <i className="text-truncate">{eventInfo.event.title}</i>
                </>
            )
        case "deliverables":
            return (
                <>
                    <b>{eventInfo.timeText}</b>
                    <i className="text-truncate"><i class="fa mr-1 ml-1 fa-file" aria-hidden="true"></i><i>{new Date(eventInfo.event.extendedProps.dueDate).getDate()}-</i>{eventInfo.event.title}</i>
                    <br />

                </>
            )
        case "generic":
            break;
        default:
    }

    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}


export default EditCourse;