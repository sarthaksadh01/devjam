import React from 'react';
import { getsubmissionByTestId, getTest, updateTestSubmission, getUsers, releaseResult, getTestSubmission } from '../data/data';
import Mcq from '../components/mcq';
import McqGrid from '../components/mcqGrid'
import Paragraph from '../components/paragraph'
import { getSubmissionById } from '../data/data';
class Result extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            test: null,
            submission: null,

        }
    }





    componentDidMount() {
        getSubmissionById(this.props.match.params.id).then((submission) => {

            getTest(submission.testId).then((test) => {
                this.setState({ test, submission });
            }).catch((err) => {
                alert(JSON.stringify(err))

            })

        }).catch((err) => {
            alert(JSON.stringify(err))
        })


    }

    calculateMarks(submission) {
        if (submission.isStarted === false) return -1;
        var marks = 0;
        submission.ans.forEach((ans, index) => {
            marks += ans.finalMakrs;
        })
        return marks
    }

    render() {
        if (this.state.test === null || this.state.submission === null) return null;


        return (
            <div style={{ marginTop: "80px" }} className="container">
                <h3 className="ml-5 mb-3">{this.state.test.title} <span className="badge badge-info ml-3">Result</span></h3>
                <h3 className="ml-5 mb-3">Marks: {this.calculateMarks(this.state.submission)}/{this.state.test.questions.length}</h3>

                <ol>
                    {this.state.submission.ans.map((value, index) => {

                        var icon = "";

                        if (value.isSubmitted) {
                            if (value.finalMakrs === 1) icon = "fa fa-check mr-2 text-success";
                            else icon = "fa fa-times mr-2 text-danger";


                        }

                        return <li>
                            <div className="row mt-2 text-left">
                                <div className="col-12">
                                    <div className="card-body rounded">
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

                                            {value.feedBack.trim() === "" ? <div></div>

                                                : <div className="col-12">
                                                    <label>feedback</label>
                                                    <input value={value.feedBack} disabled={true} className="form-control w-100" />
                                                </div>
                                            }



                                        </div>



                                    </div>

                                </div>


                            </div>
                        </li>

                    })}
                </ol>

            </div>
        )
    }
}

export default Result;