
import React from 'react';
import { getCodingTest, getSubmissionById } from '../data/data';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import TestFinish from '../components/testFinish';
import Collapse from 'react-bootstrap/Collapse'
class ViewSingleCodingResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            test: null,
            submission: null,


        }
      
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

            width="100%" height="450"></iframe>;

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
        if (submission.isStarted === false) return 0;
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



    componentDidMount() {
        getSubmissionById(this.props.match.params.id).then((submission) => {
            // alert(JSON.stringify(submission))

            getCodingTest(submission.testId).then((test) => {
                this.setState({ test, submission });
            }).catch((err) => {
                alert(JSON.stringify(err))

            })

        }).catch((err) => {
            alert(JSON.stringify(err))
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

        if(this.state.submission===null|| this.state.test===null)return null;

        return (
            <div style={{ marginTop: "80px" }} className="container">
                 <section class="jumbotron text-center">
      <div class=" jumboMargin" >
        <h1 class="text-orange font-weight-bold">Test Result</h1>
        <p class="lead text-orange"> Your Score : {this.calculateFinalMarks(this.state.submission)}/{this.calculateTotalMarks()}</p>
       
      </div>
    </section>
               
                {this.state.submission.isReleased === false ?
                    <TestFinish
                        image="fa fa-times text-danger"
                        message="Access Denied"
                    />
                    :
                    <ol>
                        {this.state.submission.ans.map((ans, index) => {
                            var value = ans;
                            var question = this.state.test.questions[index];


                            return <div>
                                {value.questionType === "coding" ?
                                    <div className="row mt-5">
                                        <div className="col-12">
                                            <div className="card mb-3 shadow">
                                                <div className="card-header blueBack text-white">
                                                    {index + 1}.  {question.title}
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <table class="table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col"></th>
                                                                    <th scope="col">Test Case Passed</th>
                                                                    <th scope="col">Points Awarded</th>
                                                                    <th scope="col">Feedback</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <th scope="row"></th>
                                                                    <td>{this.testCasesPassed(value, question)}/{question.testCases.length}</td>
                                                                    <td>{this.caluclateCodingMarks(value, question)}</td>
                                                                    <td><input disabled={true} value={value.feedBack}
                                                                        className="w-75 form-control" /></td>
                                                                </tr>

                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>
                                                <div className="card-footer"><button
                                                    onClick={() => { this.setState({ isOpen: !this.state.isOpen }) }}
                                                    aria-controls="example-collapse-text"
                                                    aria-expanded={this.state.isOpen} className="btn btn-outline-info mb-3"><FontAwesomeIcon icon={faEllipsisH} /></button>
                                                    <Collapse in={this.state.isOpen}>
                                                        <div className="row">
                                                            <table class="table">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col"></th>
                                                                        <th scope="col">Test Case</th>
                                                                        <th scope="col">Status</th>
                                                                        <th scope="col">Points Awarded</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {value.submission.result.map((result, index) => {
                                                                        var output = result.stderr === "" ? result.stdout : result.errorType + " error";
                                                                        var status = "";
                                                                        if (result.stderr === "" && result.stdout === question.testCases[index].output) status = <i className="fa fa-check text-success"></i>;
                                                                        else status = <i className="fa fa-times text-danger"></i>;
                                                                        var marks = 0;
                                                                        if (result.stderr === "" && result.stdout === question.testCases[index].output) marks = question.testCases[index].points



                                                                        return <tr>
                                                                            <th scope="row"></th>
                                                                            <td>Test Case  {index + 1}</td>
                                                                            <td>{status}</td>
                                                                            <td>{marks}/{question.testCases[index].points}</td>
                                                                        </tr>
                                                                    })}


                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </Collapse>

                                                </div>


                                            </div>
                                        </div>
                                    </div> : <div className="row mt-5">

                                        <div className="col-12">
                                            <div className="card mb-3 shadow">
                                                <div className="card-header  blueBack text-white">
                                                    {index + 1}.  {question.title}
                                                </div>
                                                <div class="card-body">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <img className="img-fluid" style={{ maxHeight: "400px" }} src={this.state.test.questions[index].imageUrl} />

                                                        </div>
                                                        <div className="col-6">
                                                            {/* <iframe className="img-fluid" title="result"  ref={index} /> */}
                                                            {this.runCode(value.submission.html, value.submission.css, value.submission.js, index)}

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <div className="row">

                                                        <div className="col-6">
                                                            <input disabled value={value.feedBack} className="form-control" placeholder="No Feedback" />
                                                        </div>
                                                        <div className="col-2">
                                                            <input disabled={true}
                                                                value={value.finalMarks} type="number" className="form-control  mr-0 pr-0" placeholder="Marks" style={{width:"50%", float:"right"}}/>
                                                        </div>
                                                        <div className="col-1 blueText font-weight-bold mt-1 pl-0 ml-0" style={{fontSize:"20px"}}>/{question.points}</div>
                                                    </div>

                                                </div>



                                            </div>

                                        </div>
                                    </div>
                                }

                            </div>



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