
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import React from 'react';
import { getCourse } from '../data/data';
import TestFinish from '../components/testFinish';
import { reactLocalStorage } from 'reactjs-localstorage';
import Modal from 'react-bootstrap/Modal'
import ReactPlayer from 'react-player'
const ReactMarkdown = require('react-markdown')
class Course extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            course: null,
            currentEvent: null,
            showModal: false,
            upComingEvents: [],
            upcomingModal: false
        }
    }

    componentDidMount() {
        this.props.toggleLoading();
        getCourse(this.props.match.params.id).then((course) => {

            this.setState({ course, currentEvent: course.events[0] }, () => {
                this.calculateUpcomingEvents()
            });
        }).catch((err) => {
            alert("Server Error..")

        }).finally(() => {
            this.props.toggleLoading();
        })

    }

    calculateUpcomingEvents() {
        var events = this.state.course.events;
        var today = new Date().getTime();
        var upComingEvents = [];
        events.forEach((event, index) => {
            var eventTime = new Date(event.start).getTime();
            var Difference_In_Time = eventTime - today;
            if (Difference_In_Time <= 0) return;
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if (Difference_In_Days <= 7) {
                upComingEvents.push(index);

            }

        })
        this.setState({ upComingEvents })
    }

    monthDiff(d1, d2) {
        var months;
        d1 = new Date(d1);
        d2 = new Date(d2);
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }


    render() {
        if (this.state.course === null) return null;
        if(this.state.course.events.length===0)return null;
        var user = reactLocalStorage.getObject('user', {
            email: "",
            imageUrl: "",
            isLoggedin: false,
            isSocialLogin: false

        }, true);
        var isPresent = this.state.course.courseFor.find((email) => {
            return email === user.email

        })

        if (isPresent === undefined || this.state.course.status === "draft") {
            return <TestFinish
                image="fa fa-times text-danger"
                message="Access Denied"
            />
        }
        if (this.state.course.status === "closed") {
            return <TestFinish
                image="fa fa-check text-success"
                message="Course Closed"
            />

        }
        return (<div style={{ marginTop: "80px" }} className="container">
            <div className="row">
                <div className="col-12">
                    <div className="col-md-10"><h4 className=" text-truncate text-topic">{this.state.course.title}<span className="badge ml-2 badge-info">X {this.monthDiff(this.state.course.startDate,this.state.course.endDate)}</span><button onClick={() => { this.setState({ upcomingModal: true }) }} className="btn filter ml-3 text-white float-right">Upcoming Events</button></h4></div>
                    <hr className="hr" />
                    <br />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="col-12"><p className="text-topic">{this.state.course.desc}</p></div>
                    <hr className="" />
                    <br />
                </div>
            </div>
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
                editable={false}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                initialEvents={this.state.course.events} // alternatively, use the `events` setting to fetch from a feed
                eventContent={renderEventContent} // custom render function
                eventClick={this.handleEventClick}
                eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            />


            < Modal size="lg" centered={true} show={this.state.showModal} onHide={() => { this.setState({ showModal: false }) }}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.currentEvent.title} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container text-center">
                        {this.renderModal()}

                    </div>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            < Modal size="md" centered={true} show={this.state.upcomingModal} onHide={() => { this.setState({ upcomingModal: false }) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Upcoming Events</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container text-center">
                        {this.renderUpcomingModal()}

                    </div>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>



        )

    }

    renderModal() {

        var currentEvent = this.state.currentEvent;
        switch (currentEvent.extendedProps.type) {

            case "videos":
                return (<div>
                    <div className="w-100 mb-3">
                        <ReactMarkdown escapeHtml={false} source={currentEvent.extendedProps.value.desc} />
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
                        url={currentEvent.extendedProps.value.videoLink}
                    />
                </div>)
            case "deliverables":
                return (
                    <div >
                        <div className="w-100 mb-3">
                            Due Date : {new Date(currentEvent.extendedProps.dueDate).toLocaleDateString("en-US")}
                        </div>
                        <div className="w-100 mb-3">
                            <ReactMarkdown escapeHtml={false} source={currentEvent.extendedProps.value.instruction} />
                        </div>


                    </div>
                )
            case "generic":
                return (
                    <div>
                        <div className="w-100 mb-3">
                            <ReactMarkdown escapeHtml={false} source={currentEvent.extendedProps.value.instruction} />
                        </div>
                    </div>
                )
            case "tests":
                return (
                    <div>
                        Access Denied
                    </div>
                )
        }
    }

    renderUpcomingModal() {
        var upComingEvents = this.state.upComingEvents;
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var uEvents = [[], [], [], [], [], [], []];
        var events = this.state.course.events;
        upComingEvents.forEach((event) => {
            var day = new Date(events[event].start).getDay();
            uEvents[day].push(events[event]);
        })

        return (
            <div className="container">
                {days.map((day, index) => {
                    return <div>
                        <div className="col-12 mb-2">
                            {day}

                        </div>
                        {uEvents[index].map((event) => {
                            return <div className="col-12">
                                <button onClick={() => {
                                    this.setState({ currentEvent: event }, () => {
                                        this.setState({ upcomingModal: false, showModal: true })
                                    })
                                }} className="btn btn-sm  btn-info text-white mb-2">{event.title}</button>
                            </div>

                        })}
                        <hr />
                    </div>
                })}




            </div>
        )
    }

    handleEventClick = (clickInfo) => {
        this.setState({ currentEvent: clickInfo.event }, () => {
            this.setState({ showModal: true })
        })

    }

    handleEvents = (events) => {
        var course = this.state.course
        course.events = events
        this.setState({
            course
        })

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
            return (
                <>
                    <b>{eventInfo.timeText}</b>
                    <i>{eventInfo.event.title}</i>
                </>
            )

        default:
    }


}
export default Course