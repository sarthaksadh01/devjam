import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Select from 'react-select';
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike"
import "codemirror/mode/python/python"
import { compileCode, submitCode } from "../data/data";
import ReactLoading from 'react-loading';
const ReactMarkdown = require('react-markdown')


class BackendTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCustomInput: false,
            code: "",
            customInput: "",
            showResult: false,
            showCodeRunResult: false,
            codeRunHeader: "",
            codeRunInput: "",
            codeRunOutput: "",
            isCodeRunning: false,
            showCodeSubmitResult: false,
            selectedLanguage: { value: 'cpp', label: 'C++', mode: "c-like" },
            codeSubmissionResult: []

        }

    }
    componentDidMount() {
        // alert(JSON.stringify(this.props.question))
        this.setState({ code: this.props.submission.code });

    }
    onClickRunCode() {
        if (this.state.isCodeRunning) return;
        this.setState({ isCodeRunning: true, showCodeRunResult: false, showCodeSubmitResult: false })

        compileCode(this.state.selectedLanguage.value, this.state.code, this.state.customInput).then((res) => {
            // alert(JSON.stringify(res))
            var codeRunHeader, codeRunOutput;
            if (res.stderr === '') {
                codeRunHeader = "Compiled Successfully";
                codeRunOutput = res.stdout;

            }
            else {
                codeRunHeader = res.errorType;
                codeRunOutput = res.stderr;

            }

            this.setState({ codeRunHeader, codeRunOutput, showCodeRunResult: true, isCodeRunning: false });




        }).catch((err) => {
            alert(JSON.stringify(err));
        })
    }
    onclickSubmitCode() {
        this.setState({ isCodeRunning: true, showCodeRunResult: false, showCodeSubmitResult: false });
        submitCode(this.state.selectedLanguage.value, this.state.code, this.props.question.testCases).then((data) => {
            // alert(JSON.stringify(data));
            var submission = {
                code: this.state.code,
                result: data
            }
            // this.props.updateSubmission(submission);
            this.setState({ isCodeRunning: false, codeSubmissionResult: data, showCodeSubmitResult: true },()=>{

                this.props.updateSubmission(submission);
            })
        }).catch((err) => {
            alert(JSON.stringify(err))

        })


    }
    languages = [
        { value: 'cpp', label: 'C++', mode: "c-like" },
        { value: 'java', label: 'JAVA', mode: "java" },
        { value: 'javascript', label: 'Javascript', mode: "javascript" },
        { value: 'python', label: 'Python', mode: "python" },
    ]
    render() {

        return (<div>
            <div className="row">
                {this.props.question.imageUrl === "" ? <div></div> :
                    <div className="col-12 text-center">
                        <img style={{ maxHeight: "400px", maxWidth: "500px" }} className="shadow mb-5" src={this.props.question.imageUrl} />
                    </div>
                }
            </div>
            <div className="row">
                <div className="col-12">
                    <h4>Problem Title</h4>
                </div>

                <div className="col-12">
                    <p>{this.props.question.title}</p>
                </div>
                <div className="col-12">
                    <h4>Problem Statement</h4>
                </div>

                <div className="col-12">
                    <ReactMarkdown escapeHtml={false} source={this.props.question.desc} />
                </div>

                <div className="col-12">
                    <h4>Constraints</h4>
                </div>
                <div className="col-12">
                    <p className="ml-3"><ReactMarkdown escapeHtml={false} source={this.props.question.constraints} /></p>

                </div>
                <div className="col-12">
                    <h4>Sample Input</h4>
                </div>
                <div className="col-12">
                    <ReactMarkdown escapeHtml={false} source={this.props.question.sampleInput} />

                </div>
                <div className="col-12">
                    <h4>Sample Output</h4>
                </div>
                <div className="col-12">
                    <ReactMarkdown escapeHtml={false} source={this.props.question.sampleOutput} />

                </div>
            </div>
            <div className="row">

                <div className="col-12 mb-5 mr-5">
                    <div className="card mr-5">
                        <div className="card-header">
                            <div className="row float-right">

                                <div className="col-10 mr-5">
                                    <Select
                                        value={this.state.selectedLanguage}
                                        onChange={(e) => {
                                            this.setState({ selectedLanguage: e })
                                            // props.onFilterChange("questionType", e.value)
                                        }}

                                        options={this.languages}
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">


                            <CodeMirror
                                editorDidMount={(editor) => {
                                    editor.setSize("100%", "500px");
                                }}
                                onBeforeChange={(editor, data, code) => {
                                    this.setState({ code });
                                }}
                                value={this.state.code}
                                // onChange={this.updateCode.bind(this)}
                                options={{
                                    mode: this.state.selectedLanguage.mode,
                                    theme: "material",
                                    lineNumbers: true,
                                    scrollbarStyle: null,
                                    lineWrapping: true
                                }} />

                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                {this.state.isCodeRunning ? <div className="col-12">
                                    <span className="float-right">
                                        <ReactLoading type={"spin"} color={"#5cb85c"} /> 
                                </span>

                            </div>:    <div className="col-12">
                                        <span className="float-left">
                                            <label class="form-check">
                                                <input onChange={(e) => {
                                                    var isCustomInput = !this.state.isCustomInput;
                                                    this.setState({ isCustomInput })

                                                }} checked={this.state.isCustomInput} class="form-check-input" type="checkbox" />
                                                <span class="form-check-label">
                                                    Custom Input
                                    </span>
                                            </label>
                                        </span>
                                        <span className="float-right mr-5">
                                            <div class="btn-group" role="group" aria-label="Basic example">
                                                <button onClick={() => {
                                                    this.onClickRunCode();
                                                }} type="button" class="btn btn-lg btn-light shadow">Run Code</button>
                                                <button onClick={() => { this.onclickSubmitCode() }} type="button" class="btn btn-lg btn-success">Submit</button>

                                            </div>
                                        </span>

                                    </div>}
                                {this.state.isCustomInput ?
                                        <div className="col-4">
                                            <textarea value={this.state.customInput} onChange={(e) => {
                                                this.setState({ customInput: e.target.value })
                                            }} rows={4} className="form-control"></textarea>
                                        </div> : <div></div>}
                                </div>
                        </div>

                        </div>


                    </div>
                </div>
                <div className="row">

                    {this.state.isCodeRunning === false && this.state.showCodeSubmitResult ?

                        <div className="col-12 mr-5">
                            <div className="card mr-5">
                                <div className="card-header">
                                    Code Submit Result
                      </div>
                                <div className="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th scope="col">Test Case</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.codeSubmissionResult.map((result, index) => {
                                                var string = `${result.stdout} - ${this.props.question.testCases[index].output}`;
                                                

                                                var status;
                                                var points = 0;
                                                if (result.stderr === '') {
                                                    if (result.stdout.trim() === this.props.question.testCases[index].output.trim()) {
                                                        status = <i className="fa fa-check text-success"></i>;
                                                        points = this.props.question.testCases[index].points

                                                    }
                                                    else {
                                                        status = <i className="fa fa-times text-danger"></i>;


                                                    }
                                                }
                                                else {
                                                    status = <span className="text-danger">{result.errorType} error</span>

                                                }
                                                return <tr>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>Test Case {index + 1}</td>
                                                    <td>{status}</td>
                                                    <td>{points}</td>
                                                </tr>
                                            })}


                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div> :
                        <div></div>
                    }
                </div>
                <div className="row">
                    {this.state.isCodeRunning === false && this.state.showCodeRunResult ?
                        <div className="col-12 mt-3 mb-3">
                            <div className="card">
                                <div className="card-header">
                                    {this.state.codeRunHeader}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-6">
                                            <div class="form-group mr-5">
                                                <label for="exampleFormControlTextarea1">Your Input</label>
                                                <textarea disabled value={this.state.customInput} class="w-100 form-control mr-5" id="exampleFormControlTextarea1" rows="2"></textarea>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div class="form-group mr-5">
                                                <label for="exampleFormControlTextarea1">Your Output</label>
                                                <textarea disabled value={this.state.codeRunOutput} class="w-100 form-control mr-5" id="exampleFormControlTextarea1" rows="3"></textarea>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>


                        : <div></div>}
                </div>


            </div >)
    }
}
export default BackendTask;