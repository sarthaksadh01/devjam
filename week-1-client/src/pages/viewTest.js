import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
import TestInstruction from '../components/testInstruction';
import { getTest } from '../data/data';
import TestFinish from '../components/testFinish';
import Mcq from '../components/mcq';
import McqGrid from '../components/mcqGrid'
import Paragraph from '../components/paragraph'
import Countdown from 'react-countdown';
import { NotificationContainer, NotificationManager } from 'react-notifications';
class ViewTest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentIndex: 0,
            isFilter: false,
            progress: 60,
            test: {},
            submission: {},
            isStarted: false,
            isLoading: true,
            message: "closed",
            filter: "",
            filterQues: []

        }
        this.onclickStartTest = this.onclickStartTest.bind(this);
        this.moveQuestion = this.moveQuestion.bind(this);
        this.selectAns = this.selectAns.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
    }
    onFilterChange(e) {
        var query = e.target.value;
        var questions = this.state.test.questions;
        var filterQues = [];
        if (query === "Not Submitted") {
            questions.forEach((ques, index) => {

                if (!this.state.submission.ans[index].isSubmitted) {
                    filterQues.push(index)
                }
            })

        }
        else if (query === "Submitted") {
            questions.forEach((ques, index) => {
                if (this.state.submission.ans[index].isSubmitted) {
                    filterQues.push(index)
                }
            })
        }
        else {
            questions.forEach((ques, index) => {
                filterQues.push(index)
            })

        }
        this.setState({ filter: e.target.value, filterQues })



    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    componentDidMount() {
        getTest(this.props.match.params.id).then((test) => {
            if(test.isShuffle){
                test.questions = this.shuffle(test.questions);

            }
           

            if (test.staus === "closed") {
                this.setState({ test, isLoading: false });
                return;

            }
            var submission = {

                testId: this.props.match.params.id,
                isTimed: test.isTimed,
                testTiming: test.testTiming,
                ans: [],
                isOver: false,
                progress: 0

            }


            test.questions.forEach((question) => {
                if (question.type === "Multiple choice") {
                    submission.ans.push({
                        type: "Multiple choice",
                        ansValue: -1,
                        isSubmitted: false,
                        marksObtained: 0,
                        finalMakrs: 0,
                        feedback: ""
                    });


                }
                else if (question.type === "Multiple choice grid") {
                    var ansValue = [];
                    question.rows.forEach((row) => {
                        ansValue.push(-1);
                    })
                    submission.ans.push({
                        type: "Multiple choice grid",
                        ansValue,
                        isSubmitted: false,
                        marksObtained: 0,
                        finalMakrs: 0,
                        feedback: ""
                    });

                }
                else {
                    submission.ans.push({
                        type: "Paragraph",
                        ansValue: "",
                        isSubmitted: false,
                        marksObtained: 0,
                        finalMakrs: 0,
                        feedback: ""
                    })

                }

            })
            this.setState({ test, submission, isLoading: false }, () => {
                this.onFilterChange({
                    target: {
                        value: "Clear"
                    }
                })
            })

        }).catch((err) => {
            NotificationManager.error("Cannot fetch test details!..")

        }).finally(() => {

        })

    }
    saveProgress() {
        var submission = this.state.submission;
        submission.progress += 1;
        this.setState({ submission }, () => {

        })

    }

    selectAns(ansValue) {
        var submission = this.state.submission;
        var currentIndex = this.state.currentIndex;
        if (this.state.test.questions[currentIndex].type === "Multiple choice") {
            if (this.state.test.questions[currentIndex].isAutoGraded) {
                if (this.state.test.questions[currentIndex].correctOption === (ansValue + 1)) {
                    submission.ans[currentIndex].marksObtained = 1;
                    submission.ans[currentIndex].finalMakrs = 1;
                }
                else {
                    submission.ans[currentIndex].marksObtained = 0;
                    submission.ans[currentIndex].finalMakrs = 0;
                }
            }
            else {
                submission.ans[currentIndex].marksObtained = 1;
                submission.ans[currentIndex].finalMakrs = 1;
            }

        }
        else {
            submission.ans[currentIndex].marksObtained = 1;
            submission.ans[currentIndex].finalMakrs = 1;
        }
        submission.ans[this.state.currentIndex].ansValue = ansValue;
        submission.ans[this.state.currentIndex].isSubmitted = true;

        this.setState({ submission }, () => {


        })

    }
    moveQuestion(direction) {
        var index = this.state.currentIndex
        var questions = this.state.test.questions;
        if (direction == "left") {
            if (index === 0) return;
            this.setState({ currentIndex: index - 1 });

        }
        else {
            if (index === questions.length - 1) return;
            this.setState({ currentIndex: index + 1 })

        }
    }
    onclickStartTest() {
        this.setState({ isStarted: true });

    }
    onTimeEnd(status) {
        var submission = this.state.submission;
        submission["completedOnTime"] = (status === "submit");
        submission["isOver"] = true;
        this.setState({ submission })


    }
    render() {
        if (this.state.isLoading) {
            return null;
        }
        if (this.state.submission.isOver === true) {
            return <TestFinish
                message="Test Completed"
                image="fa fa-check text-success"
            />

        }

        return (
            (
                <div style={{ marginTop: "80px" }}>
                    {this.state.isStarted === false ?
                        <TestInstruction
                            title={this.state.test.title}
                            desc={this.state.test.desc}
                            isTimed={this.state.test.isTimed}
                            testTiming={this.state.test.testTiming}
                            onclickStartTest={this.onclickStartTest}
                        /> : <div></div>}
                    {this.state.test.staus !== "closed" && this.state.submission.isOver === false && this.state.isStarted
                        ?
                        <div className="container mt-5">
                            <div style={{ marginTop: "40px" }} className="row float-right">
                                <div className="col-12 float-right">
                                    <h2 className="text-bold">
                                        {this.state.test.isTimed ?
                                            <Countdown
                                                intervalDelay={60000}
                                                onTick={(d) => { this.saveProgress(d) }}
                                                onComplete={() => { this.onTimeEnd("timeOver") }}
                                                date={Date.now() + (this.state.test.testTiming - this.state.submission.progress) * 60000}
                                                renderer={({ hours, minutes, seconds, completed }) => {
                                                    if (completed) {
                                                        return null;
                                                    } else {
                                                        return <span>{hours}:{minutes}</span>;
                                                    }
                                                }}
                                            />
                                            : <div></div>}
                                        <div onClick={() => { this.onTimeEnd("submit") }} className="btn btn-lg filter text-white rounded-pill ml-5">End Test</div>
                                    </h2>


                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-12">
                                    <ProgressBar className="w-100" now={(this.state.submission.ans.filter((ans) => { return ans.isSubmitted === true }).length / this.state.submission.ans.length) * 100} />
                                </div>
                            </div>

                            <div className="row mt-2 mb-3 float-left">
                                <div className="col-12">
                                    <h5>Question: <span className="text-muted">{this.state.currentIndex + 1}/{this.state.test.questions.length}</span></h5>

                                </div>
                            </div>
                            <div className="row mt-5 text-left">
                                <div className="col-12">
                                    <div className="card-body rounded">
                                        <div className="card-img-top text-center">
                                            {this.state.test.questions[this.state.currentIndex].imageUrl === "" ? <div></div> : <img style={{ maxHeight: "300px" }} src={this.state.test.questions[this.state.currentIndex].imageUrl} />}
                                        </div>
                                        <h3>{this.state.test.questions[this.state.currentIndex].title}</h3>
                                        <hr className="hr" />
                                        {this.state.test.questions[this.state.currentIndex].type === "Multiple choice" ?
                                            <Mcq
                                                disabled={false}
                                                selectAns={this.selectAns}
                                                ansValue={this.state.submission.ans[this.state.currentIndex].ansValue}
                                                options={this.state.test.questions[this.state.currentIndex].options}
                                            /> : <div></div>}
                                        {this.state.test.questions[this.state.currentIndex].type === "Multiple choice grid" ?
                                            <McqGrid
                                                disabled={false}
                                                selectAns={this.selectAns}
                                                ansValue={this.state.submission.ans[this.state.currentIndex].ansValue}
                                                rows={this.state.test.questions[this.state.currentIndex].rows}
                                                columns={this.state.test.questions[this.state.currentIndex].columns}
                                            />
                                            : <div></div>}
                                        {this.state.test.questions[this.state.currentIndex].type === "Paragraph" ?
                                            <Paragraph
                                                disabled={false}
                                                selectAns={this.selectAns}
                                                ansValue={this.state.submission.ans[this.state.currentIndex].ansValue}
                                            />
                                            : <div></div>}

                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3 text-center">
                                <div className="col-12">
                                    {
                                        this.state.currentIndex != 0 ? <i onClick={() => { this.moveQuestion("left") }} style={{ fontSize: 30 }} class="fa mt-1 fa-chevron-left mr-5"></i> : <i></i>
                                    }
                                    {
                                        this.state.currentIndex != (this.state.test.questions.length - 1) ? <i onClick={() => { this.moveQuestion("right") }} style={{ fontSize: 30 }} class="fa mt-1 fa-chevron-right ml-5"></i> : <i></i>
                                    }

                                </div>
                            </div>

                            <div class="my-2 mt-4 mr-1">
                                <i class="fa fa-square late mx-1 displayblock" aria-hidden="true" >Not Submitted</i>

                                <i class="fa fa-square handedin mx-1 displayblock mt-1" aria-hidden="true">Submitted</i>

                            </div>


                            <div className="row mt-5 text-center">
                                <div className="col-3">
                                    <button
                                        onClick={() => {
                                            var isFilter = this.state.isFilter;
                                            this.setState({ isFilter: !isFilter });

                                        }}
                                        class="filter btn btn-lg text-center w-100 mr-1 text-white hide">
                                        <i class="fa fa-sort mr-2"></i>
                                              Filter
                                          </button>
                                    {this.state.isFilter ?
                                        <div id="sort" class="sort-filter mb-3">
                                            <div class="card p-2 rounded shadow mt-2 p-1">
                                                <label class="form-check text-left">
                                                    <input checked={this.state.filter === "Submitted"} value="Submitted" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                                    <span class="form-check-label label2">
                                                        Submitted
                                             </span>
                                                </label>
                                                <label class="form-check text-left">
                                                    <input checked={this.state.filter === "Not Submitted"} value="Not Submitted" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                                    <span class="form-check-label label2">
                                                        Not Submitted
                                             </span>
                                                </label>
                                                <label class="form-check text-left">
                                                    <input checked={this.state.filter === "Clear"} value="Clear" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                                    <span class="form-check-label label2">
                                                        Clear
                                             </span>
                                                </label>
                                            </div>
                                        </div>

                                        : <div></div>
                                    }

                                </div>
                                <div className="col-1"></div>
                                <div className="col-8">
                                    <div className="row">
                                        {this.state.filterQues.map((index1, index2) => {
                                            var color = this.state.submission.ans[index1].isSubmitted ? "btn-success" : "btn-warning"
                                            return <div className="col-1 mb-2 mr-2">
                                                <button onClick={() => {
                                                    var currentIndex = index1;
                                                    this.setState({ currentIndex })
                                                }} className={`btn ${color} text-white text-center  btn-sm mr-5`}>{index1 + 1}</button>
                                            </div>
                                        })}


                                    </div>

                                </div>
                            </div>


                        </div>

                        : <div></div>}
                </div>)
        );
    }
}

export default ViewTest;