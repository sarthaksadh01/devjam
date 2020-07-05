import React, { Component } from "react";
import FrontEndChallenge from "../components/frontendChallenge";
import Select from 'react-select';
import BackendTask from "../components/backendChallenge";
import { getCodingTest, getTestSubmission, saveTestSubmission, updateTestSubmission } from "../data/data";
import { NotificationManager } from "react-notifications";
import Countdown from 'react-countdown';
import CodingTestInstructions from "../components/codingTestInstructions";
import TestFinish from '../components/testFinish'
import { reactLocalStorage } from 'reactjs-localstorage';
import $ from 'jquery';
class ViewCodingTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: null,
            currentIndex: 0,
            dropDownOptions: [],
            selectedOption: {},
            submission: {},
            tabSwitchCount:0
            

        }
        this.updateSubmission = this.updateSubmission.bind(this);
        this.startTest = this.startTest.bind(this)
    }

    updateSubmission(ans) {
        var submission = this.state.submission
        submission.ans[this.state.currentIndex].submission = JSON.parse(JSON.stringify(ans));
        submission.ans[this.state.currentIndex].isSubmitted = true;
        if(submission.ans[this.state.currentIndex].questionType!=="coding"){
            submission.ans[this.state.currentIndex].finalMarks = this.state.test.questions[this.state.currentIndex].points;
        }
        this.setState({ submission }, () => {
            updateTestSubmission(this.state.submission).then((doc) => {
                NotificationManager.success("Submission Saved")

            })

        });


    }
    updateProgress() {
        setInterval(() => {
            if (this.state.submission.isStarted && !this.state.submission.isOver) {
                updateTestSubmission(this.state.submission);
            }

        }, 60000)

    }
    startTest() {
        var submission = this.state.submission;
        submission.isStarted = true;
        saveTestSubmission(submission).then((data) => {
            this.setState({ submission: data },()=>{
               
            });
        })
    }

    componentDidMount() {
        this.props.toggleLoading();
        getCodingTest(this.props.match.params.id).then((test) => {
            // alert(JSON.stringify(test))
            var user = reactLocalStorage.getObject('user', {
                email: "",
                imageUrl: "",
                isLoggedin: false,
                isSocialLogin: false

            }, true);
            var email = user.email;
            var submission = {

                testId: this.props.match.params.id,
                isTimed: test.isTimed,
                testTiming: test.testTiming,
                ans: [],
                isOver: false,
                progress: 0,
                isStarted: false,
                email,
                completedOnTime: false

            }

            getTestSubmission(email, this.props.match.params.id).then((submissionSaved) => {
                // alert(JSON.stringify(submissionSaved))
                if (submissionSaved !== null) {
                    submission = submissionSaved;
                }
                else {
                    test.questions.forEach((question, index) => {
                        if (question.questionType === "coding") {
                            submission.ans.push({
                                questionType: question.questionType,
                                marksObtained: 0,
                                finalMarks: 0,
                                isSubmitted: false,
                                submission: {
                                    code: "",
                                    result: []
                                }

                            })


                        }
                        else {
                            submission.ans.push({
                                questionType: question.questionType,
                                marksObtained: 0,
                                finalMarks: 0,
                                isSubmitted: false,
                                submission: {
                                    html: '',
                                    css: '',
                                    js: '',
                                    preview: ''
                                }

                            })

                        }


                    })

                }
                this.setState({ test, submission }, () => {
                    if (this.state.test.isTimed) {
                        this.updateProgress();

                    }
                    if (this.state.test.isTabsPrevented) {
                        this.checkTabsChange();
                    }
                    if(this.state.isCopyPasteBlocked){
                        this.preventCopyPaste();
        
                    }

                });
            })

        }).catch((err) => {
            NotificationManager.error("Error connecting to server..");
        }).finally(() => {
            this.props.toggleLoading();

        })

    }
    onTimeEnd(status) {
        var left = this.state.submission.ans.filter((ans) => {
            return ans.isSubmitted === false;
        })
        if (left.length === 0) status = "submit"
        var submission = this.state.submission;
        submission["completedOnTime"] = (status === "submit");
        submission["isOver"] = true;
        this.setState({ submission }, () => {
            updateTestSubmission(this.state.submission).then((data) => {
                // this.setState({ submission: data });
            }).catch((err) => {
                alert(JSON.stringify(err))
            })
        })

    }

    preventCopyPaste(){
        $('#codeArea').bind('cut copy paste', function (e) {
            e.preventDefault();
        });
    }
    checkTabsChange() {
        setInterval(() => {
            let body = document.querySelector('body');
            let codeArea = document.getElementById('codeArea');

            if (!document.hasFocus()) {
                this.setState({ tabSwitchCount: this.state.tabSwitchCount + 1 }, () => {
                    if (!this.state.submission.isOver) {
                        NotificationManager.error(`Please donot switch tabs else your test will be terminated`);
                        if (this.state.tabSwitchCount >= 5) {
                            this.onTimeEnd("timeOver");
                        }

                    }


                })

            }

        }, 1000)
    }


    render() {
        if (this.state.test === null) return null;
        if (this.state.test.questions.length === 0) return null;

        var user = reactLocalStorage.getObject('user', {
            email: "",
            imageUrl: "",
            isLoggedin: false,
            isSocialLogin: false

        }, true);
        var email = user.email;
        var temp = this.state.test.testFor.filter((user) => {
            return user === email
        })
        if (temp.length === 0 || this.state.test.status === "draft") {
            return <TestFinish
                message="Access Denied"
                image="fa fa-times text-danger"
            />

        }
        if (this.state.test.status === "closed") {
            return <TestFinish
                message="Test Closed"
                image="fa fa-times text-danger"
            />

        }
        if (this.state.submission.isOver) {
            return <TestFinish
                message="Test  Completed"
                image="fa fa-check text-success"
            />
        }
        if (this.state.submission.isStarted === false) return <CodingTestInstructions startTest={this.startTest} test={this.state.test} />

        return (
            <div style={{ overflowX: "hidden" }}>
                <div className="sidenav blueBack">
                    {this.state.test.isTimed ?
                        <Countdown
                            // intervalDelay={60000}
                            onTick={(d) => {

                                var submission = this.state.submission;
                                submission.progress += (1 / 60);
                                this.setState({ submission })
                            }}
                            onComplete={() => { this.onTimeEnd("timeOver") }}
                            date={Date.now() + (this.state.test.testTiming - this.state.submission.progress) * 60000}
                            renderer={({ hours, minutes, seconds, completed }) => {
                                if (completed) {
                                    return null;
                                } else {
                                    return <button className="btn disabled btn-outline-success w-75  font-weight-bold text-white">{hours}:{minutes}:{seconds}</button>;
                                }
                            }}
                        />
                        : <div></div>}

                  
                    <hr className="bgWhite"/>
                    <h5 className="text-white ml-4">Questions</h5>
                    <hr className="bgWhite"/>
                    {this.state.test.questions.map((question, index) => {
                        var color = this.state.submission.ans[index].isSubmitted ? "text-success" : "text-white"
                        return <div>
                            <a onClick={(e) => {
                                e.preventDefault();
                                this.setState({ currentIndex: index });
                            }} className={`${color}  text-truncate`}>{index + 1}. {question.title}</a>

                        </div>
                    })}
                </div>
                <div className="main ">
                    <div className="row float-right ">
                        <div className="col-12 float-right">
                            <button onClick={() => {
                                var left = this.state.submission.ans.filter((ans) => {
                                    return ans.isSubmitted === false;
                                }).length
                                var message = "Are you sure you want to end test";
                                if (left !== 0) {
                                    message = `You have Not submitted ${left} questions are you sure you want to end test?`
                                }
                                if (window.confirm(message)) {
                                    this.onTimeEnd("submit");
                                }


                            }} className="btn btn-lg btn-info">End Test</button>
                        </div>
                    </div>

                    <div className="container">


                        {this.state.test.questions[this.state.currentIndex].questionType === "coding" ?
                            <BackendTask
                                submission={this.state.submission.ans[this.state.currentIndex].submission}
                                updateSubmission={this.updateSubmission}
                                question={this.state.test.questions[this.state.currentIndex]}

                            />
                            : <FrontEndChallenge
                                submission={this.state.submission.ans[this.state.currentIndex].submission}
                                question={this.state.test.questions[this.state.currentIndex]}
                                updateSubmission={this.updateSubmission}

                            />
                        }

                    </div>



                </div>
            </div>

        );
    }

}
export default ViewCodingTest