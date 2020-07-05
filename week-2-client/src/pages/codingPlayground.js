/* 

This file contains the code for implementing coding playground.

*/

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
import "codemirror/mode/dart/dart"
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter.css';
import { compileCode, submitCode } from "../data/data";
import ReactLoading from 'react-loading';
const ReactMarkdown = require('react-markdown')


class CodingPlayground extends React.Component {
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
            selectedLanguage: { value: 'cpp', label: 'C++', mode: "clike" },
            codeSubmissionResult: []

        }

    }
    componentDidMount() {


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

    languages = [
        { value: 'cpp', label: 'C++', mode: "clike" },
        { value: 'java', label: 'JAVA', mode: "dart" },
        { value: 'javascript', label: 'Javascript', mode: "javascript" },
        { value: 'python', label: 'Python', mode: "python" },
    ]
    javaCode = `
    // "static void main" must be defined in a public class.
   // Do not change the default java class name
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`;
    render() {

        return (<div>
        <div className="container" style={{ marginTop: "100px" }}>
           <section class="jumbotron text-center mb-5">
      <div class=" jumboMargin" >
        <h1 class="text-orange font-weight-bold">Coding Playground</h1>
        <p class="lead text-orange"> Test your Code here! An ultimate code palyground with C++, JAVA, Python and Javascript support.</p>
       
      </div>
    </section>

            <div className="row mx-auto ">

                <div className="col-12 mb-5 mr-5">
                    <div className="card mr-5 mx-auto">
                        <div className="card-header">
                            <div className="row float-right">

                                <div className="col-10 mr-5">
                                    <Select
                                        value={this.state.selectedLanguage}
                                        onChange={(e) => {
                                            this.setState({ selectedLanguage: e }, () => {
                                                if (e.value === "java")
                                                    this.setState({ code: this.javaCode })
                                            })
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

                                </div> : <div className="col-12">
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
                                                }} type="button" class="btn btn-lg btn-success shadow">Run Code</button>


                                            </div>
                                        </span>

                                    </div>}
                                {this.state.isCustomInput ?
                                    <div className="col-4 ">
                                        <textarea value={this.state.customInput} onChange={(e) => {
                                            this.setState({ customInput: e.target.value })
                                        }} rows={4} className="form-control"></textarea>
                                    </div> : <div></div>}
                            </div>
                        </div>

                    </div>


                </div>
            </div>

            <div className="row mx-auto mb-5">
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


        </div >
          <footer id="sticky-footer" class="py-4  text-white-50 blueBack ">
          <div class="container text-center">
              <small>Copyright &copy; Cryptx</small>
          </div>
      </footer>
  </div>
        )
    }
}
export default CodingPlayground;
