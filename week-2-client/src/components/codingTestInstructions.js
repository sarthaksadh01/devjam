import React from 'react';
const ReactMarkdown = require('react-markdown')
function CodingTestInstructions(props) {
    return (
        <div style ={{marginTop:"170px"}} className="container">
            <div className="row">
                <div className="col-12">
                    <div className="card rounded shadow p-3">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4 ">
                                    <h4>{props.test.title}</h4>
                                    <p>By Zaio</p>
                                    <h4>Duration: {props.test.isTimed?props.test.testTiming+" Mins":"NA"}</h4>
                                </div>
                                
                                <div className="col-4 ">
                                    
                                </div>
                                


                                <div className="col-3  float-right">
                                    <p className="text-muted float-right">System is compatible for test</p>
                                    <button onClick ={()=>{props.startTest()}} className="mr-5 btn w-100 btn-lg btn-success shadow">Start Test</button>
                                </div>

                            </div>
                            <hr className="hr"/>
                            <div className="row">
                                <div className="col-7">
                                    <div className="row">
                                        <h4>Test Instructions</h4>
                                        </div>
                                        <ReactMarkdown escapeHtml={false} source={props.test.instructions} />

                                    
                                   
                                    <div className="row">
                                    <h4>General Instructions</h4>
                                    <p></p>
                                        
                                    </div>
                                </div>
                                <div className="col-4">
                                    <h4>Help And Support</h4>
                                    <hr/>
                                    <p>Please contact the test administrator at </p>
                                    <p>sarthaksadh01@gmail.com</p>
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