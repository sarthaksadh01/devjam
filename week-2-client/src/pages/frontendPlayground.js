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

class FrontEndPlayground extends Component {
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
            <div className="container" style={{ marginTop: "100px" }}>
                {/* <div className="container"> */}
                <section class="jumbotron text-center mb-5">
      <div class=" jumboMargin" >
        <h1 class="text-orange font-weight-bold">UI Playground</h1>
        <p class="lead text-orange"> Test your UI application here! An ultimate UI palyground with HTML/CSS and Javascript.</p>
       
      </div>
    </section>
           
                <div className="w-100 row mx-auto">
                    <div style={{ height: "50%" }} className="col-12 mr-5">
                        <Tabs defaultActiveKey="html" id="uncontrolled-tab-example">
                            <Tab eventKey="html" title="Html">

                                <CodeMirror
                                    value={this.state.html}
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
                                    value={this.state.css}
                                    options={{
                                        mode: "css",
                                        ...codeMirrorOptions
                                    }}
                                    onBeforeChange={(editor, data, css) => {
                                        this.setState({ css });
                                    }}
                                />

                            </Tab>
                            <Tab eventKey="js" title="Javascript" >

                                <CodeMirror
                                    value={this.state.js}
                                    options={{
                                        mode: "javascript",
                                        ...codeMirrorOptions
                                    }}
                                    onBeforeChange={(editor, data, js) => {
                                        this.setState({ js });
                                    }}
                                />


                            </Tab>

                        </Tabs>
                    </div>
                    <div className="col-12 mb-5  mr-5 mt-5 card">
                        <iframe className="w-100" style={{ height: "400px", border: "none" }} title="result" ref="iframe" />

                    </div>
                </div>
            </div>
            <footer id="sticky-footer" class="py-4  text-white-50 blueBack ">
                    <div class="container text-center">
                        <small>Copyright &copy; Cryptx</small>
                    </div>
                </footer>
            </div>
        );
    }
}

export default FrontEndPlayground;
