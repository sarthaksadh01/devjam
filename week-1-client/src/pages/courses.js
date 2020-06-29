import React from 'react';
import { getAllTests, createTest, updateTest, getAllCourses, updateCourse, createCourse } from '../data/data';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import history from "../components/history"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { reactLocalStorage } from 'reactjs-localstorage';

class Courses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFilter: true,
            filter: "",
            courses: [],
            filterCourses: []

        }
        this.onFilterChange = this.onFilterChange.bind(this)
    }
    componentDidMount() {
        this.props.toggleLoading();
        getAllCourses().then((courses) => {
            this.setState({ courses, filterCourses: courses });
        }).finally((err) => {
            this.props.toggleLoading();

        })

    }
    buttonText = {
        draft: "Publish",
        published: "Close",
        closed: "View"
    }
    functionCall = {
        draft: (index) => {
            history.push(`/publish-course/${this.state.courses[index]._id}`)
            window.location.reload();
        },
        published: (index) => {
            if (window.confirm("Are you sure you want to close the Course")) {
                this.props.toggleLoading("loading....");
                var filterCourses = this.state.filterCourses;
                filterCourses[index].status = "closed";
                var courses = this.state.courses;
                for (var i = 0; i < courses.length; i++) {
                    if (courses[i]._id === filterCourses[index]._id) {
                        courses[i].status = "closed";
                    }
                }
                updateCourse(filterCourses[index]).then(() => {
                    NotificationManager.success("Course Closed");
                    this.setState({ filterCourses, courses })

                }).catch((err) => {
                    NotificationManager.error("Cannot connect to the Server!");

                }).finally(() => {
                    this.props.toggleLoading();

                })

            }

        },
        closed: (index) => {
            history.push(`/view-course/${this.state.courses[index]._id}`)
            window.location.reload();
            // history.push(`/view-results/${this.state.courses[index]._id}`);
            // window.location.reload()


        }
    }
    onFilterChange(e) {
        var query = e.target.value;
        var courses = this.state.courses;
        if (query === "clear") {
            this.setState({ filterCourses: courses, filter: query })
            return;

        }
        else {
            var filterCourses = courses.filter((course) => {
                return course.status === query;
            })
            this.setState({ filterCourses, filter: query })

        }


    }
    onClickCreate() {
        this.props.toggleLoading("Creating Course");
        createCourse().then((courseDetail) => {
            NotificationManager.success('Success', 'New Course Created');
            history.push(`/edit-course/${courseDetail._id}`);
            window.location.reload()

        }).catch((err) => {
            NotificationManager.error('Error', 'Cannot connect to the Server!');
        }).finally(() => {
            this.props.toggleLoading();
        })
    }

    render() {
        return (
            <div>
                <div class="bg-light sidenav">
                    <button onClick={() => {
                        var isFilter = this.state.isFilter;
                        this.setState({ isFilter: !isFilter });

                    }} class="filter btn btn-lg text-center w-100 mr-1 text-white hide">
                        <i class="fa fa-sort mr-2"></i>
                                Filter
                            </button>
                    {this.state.isFilter ?
                        <div id="sort" class="sort-filter">
                            <div class="card p-2 rounded shadow mt-2">
                                <label class="form-check">
                                    <input checked={this.state.filter === "draft"} value="draft" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                    <span class="form-check-label">
                                        Drafts
                                    </span>
                                </label>
                                <label class="form-check">
                                    <input checked={this.state.filter === "published"} value="published" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                    <span class="form-check-label">
                                        Published
                                    </span>
                                </label>
                                <label class="form-check">
                                    <input checked={this.state.filter === "closed"} value="closed" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                    <span class="form-check-label">
                                        Closed
                                    </span>
                                </label>
                                <label class="form-check">
                                    <input checked={this.state.filter === "clear"} value="clear" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                    <span class="form-check-label">
                                        Clear
                                    </span>
                                </label>
                            </div>
                        </div>
                        : <div></div>}

                </div>
                <div className="main">
                    <div className="container">
                        <div className="mb-5 create-button" onClick={() => { this.onClickCreate() }} ><span>Create </span></div>
                        <ul>
                            {this.state.filterCourses.map((course, index) => {
                                return <li key={course._id} className="topic">
                                    <div className="row">
                                        <div className="col-md-10"><h4 className=" text-truncate text-dark text-topic"><a href={`/edit-course/${course._id}`} className="text-truncate text-dark text-topic">{course.title}</a><span className="badge rounded text-white ml-1 badge-warning">{course.status}</span>
                                        {course.status==="published"?
                                        <span>
                                            <span onClick ={()=>{
                                                 navigator.clipboard.writeText(`http://sarthak-493c6.web.app/view-course/${course._id}`)
                                            }} className="badge ml-3 mr-3 badge-info"><FontAwesomeIcon icon={faCopy} />Admin Link</span>
                                            <span  onClick ={()=>{
                                                 navigator.clipboard.writeText(`http://hiii-15fdf.web.app/result/course/${course._id}`)
                                            }}  className="badge badge-info"><FontAwesomeIcon icon={faCopy} />Student Link</span>
                                        </span>
                                        :<span></span>
                                        }
                                        </h4>
                                        </div>
                                        <div className="float-right col-md-4">
                                            <section onClick={() => { this.functionCall[course.status](index) }} className="btn text-white button-edit">{this.buttonText[course.status]}</section>
                                        </div>
                                        
                                    </div>
                                    <hr className="hr" />
                                    <br />
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
export default Courses;