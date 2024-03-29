/* 

This file is used to edit a coding challenge.

*/

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faImage, faCopy, faPlusSquare, faTrash, faCross, faTimes, faLeaf, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import AddCodingQuestion from '../components/addCodingQuestion';
import QuestionBank from '../components/questionBank';
import history from '../components/history';
import { getCodingTest, createCodingQuestion, getAllCodingQuestions, updateCodingTest } from '../data/data';
import { NotificationManager } from 'react-notifications';
import AddFreeStyleQuestion from '../components/addFreeStyleQuestion';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { reactLocalStorage } from '../../../week-2-client/node_modules/reactjs-localstorage/react-localstorage';

class EditCodingTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: {
                title: "New Coding Test",
                instructions: "lol",
                questions: []

            },
            filters: {
                difficulty: "all",
                questionType: "all",
            },

            questions: [],
            filterQuestions: []

        }
        this.saveQuestion = this.saveQuestion.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onSearchQuestion = this.onSearchQuestion.bind(this);
        this.addRemoveQuestion = this.addRemoveQuestion.bind(this)
    }
    componentDidMount() {
        this.props.toggleLoading();
        getCodingTest(this.props.match.params.id).then((test) => {
            getAllCodingQuestions().then((questions) => {
                this.setState({ test, questions }, () => {
                    this.onFilterChange("difficulty", "all");

                });

            })


        }).catch((err) => {
            NotificationManager.error("Error connecting to server..!");
        }).finally(() => {
            this.props.toggleLoading();

        })

    }
    buttonText = {
        draft: "Publish",
        published: "Close",
        closed: "View Result"
    }
    functionCall = {
        draft: () => {
            this.props.toggleLoading();
            updateCodingTest(this.state.test).then((doc) => {
                NotificationManager.info("Test Updated")
                history.push(`/publish-coding-test/${this.state.test._id}`)
                window.location.reload();


            }).catch((err) => {
                NotificationManager.error("Error connecting to the server!..")

            }).finally(() => {
                this.props.toggleLoading();

            })

        },
        published: () => {
            if (window.confirm("Are you sure you want to close the test?")) {

                this.props.toggleLoading("loading....");
                var test = this.state.test;
                test.status = "closed";


                updateCodingTest(test).then(() => {
                    NotificationManager.success("Test Closed");
                    this.setState({ test })

                }).catch((err) => {
                    NotificationManager.error("Cannot connect to the Server!");

                }).finally(() => {
                    this.props.toggleLoading();

                })

            }

        },
        closed: () => {
            history.push(`/view-coding-results/${this.state.test._id}`);
            window.location.reload()


        }
    }

    saveQuestion(question) {
        this.props.toggleLoading();
        createCodingQuestion(question).then((question) => {
            NotificationManager.success("Question added to question bank!");
            var questions = this.state.questions;
            questions.push(question);
            this.setState({ questions }, () => {

            });

        }).catch((err) => {
            NotificationManager.error("Error connecting to server..!");

        }).finally(() => {
            this.props.toggleLoading();
        })

    }

    onFilterChange(type, value) {
        var filters = this.state.filters;
        filters[type] = value;
        var filterQuestions = [];
        var questions = [...this.state.questions];
        questions.forEach((question, index) => {
            if (filters.difficulty === "all" && filters.questionType === "all") {
                filterQuestions.push(index);
            }
            else if (filters.difficulty === "all" && filters.questionType !== "all") {
                if (question.questionType === filters.questionType) {
                    filterQuestions.push(index);
                }
            }
            else if (filters.difficulty !== "all" && filters.questionType === "all") {
                if (question.difficulty === filters.difficulty) {
                    filterQuestions.push(index);
                }
            }
            else {
                if (question.difficulty === filters.difficulty && question.questionType === filters.questionType) {
                    filterQuestions.push(index);
                }

            }

        })
        this.setState({ filterQuestions });
    }
    onSearchQuestion(query) {
        var filters = this.state.filters;
        var filterQuestions = [];
        var questions = [...this.state.questions];
        questions.forEach((question, index) => {
            if (filters.difficulty === "all" && filters.questionType === "all") {
                filterQuestions.push(index);
            }
            else if (filters.difficulty === "all" && filters.questionType !== "all") {
                if (question.questionType === filters.questionType) {
                    filterQuestions.push(index);
                }
            }
            else if (filters.difficulty !== "all" && filters.questionType === "all") {
                if (question.difficulty === filters.difficulty) {
                    filterQuestions.push(index);
                }
            }
            else {
                if (question.difficulty === filters.difficulty && question.questionType === filters.questionType) {
                    filterQuestions.push(index);
                }

            }

        })
        var temp = filterQuestions.filter((index) => {
            return this.state.questions[index].title.toLowerCase().includes(query);
        })
        this.setState({ filterQuestions: temp });

    }

    addRemoveQuestion(i) {
        var test = this.state.test;
        var isSelected = -1;
        test.questions.forEach((question, index) => {
            if (question._id === this.state.questions[i]._id) {
                isSelected = index;

            }

        });
        if (isSelected !== -1) {
            test.questions.splice(isSelected, 1);
        }
        else {
            test.questions.push(this.state.questions[i]);
        }
        this.setState({ test }, () => {

        })

    }
    handleJoyrideCallback = data => {
        const { action, index, status, type } = data;


        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {

            reactLocalStorage.set("tour-2", "yes");
            this.setState({ run: false });
        }
    };

    render() {
        const mdParser = new MarkdownIt();
        return (
            <div style={{ marginTop: "100px" }}>
                  
                {reactLocalStorage.get("tour-2", "no", true) === "no" ? <Joyride
                    callback={this.handleJoyrideCallback}

                    steps={[
                        {
                            target: '.prevent-opening',
                            content: 'Click this to prevent students from opening other tabs',
                        },
                        {
                            target: '.copy-paste',
                            content: 'Click this to prevent students from pasting code in the code editor',
                        },
                        {
                            target: '.timed-event',
                            content: 'Click this to make the test of certain time',
                        },
                        {
                            target: '#question-bank',
                            content: 'Select previously saved questions',
                        },
                        {
                            target: '.add-new-coding-question',
                            content: 'Add a new coding question',
                        },
                        {
                            target: '.add-new-frontend-question',
                            content: 'Add a new Frontend question',
                        },
                        // coding-test-status
                    ]}

                /> : <div></div>}


                <div className="container ">
                <button className="btn btn-warning">All Challenges</button>
                    <div style={{ marginTop: "50px" }} className="row">
                        <div className="col-md-7">
                            <div className="col-md-10 mb-3"><h4 className=" text-truncate text-topic font-weight-bold">{this.state.test.title}</h4></div>
                            <hr className="hr" />
                            <br />
                        </div>

                        <div className="col-md-4">

                            <div class="btn-group float-right" role="group" aria-label="Basic example">
                                <button onClick={() => {
                                    this.props.toggleLoading();
                                    updateCodingTest(this.state.test).then((doc) => {
                                        NotificationManager.info("Test Updated")


                                    }).catch((err) => {
                                        NotificationManager.error("Error connecting to the server!..")

                                    }).finally(() => {
                                        this.props.toggleLoading();

                                    })

                                }} type="button" class="btn btn-outline-info">Save</button>
                                <button onClick={() => {
                                    history.push(`/view-coding-test/${this.state.test._id}`)
                                    window.location.reload();
                                }} type="button" class="btn btn-outline-info">Preview</button>
                                <button
                                    onClick={() => {
                                        this.functionCall[this.state.test.status]();
                                    }}

                                    type="button" class="btn btn-outline-info">{this.buttonText[this.state.test.status]}</button>

                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-12">
                            {/* <form className="w-100"> */}
                            <div class="form-group w-100 col-6 pl-0">
                                <label for="exampleFormControlTextarea1">Test Title</label>
                                <input onChange={(e) => {
                                    var test = this.state.test;
                                    test.title = e.target.value;
                                    this.setState({ test });
                                }} value={this.state.test.title} type="text" class="form-control w-100" id="exampleFormControlInput1" placeholder="" />

                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Test Instructions</label>
                                <MdEditor
                                    value={this.state.test.instructions}
                                    style={{ height: "350px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={({ html, text }) => {
                                        var test = this.state.test;
                                        test.instructions = text;
                                        this.setState({ test });



                                    }}
                                />
                            </div>
                            {/* </form> */}
                        </div>
                    </div>
                    <br />
                    <div className="row  ml-2 mt-1 ">
                        <div className="col-3 prevent-opening">
                            <label class="form-check">
                                <input onChange={(e) => {
                                    var test = this.state.test;
                                    test.isTabsPrevented = !this.state.test.isTabsPrevented;
                                    this.setState({ test })
                                }} checked={this.state.test.isTabsPrevented} class="form-check-input" type="checkbox" />
                                <span class="form-check-label">
                                    Prevent opening other tabs
                             </span>
                            </label>
                        </div>
                        <div className="col-3 copy-paste">
                            <label class="form-check">
                                <input onChange={(e) => {
                                    var test = this.state.test;
                                    test.isCopyPasteBlocked = !this.state.test.isCopyPasteBlocked;
                                    this.setState({ test })
                                }} checked={this.state.test.isCopyPasteBlocked} class="form-check-input" type="checkbox" />
                                <span class="form-check-label">
                                    Copy Paste Blocked
                             </span>
                            </label>
                        </div>
                        <div className="col-5 timed-event">
                            <div class="row">
                                <div className="col-4">
                                    <label class="form-check">
                                        <input onChange={(e) => {
                                            var test = this.state.test;
                                            test.isTimed = !this.state.test.isTimed;
                                            this.setState({ test })

                                        }} checked={this.state.test.isTimed} class="form-check-input" type="checkbox" />
                                        <span class="form-check-label">
                                            Timed (In Minutes)
                             </span>
                                    </label>
                                </div>

                                <div className="col-4">
                                    {this.state.test.isTimed ? <span><input onChange={(e) => {
                                        var test = this.state.test;
                                        test.testTiming = e.target.value;
                                        this.setState({ test });
                                    }} value={this.state.test.testTiming} type="number" className="form-control" placeholder="Minutes" style={{ height: "18px" }} /></span> : <span></span>}
                                </div>
                            </div>

                        </div>

                    </div>

                    <br />
                    <br />
                    <div className="row">
                        <div className="col-8">
                            <h4> Selected Questions: {this.state.test.questions.length}</h4>
                            <br />
                        </div>

                    </div>
                    <div className="row">
                        {this.state.test.questions.map((question, index) => {
                            return <div className="col-8 ">
                                <div className="mb-2 card shadow " >
                                    <div className="card-body">
                                        {question.title} <button onClick={() => {
                                            var test = this.state.test;
                                            test.questions.splice(index, 1);
                                            this.setState({ test });
                                        }} className="float-right btn btn-danger"><FontAwesomeIcon icon={faTimes} /></button>
                                    </div>
                                </div>
                            </div>
                        })}

                    </div>
                    <hr />
                    {/* <div className="row"> */}
                    <Tabs defaultActiveKey="qList" id="uncontrolled-tab-example">
                        <Tab id="queston-bank" className="queston-bank" eventKey="qList" title="Question Bank">
                            <QuestionBank
                                addRemoveQuestion={this.addRemoveQuestion}
                                selectedQuestions={this.state.test.questions}
                                filterQuestions={this.state.filterQuestions}
                                questions={this.state.questions}
                                onFilterChange={this.onFilterChange}
                                filters={this.state.filters}
                                onSearchQuestion={this.onSearchQuestion}

                            />

                        </Tab>
                        <Tab className="add-new-coding-question" eventKey="addCodingQ" title="Add coding Question">
                            <AddCodingQuestion
                                saveQuestion={this.saveQuestion}

                            />

                        </Tab>
                        <Tab className="add-new-frontend-question" eventKey="addFrontEndQ" title="Add frontend Question" >
                            <AddFreeStyleQuestion
                                saveQuestion={this.saveQuestion}
                            />

                        </Tab>
                    </Tabs>
                    {/* </div> */}

                </div>

            </div>
        );
    }
}
export default EditCodingTest;
