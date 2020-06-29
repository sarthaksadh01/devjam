import React from 'react';
import { getsubmissionByTestId, getTest, updateTestSubmission, getUsers, releaseResult } from '../data/data';
import Mcq from '../components/mcq';
import McqGrid from '../components/mcqGrid'
import Paragraph from '../components/paragraph'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import TestFinish from '../components/testFinish';
class ViewSingleTestResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            test: {},
            users: [],
            submissions: [],
            currentIndex: 0,
            modifiedUsers: [],
            queryAns: [],
            isSort: false,
            sort: "Clear"

        }
        this.generateModifiedUsers = this.generateModifiedUsers.bind(this)
        this.onSortChange = this.onSortChange.bind(this)
    }

    generateModifiedUsers() {
        var users = this.state.users;
        var requiredUsers = this.state.test.testFor;
        // alert(JSON.stringify(requiredUsers))
        var newUsers = users.filter((user) => {
            for (var i = 0; i < requiredUsers.length; i++) {
                if (requiredUsers[i] === user.email) {
                    return true;
                }


            }
            return false;
        })

        var submissions = this.state.submissions;
        var currentIndex = 0;
        newUsers.forEach((user, index) => {
            user['testSubmission'] = {
                isStarted: false,
                email: user.email,
                isReleased: false,
                testId: this.state.test._id
            };
            submissions.forEach((submission) => {
                if (submission.email === user.email) {
                    user['testSubmission'] = submission;
                }
            })
            if (user.testSubmission._id === this.props.match.params.submissionId) {
                currentIndex = index;
            }
        })

        this.setState({ modifiedUsers: newUsers, currentIndex }, () => {
            this.onSortChange("Clear")
        });
    }

    moveUser(direction) {
        var index = this.state.currentIndex
        var users = this.state.modifiedUsers;
        if (direction == "left") {
            if (index === 0) return;
            this.setState({ currentIndex: index - 1 }, () => {
                this.onSortChange("Clear")
            });

        }
        else {
            if (index === users.length - 1) return;
            this.setState({ currentIndex: index + 1 }, () => {
                this.onSortChange("Clear")
            })

        }
    }
    chnageUser(index) {
        this.setState({ currentIndex: index }, () => {
            this.onSortChange("Clear")
        });


    }
    onClickUpdate(submission) {
        updateTestSubmission(submission).then((docs) => {

        }).catch((err) => {

        })

    }
    calculateMarks(submission) {
        if (submission.isStarted === false) return -1;
        var marks = 0;
        submission.ans.forEach((ans, index) => {
            marks += ans.marksObtained;
        })
        return marks
    }
    calculateFinalMarks(submission) {
        if (submission.isStarted === false) return -1;
        var marks = 0;
        submission.ans.forEach((ans, index) => {
            marks += ans.finalMakrs;
        })
        return marks
    }

    onSortChange(query) {
        var queryAns = [];
        if (this.state.modifiedUsers[this.state.currentIndex].testSubmission.isStarted === false) {
            // alert("lol")
            return;
        }
        var anss = this.state.modifiedUsers[this.state.currentIndex].testSubmission.ans;
        switch (query) {
            case "Right":
                anss.forEach((ans, index) => {
                    if (ans.finalMakrs === 1) queryAns.push(index);
                })
                break;
            case "Wrong":
                anss.forEach((ans, index) => {
                    if (ans.finalMakrs === 0) queryAns.push(index);
                })
                break;
            case "Not Submitted":
                anss.forEach((ans, index) => {
                    if (ans.isSubmitted === false) queryAns.push(index);
                })
                break;
            default:
                anss.forEach((ans, index) => {
                    queryAns.push(index);
                })

        }
        this.setState({ queryAns, sort: query });
    }


    componentDidMount() {
        getTest(this.props.match.params.testId).then((test) => {
            getsubmissionByTestId(this.props.match.params.testId).then((submissions) => {
                getUsers().then((users) => {
                    this.setState({ users, submissions, test }, () => {
                        this.generateModifiedUsers();
                    })

                })
            })
        })

    }


    render() {

        if (this.state.modifiedUsers.length === 0) return <div style={{ marginTop: "80px" }}></div>;
        var message = "";
        if (!this.state.modifiedUsers[this.state.currentIndex].testSubmission.isStarted) message = "Not Submitted"
        else if (this.state.modifiedUsers[this.state.currentIndex].testSubmission.completedOnTime) message = "On Time";
        else message = "Not on Time";
        // if (this.state.modifiedUser[this.state.currentIndex])


        return (
            <div style={{ marginTop: "80px" }} className="container">
                <div class="ml-3 mt-5 ">
                    <div className="row">
                        <div className="col-5">
                            <div class="dropdown ml-4 ">
                                <button class="btn shadow dropdown-toggle  bgWhite" type="button" id="dropdownMenuButton"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img style={{ height: "30px" }} class="rounded-circle float-left" src={this.state.modifiedUsers[this.state.currentIndex].imageUrl} />
                                    <span class="details mx-3 ">{this.state.modifiedUsers[this.state.currentIndex].name}</span>
                                    <span class="badge badge-primary ml-1 text-white float-right ">{this.calculateFinalMarks(this.state.modifiedUsers[this.state.currentIndex].testSubmission)}/{this.state.test.questions.length}</span>
                                    <span class="badge badge-info text-white float-right ">{message}</span>

                                </button>
                                <div class="dropdown-menu mt-1 " aria-labelledby="dropdownMenuButton"
                                    style={{ maxHeight: "200px", overflowY: "auto" }}>
                                    {this.state.modifiedUsers.map((user, index) => {
                                        var msg = "";
                                        if (!user.testSubmission.isStarted) msg = "Not Submitted"
                                        else if (user.testSubmission.completedOnTime) msg = "On Time";
                                        else msg = "Not on Time";

                                        return (<div><a onClick={() => { this.chnageUser(index) }} class="dropdown-item  " href="#">

                                            <img style={{ height: "30px" }} class="rounded-circle" src={user.imageUrl} />
                                            <span class="details mr-2 ml-2">{user.name}</span>
                                            <span class="badge badge-primary ml-1 text-white float-right ">{this.calculateFinalMarks(user.testSubmission)}/{this.state.test.questions.length}</span>
                                            <span class="badge badge-info text-white float-right ">{msg}</span>
                                        </a>
                                            <hr />
                                        </div>)

                                    })}

                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <h3 class="details2 ">
                                {this.state.currentIndex != 0 ? <i onClick={() => { this.moveUser("left") }} class="fa fa-chevron-left mr-2"></i> : <i></i>}
                                {this.state.currentIndex != (this.state.modifiedUsers.length - 1) ? <i onClick={() => { this.moveUser("right") }} class="fa fa-chevron-right"></i> : <i></i>}
                            </h3>
                        </div>
                        <div className="col-2">
                            <label>Auto Graded</label>
                            <h5 class="details2 ">

                                {this.calculateMarks(this.state.modifiedUsers[this.state.currentIndex].testSubmission)}/{this.state.test.questions.length}
                            </h5>
                        </div>
                        <div className="col-2">
                            <label>Final Marks</label>
                            <h5 class="details2 ">

                                {this.calculateFinalMarks(this.state.modifiedUsers[this.state.currentIndex].testSubmission)}/{this.state.test.questions.length}
                            </h5>
                        </div>
                    </div>

                    <div className="row mb-3 mt-3">
                        <div className="col-8">
                            <div className="row">
                                <button style={{ width: "160px" }} onClick={() => {
                                    var isSort = this.state.isSort;
                                    this.setState({ isSort: !isSort });

                                }} class="filter btn btn-lg ml-5  text-white"
                                >
                                    <i class="fa fa-filter mr-2"></i>
                                Filter By
                            </button>
                            </div>
                            <div className="row">
                                {this.state.isSort ?
                                    <div id="sort" class="sort-filter">
                                        <div class="card rounded shadow p-3 mx-5 mt-1">
                                            <label class="form-check">
                                                <input o checked={this.state.sort === "Right"} value="Right" onChange={(e) => { this.onSortChange(e.target.value) }} class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Right
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "Wrong"} value="Wrong" onChange={(e) => { this.onSortChange(e.target.value) }} class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Wrong
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "Not Submitted"} onChange={(e) => { this.onSortChange(e.target.value) }} value="Not Submitted" class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Not Submitted
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "Clear"} onChange={this.onSortChange} value="Clear" class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Clear
                                    </span>
                                            </label>

                                        </div>
                                    </div>
                                    : <div></div>
                                }
                            </div>
                        </div>
                        <div className="col-4 text-right float-right">
                            <div className="row text-right float-right" >
                                {this.state.modifiedUsers[this.state.currentIndex].testSubmission.isReleased ?
                                    <button onClick={() => {
                                        navigator.clipboard.writeText(`http://hiii-15fdf.web.app/result/${this.state.modifiedUsers[this.state.currentIndex].testSubmission._id}`)
                                    }} class="filter btn btn-lg ml-5  text-white text-right float-right mr-4">

                                        <FontAwesomeIcon icon={faCopy} />
                                    </button>

                                    : <button class="filter btn btn-lg ml-5  text-white text-right float-right mr-4"

                                        onClick={() => {
                                            var submissions = [];
                                            submissions.push(this.state.modifiedUsers[this.state.currentIndex].testSubmission);
                                            releaseResult(this.state.test, submissions).then((doc) => {
                                                var modifiedUsers = this.state.modifiedUsers;
                                                modifiedUsers[this.state.currentIndex].testSubmission.isReleased = true;
                                                this.setState({ modifiedUsers });

                                            }).catch((err) => {

                                            }).finally(() => {

                                            })
                                        }}

                                    >

                                        Release
                        </button>

                                }

                            </div>
                        </div>
                    </div>

                </div>
                {this.state.modifiedUsers[this.state.currentIndex].testSubmission.isStarted === false ?
                    <TestFinish
                        image="fa fa-times text-danger"
                        message="Not Submitted"
                    />
                    :


                    <ol>
                        {this.state.queryAns.map((index) => {
                            var value = this.state.modifiedUsers[this.state.currentIndex].testSubmission.ans[index];
                            var icon = "";

                            if (value.isSubmitted) {
                                if (value.finalMakrs == 1) icon = "fa fa-check mr-2 text-success";
                                else icon = "fa fa-times mr-2 text-danger";

                            }


                            return <li>
                                <div className="row mt-2 text-left">
                                    <div className="col-12">
                                        <div className="card-body rounded">
                                            <div className="card-img-top text-center">
                                                {this.state.test.questions[index].imageUrl === "" ? <div></div> : <img style={{ maxHeight: "300px" }} src={this.state.test.questions[index].imageUrl} />}
                                            </div>
                                            <h3><i className={icon}></i>{this.state.test.questions[index].title}</h3>
                                            <hr className="hr" />
                                            {this.state.test.questions[index].type === "Multiple choice" ?
                                                <Mcq
                                                    marksObtained={value.marksObtained}
                                                    isAutoGraded={this.state.test.questions[index].isAutoGraded}
                                                    isSubmitted={value.isSubmitted}
                                                    finalMakrs={value.finalMakrs}
                                                    correctOption={this.state.test.questions[index].correctOption}
                                                    showColor={true}
                                                    disabled={true}
                                                    ansValue={value.ansValue}
                                                    options={this.state.test.questions[index].options}
                                                /> : <div></div>}
                                            {this.state.test.questions[index].type === "Multiple choice grid" ?
                                                <McqGrid
                                                    disabled={true}
                                                    ansValue={value.ansValue}
                                                    rows={this.state.test.questions[index].rows}
                                                    columns={this.state.test.questions[index].columns}
                                                />
                                                : <div></div>}
                                            {this.state.test.questions[index].type === "Paragraph" ?
                                                <Paragraph
                                                    disabled={true}
                                                    ansValue={value.ansValue}
                                                />
                                                : <div></div>}
                                            <hr className="hr" />
                                            <div className="row">
                                                <div className="col-8">
                                                    <label>Feedback</label>
                                                    <input
                                                        value={value.feedBack}
                                                        onChange={(e) => {
                                                            var modifiedUsers = this.state.modifiedUsers;
                                                            var currentIndex = this.state.currentIndex;
                                                            modifiedUsers[currentIndex].testSubmission.ans[index].feedBack = e.target.value;
                                                            this.setState({ modifiedUsers }, () => {
                                                                this.onClickUpdate(modifiedUsers[currentIndex].testSubmission);
                                                            })


                                                        }}

                                                        placeholder="Feedback" className="form-control w-100" />

                                                </div>
                                                <div className="col-4">
                                                    <label>Marks</label>
                                                    <select className="w-100"
                                                        onChange={(e) => {
                                                            var marks = parseInt(e.target.value);
                                                            var modifiedUsers = this.state.modifiedUsers;
                                                            var currentIndex = this.state.currentIndex;
                                                            modifiedUsers[currentIndex].testSubmission.ans[index].finalMakrs = marks;
                                                            this.setState({ modifiedUsers }, () => {
                                                                this.onClickUpdate(modifiedUsers[currentIndex].testSubmission);
                                                            })

                                                        }}
                                                        value={value.finalMakrs}>
                                                        <option value={1}>1</option>
                                                        <option value={0}>0</option>
                                                    </select>

                                                </div>

                                            </div>



                                        </div>

                                    </div>


                                </div>
                            </li>

                        })}
                    </ol>
                }

            </div>
        )
    }
}

export default ViewSingleTestResult;