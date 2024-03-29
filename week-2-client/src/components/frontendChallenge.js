import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
const ReactMarkdown = require('react-markdown')

class FrontEndChallenge extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            html: "",
            css: "",
            js: ""
        };

    }

    componentDidMount() {
        const {html,css,js} = this.props.submission;
        // alert(JSON.stringify(this.props.submission))
        this.setState({html,css,js},()=>{
            this.runCode();
        })
    }

  



    runCode = () => {
        const { html, css, js } = this.state;

        const iframe = this.refs.iframe;
        const document = iframe.contentDocument;
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

        document.open();
        document.write(documentContents);
        document.close();
    };

    componentDidUpdate() {
        this.runCode();
      }

    render() {
        const { html, js, css } = this.state;
        const codeMirrorOptions = {
            theme: "material",
            // lineNumbers: true,
            scrollbarStyle: null,
            lineWrapping: true
        };

        return (

            <div>
                {/* <div className="container"> */}
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
                </div>

                <div className="row" >
                    <div className="col-12">
                        <button onClick={() => {
                            this.props.updateSubmission({
                                html: this.state.html,
                                css: this.state.css,
                                js: this.state.js
                            })
                        }} className="btn btn-lg float-right mr-5 btn-success shadow">Submit</button>
                    </div>
                </div>



                <div className="w-100 row">
                    <div style={{ height: "50%" }} className="col-12 mr-5">
                        <Tabs defaultActiveKey="html" id="uncontrolled-tab-example">
                            <Tab eventKey="html" title="Html">

                                <CodeMirror
                                    value={html}
                                    options={{
                                        mode: "htmlmixed",
                                        ...codeMirrorOptions
                                    }}
                                    onBeforeChange={(editor, data, html) => {
                                        this.setState({ html });
                                    }}
                                />


                            </Tab>
                            <Tab eventKey="css" title="Css">

                                <CodeMirror
                                    value={css}
                                    options={{
                                        mode: "css",
                                        ...codeMirrorOptions
                                    }}
                                    onBeforeChange={(editor, data, css) => {
                                        this.setState({ css });
                                    }}
                                />

                            </Tab>
                            {this.props.question.enableJavascript ?
                                <Tab eventKey="js" title="Javascript" >

                                    <CodeMirror
                                        value={js}
                                        options={{
                                            mode: "javascript",
                                            ...codeMirrorOptions
                                        }}
                                        onBeforeChange={(editor, data, js) => {
                                            this.setState({ js });
                                        }}
                                    />


                                </Tab> : <div></div>}

                        </Tabs>
                    </div>
                    <div className="col-12 mr-5">
                        <iframe className="w-100" style={{ height: "400px", border: "none" }} title="result" ref="iframe" />

                    </div>
                </div>
            </div>
            // </div>
        );
    }
}

export default FrontEndChallenge;
