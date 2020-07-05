
import React from 'react';
import { getsubmissionByTestId, getTest, updateTestSubmission, getUsers, releaseCodingResult, getCodingTest } from '../data/data';
import Mcq from '../components/mcq';
import McqGrid from '../components/mcqGrid'
import Paragraph from '../components/paragraph'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import TestFinish from '../components/testFinish';
import Collapse from 'react-bootstrap/Collapse'
import { NotificationManager } from 'react-notifications';
import history from '../components/history';
class ViewSingleCodingResult extends React.Component {
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
    runCode = (html, css, js, ref) => {
        const documentContents = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Document</title>
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${html}

          <script type="text/javascript">
            ${js}
          </script>
        </body>
        </html>
      `;
        const iframe = <iframe
            srcDoc={documentContents}

            width="540" height="450"></iframe>;

        return iframe;

    };
    calculateMarks(submission) {
        if (submission.isStarted === false) return -1;
        var marks = 0;
        submission.ans.forEach((ans, index) => {
            if (!ans.isSubmitted) return;
            if (ans.questionType === "coding") {
                ans.submission.result.forEach((output, index2) => {
                    if (output.stderr === '') {
                        if (output.stdout === this.state.test.questions[index].testCases[index2].output)
                            marks += parseInt(this.state.test.questions[index].testCases[index2].points);
                    }
                })

            }
            else {
                marks += parseInt(this.state.test.questions[index].points);
            }
        })
        return marks
    }
    calculateFinalMarks(submission) {
        if (submission.isStarted === false) return -1;
        var marks = 0;
        submission.ans.forEach((ans, index) => {
            if (!ans.isSubmitted) return;
            if (ans.questionType === "coding") {
                ans.submission.result.forEach((output, index2) => {
                    if (output.stderr === '') {
                        if (output.stdout === this.state.test.questions[index].testCases[index2].output)
                            marks += parseInt(this.state.test.questions[index].testCases[index2].points);
                    }
                })

            }
            else {
                marks += parseInt(ans.finalMarks);
            }
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
        getCodingTest(this.props.match.params.testId).then((test) => {
            getsubmissionByTestId(this.props.match.params.testId).then((submissions) => {
                getUsers().then((users) => {
                    this.setState({ users, submissions, test }, () => {
                        this.generateModifiedUsers();
                    })

                })
            })
        })

    }

    caluclateCodingMarks(ans, question) {
        var marks = 0;
        ans.submission.result.forEach((output, index) => {
            if (output.stderr === '') {
                if (output.stdout === question.testCases[index].output)
                    marks += parseInt(question.testCases[index].points);
            }
        })
        return marks;


    }
    testCasesPassed(ans, question) {
        var marks = 0;
        ans.submission.result.forEach((output, index) => {
            if (output.stderr === '') {
                if (output.stdout === question.testCases[index].output)
                    marks++;
            }
        })
        return marks;
    }

    calculateTotalMarks() {
        var marks = 0;
        this.state.test.questions.forEach((question) => {
            if (question.questionType === "coding") {
                question.testCases.forEach((testCase) => {
                    marks += parseInt(testCase.points);
                })

            }
            else {
                marks += parseInt(question.points);
            }

        })
        return marks;
    }


    render() {

        if (this.state.modifiedUsers.length === 0) return <div style={{ marginTop: "80px" }}></div>;
        var message = "";
        if (!this.state.modifiedUsers[this.state.currentIndex].testSubmission.isStarted) message = "Not Submitted"
        else if (this.state.modifiedUsers[this.state.currentIndex].testSubmission.completedOnTime) message = "On Time";
        else message = "Not on Time";
        // if (this.state.modifiedUser[this.state.currentIndex])


        return (
            <div style={{ marginTop: "120px" }} className="container">
                <div class="ml-3 mt-5 mb-4">
                    <div className="row">
                        <div className="col-4">
                            <div class="dropdown ml-1 ">
                                <button class="btn  shadow dropdown-toggle  bgWhite" type="button" id="dropdownMenuButton"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ width: "350px" }}>
                                    <img style={{ height: "30px" }} class="rounded-circle float-left" src={this.state.modifiedUsers[this.state.currentIndex].imageUrl} />
                                    <span class="blueText mx-3 ">{this.state.modifiedUsers[this.state.currentIndex].name}</span>
                                    <span class="badge badge-primary ml-1 text-white float-right mt-2">{this.calculateFinalMarks(this.state.modifiedUsers[this.state.currentIndex].testSubmission)}/{this.calculateTotalMarks()}</span>
                                    <span class="badge badge-info text-white float-right mt-2">{message}</span>

                                </button>
                                <div class="dropdown-menu mt-1 " aria-labelledby="dropdownMenuButton"
                                    style={{ maxHeight: "200px", overflowY: "auto" }}>
                                    {this.state.modifiedUsers.map((user, index) => {
                                        var msg = "";
                                        if (!user.testSubmission.isStarted) msg = "Not Submitted"
                                        else if (user.testSubmission.completedOnTime) msg = "On Time";
                                        else msg = "Not on Time";

                                        return (<div><a onClick={() => { this.chnageUser(index) }} class="dropdown-item  " href="#" style={{ width: "330px" }}>

                                            <img style={{ height: "30px" }} class="rounded-circle" src={user.imageUrl} />
                                            <span class="blueText mr-2 ml-2">{user.name}</span>
                                            <span class="badge badge-primary ml-1 text-white float-right mt-2">{this.calculateFinalMarks(user.testSubmission)}/{this.calculateTotalMarks()}</span>
                                            <span class="badge badge-info text-white float-right mt-2">{msg}</span>
                                        </a>
                                            <hr />
                                        </div>)

                                    })}

                                </div>
                            </div>
                        </div>
                        <div className="col-1">
                            <h3 class="blueText ">
                                {this.state.currentIndex != 0 ? <i onClick={() => { this.moveUser("left") }} class="fa fa-chevron-left mr-2"></i> : <i></i>}
                                {this.state.currentIndex != (this.state.modifiedUsers.length - 1) ? <i onClick={() => { this.moveUser("right") }} class="fa fa-chevron-right"></i> : <i></i>}
                            </h3>
                        </div>
                        <div className="col-1">
                            <label>Auto Graded</label>
                            <h5 class="blueLight ">

                                {this.calculateMarks(this.state.modifiedUsers[this.state.currentIndex].testSubmission)}/{this.calculateTotalMarks()}
                            </h5>
                        </div>
                        <div className="col-1">
                            <label>Final Marks</label>
                            <h5 class="blueLight ">

                                {this.calculateFinalMarks(this.state.modifiedUsers[this.state.currentIndex].testSubmission)}/{this.calculateTotalMarks()}
                            </h5>
                        </div>
                        <div className="col-2">
                            <button
                                onClick={() => { this.setState({ isOpen: !this.state.isOpen }) }}
                                aria-controls="example-collapse-text"
                                aria-expanded={this.state.isOpen} className="btn blueBack text-white btn-lg mb-3 ml-2 mr-3 float-right"> Detailed View</button>
                        </div>
                        <div className="col-1 ">
                            {this.state.modifiedUsers[this.state.currentIndex].testSubmission.isReleased ?
                                <button onClick={() => {
                                    navigator.clipboard.writeText(`http://hiii-15fdf.web.app/coding-test-result/${this.state.modifiedUsers[this.state.currentIndex].testSubmission._id}`)
                                    NotificationManager.info("link copied");
                                }} class="btn-success btn btn-lg ml-5  text-white text-right float-right mr-4">

                                    <FontAwesomeIcon icon={faCopy} />
                                </button>

                                : <button class="btn-success btn btn-lg ml-5  text-white text-right float-right mr-4"

                                    onClick={() => {
                                        var submissions = [];
                                        submissions.push(this.state.modifiedUsers[this.state.currentIndex].testSubmission);
                                        releaseCodingResult(this.state.test, submissions).then((doc) => {
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
                {this.state.modifiedUsers[this.state.currentIndex].testSubmission.isStarted === false ?
                    <TestFinish
                        image="fa fa-times text-danger"
                        message="Not Submitted"
                    />
                    :


                    <ol>
                        {this.state.queryAns.map((index) => {
                            var value = this.state.modifiedUsers[this.state.currentIndex].testSubmission.ans[index];
                            var question = this.state.test.questions[index];
                            var icon = "";

                            if (value.isSubmitted) {
                                if (value.finalMakrs == 1) icon = "fa fa-check mr-2 text-success";
                                else icon = "fa fa-times mr-2 text-danger";

                            }

                            return <div>
                                {value.questionType === "coding" ?
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <div className="card mb-3 shadow">
                                                <div className="card-header redBack textBlue font-weight-bold" >
                                                    {index + 1}. <span className="ml-2" style={{ fontSize: "20px" }}>{question.title}</span>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <table class="table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col"></th>
                                                                    <th scope="col">Test Case Passed</th>
                                                                    <th scope="col">Points Awarded</th>
                                                                    <th scope="col">Provide Feedback</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <th scope="row"></th>
                                                                    <td>{this.testCasesPassed(value, question)}/{question.testCases.length}</td>
                                                                    <td>{this.caluclateCodingMarks(value, question)}</td>
                                                                    <td><input value={value.feedBack}
                                                                        onChange={(e) => {
                                                                            var modifiedUsers = this.state.modifiedUsers;
                                                                            var currentIndex = this.state.currentIndex;
                                                                            modifiedUsers[currentIndex].testSubmission.ans[index].feedBack = e.target.value;
                                                                            this.setState({ modifiedUsers }, () => {
                                                                                this.onClickUpdate(modifiedUsers[currentIndex].testSubmission);
                                                                            })


                                                                        }} className="w-75 form-control" /></td>
                                                                </tr>

                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <button onClick={() => {
                                                        window.location.href = `http://139.59.91.217/api/code/${this.state.modifiedUsers[this.state.currentIndex].testSubmission._id}/${index}`;
                                                        // history.push()
                                                        // window.location.reload();
                                                    }} className="btn btn-lg blueText font-weight-bold redBack float-left mb-2">
                                                        View Code
                                                            </button>
                                                    <Collapse in={this.state.isOpen}>
                                                        <div className="row">
                                                            <table class="table">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col"></th>
                                                                        <th scope="col">Test Case</th>
                                                                        <th scope="col">Expected Output</th>
                                                                        <th scope="col">Output</th>
                                                                        <th scope="col">Status</th>
                                                                        <th scope="col">Points Awarded</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {value.submission.result.map((result, index) => {
                                                                        var output = result.stderr === "" ? result.stdout : result.errorType + " error";
                                                                        var status = "";
                                                                        if (result.stderr === "" && result.stdout === question.testCases[index].output) status = <i className="fa fa-check text-success"></i>;
                                                                        else status = <i className="fa fa-times text-danger ml-3" style={{ fontSize: "25px" }}></i>;
                                                                        var marks = 0;
                                                                        if (result.stderr === "" && result.stdout === question.testCases[index].output) marks = question.testCases[index].points



                                                                        return <tr>
                                                                            <th scope="row"></th>
                                                                            <td>Test Case  {index + 1}</td>
                                                                            <td><textarea disabled className="text-center blueText mr-2">{question.testCases[index].output}</textarea></td>
                                                                            <td><textarea disabled className="text-center mr-2 blueText">{output}</textarea></td>
                                                                            <td>{status}</td>
                                                                            <td className="pl-5">{marks}/{question.testCases[index].points}</td>
                                                                        </tr>
                                                                    })}


                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </Collapse>

                                                </div>


                                            </div>
                                        </div>
                                    </div> : <div className="row mt-3">

                                        <div className="col-12">
                                            <div className="card mb-3 shadow">
                                                <div className="card-header redBack textBlue font-weight-bold" >
                                                    {index + 1}. <span className="ml-2" style={{ fontSize: "20px" }}>{question.title}</span>
                                                </div>
                                                <div class="card-body">
                                                    <div className="row">
                                                        <div className="col-5">
                                                            <img className="img-fluid" style={{ maxHeight: "400px" }} src={this.state.test.questions[index].imageUrl} />

                                                        </div>
                                                        <div className="col-5">
                                                            {/* <iframe className="img-fluid" title="result"  ref={index} /> */}
                                                            {this.runCode(value.submission.html, value.submission.css, value.submission.js, index)}

                                                        </div>
                                                    </div>
                                                </div>
                                                <div >
                                                    <div className="row mx-auto mb-4">
                                                        <div className="col-6 mr-3">
                                                            <input onChange={(e) => {
                                                                var modifiedUsers = this.state.modifiedUsers;
                                                                var currentIndex = this.state.currentIndex;
                                                                modifiedUsers[currentIndex].testSubmission.ans[index].feedBack = e.target.value;
                                                                this.setState({ modifiedUsers }, () => {
                                                                    this.onClickUpdate(modifiedUsers[currentIndex].testSubmission);
                                                                })


                                                            }} value={value.feedBack} className="form-control" placeholder="Give Feedback" />
                                                        </div>
                                                        <div className="col-1 ">
                                                            <input style={{ width: "50%", float: "right" }} class=" mr-0 pr-0" onChange={(e) => {
                                                                var marks = parseInt(e.target.value);
                                                                if (marks < 0) marks = 0;
                                                                if (marks > question.poitns) marks = question.points
                                                                var modifiedUsers = this.state.modifiedUsers;
                                                                var currentIndex = this.state.currentIndex;
                                                                modifiedUsers[currentIndex].testSubmission.ans[index].finalMarks = marks;
                                                                this.setState({ modifiedUsers }, () => {
                                                                    this.onClickUpdate(modifiedUsers[currentIndex].testSubmission);
                                                                })


                                                            }}
                                                                value={value.finalMarks} type="number" className="form-control" placeholder="Marks" />

                                                        </div>
                                                        <div className="col-1 blueText font-weight-bold mt-2 pl-0 ml-0" style={{ fontSize: "20px" }}>/{question.points}</div>
                                                        <div className="col-2">
                                                            <button onClick={() => {
                                                                window.location.href = `http://139.59.91.217/api/html/${this.state.modifiedUsers[this.state.currentIndex].testSubmission._id}/${index}`;
                                                                // history.push()
                                                                // window.location.reload();
                                                            }} className="btn btn-lg blueText font-weight-bold redBack float-right">
                                                                View Code
                                                            </button>
                                                        </div>


                                                    </div>

                                                </div>



                                            </div>

                                        </div>
                                    </div>
                                }

                            </div>

                            // return <li>
                            //     <div className="row mt-2 text-left">
                            //         <div className="col-12">
                            //             <div className="card-body rounded">
                            //                 <div className="card-img-top text-center">
                            //                     {this.state.test.questions[index].imageUrl === "" ? <div></div> : <img style={{ maxHeight: "300px" }} src={this.state.test.questions[index].imageUrl} />}
                            //                 </div>
                            //                 <h3><i className={icon}></i>{this.state.test.questions[index].title}</h3>
                            //                 <hr className="hr" />
                            //                 {this.state.test.questions[index].type === "Multiple choice" ?
                            //                     <Mcq
                            //                         marksObtained={value.marksObtained}
                            //                         isAutoGraded={this.state.test.questions[index].isAutoGraded}
                            //                         isSubmitted={value.isSubmitted}
                            //                         finalMakrs={value.finalMakrs}
                            //                         correctOption={this.state.test.questions[index].correctOption}
                            //                         showColor={true}
                            //                         disabled={true}
                            //                         ansValue={value.ansValue}
                            //                         options={this.state.test.questions[index].options}
                            //                     /> : <div></div>}
                            //                 {this.state.test.questions[index].type === "Multiple choice grid" ?
                            //                     <McqGrid
                            //                         disabled={true}
                            //                         ansValue={value.ansValue}
                            //                         rows={this.state.test.questions[index].rows}
                            //                         columns={this.state.test.questions[index].columns}
                            //                     />
                            //                     : <div></div>}
                            //                 {this.state.test.questions[index].type === "Paragraph" ?
                            //                     <Paragraph
                            //                         disabled={true}
                            //                         ansValue={value.ansValue}
                            //                     />
                            //                     : <div></div>}
                            //                 <hr className="hr" />
                            //                 <div className="row">
                            //                     <div className="col-8">
                            //                         <label>Feedback</label>
                            //                         <input
                            //                             value={value.feedBack}
                            //                             onChange={(e) => {
                            //                                 var modifiedUsers = this.state.modifiedUsers;
                            //                                 var currentIndex = this.state.currentIndex;
                            //                                 modifiedUsers[currentIndex].testSubmission.ans[index].feedBack = e.target.value;
                            //                                 this.setState({ modifiedUsers }, () => {
                            //                                     this.onClickUpdate(modifiedUsers[currentIndex].testSubmission);
                            //                                 })


                            //                             }}

                            //                             placeholder="Feedback" className="form-control w-100" />
                            //                             <button 
                            //                             onClick={()=>{
                            //                                 var modifiedUsers = this.state.modifiedUsers;
                            //                                 var currentIndex = this.state.currentIndex;
                            //                                 modifiedUsers[currentIndex].testSubmission.ans[index].feedBack = "";
                            //                                 this.setState({ modifiedUsers }, () => {
                            //                                     this.onClickUpdate(modifiedUsers[currentIndex].testSubmission);
                            //                                 })

                            //                             }}

                            //                             className="btn btn-danger mt-2 text-white">Delete</button>

                            //                     </div>
                            //                     <div className="col-4">
                            //                         <label>Marks</label>
                            //                         <select className="w-100"
                            //                             onChange={(e) => {
                            //                                 var marks = parseInt(e.target.value);
                            //                                 var modifiedUsers = this.state.modifiedUsers;
                            //                                 var currentIndex = this.state.currentIndex;
                            //                                 modifiedUsers[currentIndex].testSubmission.ans[index].finalMakrs = marks;
                            //                                 this.setState({ modifiedUsers }, () => {
                            //                                     this.onClickUpdate(modifiedUsers[currentIndex].testSubmission);
                            //                                 })

                            //                             }}
                            //                             value={value.finalMakrs}>
                            //                             <option value={1}>1</option>
                            //                             <option value={0}>0</option>
                            //                         </select>

                            //                     </div>

                            //                 </div>



                            //             </div>

                            //         </div>


                            //     </div>
                            // </li>

                        })}
                    </ol>
                }

            </div>
        )
    }
}

export default ViewSingleCodingResult;
























//     render() {
//         return (
//             <div style={{ marginTop: "80px" }} className="container">



//                 <div className="row">
//                     <div className="col-12">
//                         <div className="card">
//                             <div className="card-header">
//                                 question title
//                             </div>
//                             <div className="card-body">
//                                 <div className="row">
//                                   <div className="col-5 border">
//                                       <img src = "https://img.freepik.com/free-psd/premium-mobile-phone-screen-mockup-template_53876-76478.jpg?size=626&ext=jpg"/>
//                                   </div>
//                                   <div className="col-5 border">
//                                       <img src = "https://img.freepik.com/free-psd/premium-mobile-phone-screen-mockup-template_53876-76478.jpg?size=626&ext=jpg"/>
//                                   </div>

//                                 </div>
//                             </div>
//                             <div className="card-footer"><button 
//                                 onClick={() => {this.setState({isOpen:!this.state.isOpen})}}
//                                 aria-controls="example-collapse-text"
//                                 aria-expanded={this.state.isOpen} className="btn btn-outline-info mb-3">View More</button>
//                                 <Collapse in={this.state.isOpen}>
//                                 <div className="row">
//                                     <table class="table">
//                                         <thead>
//                                             <tr>
//                                                 <th scope="col"></th>
//                                                 <th scope="col">Test Case</th>
//                                                 <th scope="col">Expected Output</th>
//                                                 <th scope="col">Output</th>
//                                                 <th scope="col">Status</th>
//                                                 <th scope="col">Points Awarded</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             <tr>
//                                                 <th scope="row"></th>
//                                                 <td>Mark</td>
//                                                 <td>Otto</td>
//                                                 <td></td>
//                                             </tr>

//                                         </tbody>
//                                     </table>

//                                 </div>
//                                 </Collapse>

//                             </div>


//                         </div>
//                     </div>
//                 </div>

//             </div>

//         );
//     }

// }
// export default ViewSingleCodingResult;