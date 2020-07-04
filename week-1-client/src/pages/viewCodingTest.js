import React, { Component } from "react";
import FrontEndChallenge from "../components/frontendChallenge";
import Select from 'react-select';
import BackendTask from "../components/backendChallenge";
import { getCodingTest } from "../data/data";
import { NotificationManager } from "react-notifications";
import Countdown from 'react-countdown';
import CodingTestInstructions from "../components/codingTestInstructions";
class ViewCodingTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: null,
            currentIndex: 0,
            dropDownOptions: [],
            selectedOption: {},
            submission: {}

        }
        this.updateSubmission = this.updateSubmission.bind(this);
        this.startTest = this.startTest.bind(this)
    }

    updateSubmission(ans) {
        var submission = this.state.submission
        submission.ans[this.state.currentIndex].submission = JSON.parse(JSON.stringify(ans));
        submission.ans[this.state.currentIndex].isSubmitted = true;
        this.setState({ submission }, () => {
            NotificationManager.success("Submission Saved")
        });
    }
    updateProgress() {

    }
    startTest() {
        var submission = this.state.submission;
        submission.isStarted = true;
        this.setState({ submission })
    }

    componentDidMount() {
        this.props.toggleLoading();
        getCodingTest(this.props.match.params.id).then((test) => {
            var submission = {

                testId: this.props.match.params.id,
                isTimed: test.isTimed,
                testTiming: test.testTiming,
                ans: [],
                isOver: false,
                progress: 0,
                isStarted: false

            }
            var dropDownOptions = [];
            test.questions.forEach((question, index) => {
                if (question.questionType === "coding") {
                    submission.ans.push({
                        questionType: question.questionType,
                        marksObtained: 0,
                        finalMarks: 0,
                        isSubmitted: false,
                        submission: {}

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

                dropDownOptions.push({
                    value: index,
                    label: question.title
                })

            })
            var selectedOption = dropDownOptions[0];
            this.setState({ test, dropDownOptions, selectedOption, submission });
        }).catch((err) => {
            NotificationManager.error("Error connecting to server..");
        }).finally(() => {
            this.props.toggleLoading();

        })

    }
    render() {
        if (this.state.test === null) return null;
        if (this.state.submission.isStarted === false) return <CodingTestInstructions startTest = {this.startTest} test={this.state.test} />
        return (
            <div style={{ overflowX: "hidden" }}>
                <div className="sidenav bg-dark">
                    {this.state.test.isTimed ?
                        <Countdown
                            // intervalDelay={60000}
                            onTick={(d) => {
                                var submission = this.state.submission;
                                submission.progress += (1 / 60);
                                this.setState({ submission })
                            }}
                            // onComplete={() => { this.onTimeEnd("timeOver") }}
                            date={Date.now() + (this.state.test.testTiming - this.state.submission.progress) * 60000}
                            renderer={({ hours, minutes, seconds, completed }) => {
                                if (completed) {
                                    return null;
                                } else {
                                    return <button className="btn btn-outline-info w-75 text-white disabled ml-2">{hours}:{minutes}:{seconds}</button>;
                                }
                            }}
                        />
                        : <div></div>}

                    <hr />
                    <h5 className="text-white ml-4">Questions</h5>
                    <hr />
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
                <div className="main">
                    <div className="row float-right">
                        <div className="col-12 float-right">
                            <button className="btn btn-lg btn-info">End Test</button>
                        </div>
                    </div>

                    <div className="container">


                        {this.state.test.questions[this.state.currentIndex].questionType === "coding" ?
                            <BackendTask
                                updateSubmission={this.updateSubmission}
                                question={this.state.test.questions[this.state.currentIndex]}

                            />
                            : <FrontEndChallenge
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