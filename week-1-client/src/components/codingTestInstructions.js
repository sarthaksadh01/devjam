import React from 'react';
const ReactMarkdown = require('react-markdown')
function codingQuestions(test) {
    return test.questions.filter((q) => {
        return q.questionType === "coding"
    }).length;
}
function CodingTestInstructions(props) {
    return (
        <div style={{ marginTop: "140px" }} className="container">
            <div className="row">
                <div className="col-12">
                    <div className="card rounded shadow p-3 mb-5">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6 ">
                                    <h2 className="font-weight-bold mb-0">{props.test.title}</h2>
                                    <p className="redText ">By Zaio</p>
                                    <h4>Duration: {props.test.isTimed ? props.test.testTiming + " Mins" : "NA"}</h4>
                                </div>

                                <div className="col-1">

                                </div>



                                <div className="col-3  float-right mr-2">
                                <i class="fa fa-check-circle mr-4" aria-hidden="true" style={{color: "green" , fontSize:"30px"}}></i>
                                    <p className="text-muted float-right mb-4">System is compatible for test</p>
                                    <button onClick={() => { props.startTest() }} className="mr-5 mt-1 btn w-100 btn-lg btn-success shadow">Start Test</button>
                                </div>

                            </div>
                            <hr className="hr" />
                            <div className="row mx-auto">
                                <div className="col-6">
                                    <div className="row">
                                        <h4> Test Instructions</h4>
                                        
                                    </div>
                                    <hr className="mt-2 px-0"/>
                                    <ReactMarkdown escapeHtml={false} source={props.test.instructions} />



                                    <div className="col-12  px-0">
                                    <br />
                                        <h4>General Instructions</h4>
                                        <hr className="mt-2 px-0"/>
                                        <p># Duration of the test is <span className="font-weight-bold ">{props.test.isTimed ? props.test.testTiming : "NA"}</span> Minutes</p>
                                        <p># Test Consist of <span className="font-weight-bold ">{codingQuestions(props.test)}</span> Coding Questions</p>
                                        <p># Test Consist of <span className="font-weight-bold ">{props.test.questions.length - codingQuestions(props.test)}</span> Frontend  Questions</p>

                                    </div>
                                </div>
                                <div className="col-1 "></div>
                                <div className="col-4">
                                    <h4>Help And Support</h4>
                                    <hr />
                                    <p>Please contact the test administrator at </p>
                                    <p><span style={{color :" blue"}}>sarthaksadh01@gmail.com</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CodingTestInstructions;