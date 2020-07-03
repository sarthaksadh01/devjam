import React from 'react';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import { getCodingQuestion, updateCodingQuestion } from '../data/data';
class EditCodingQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                imageUrl: "",
                title: "",
                desc: "",
                execTime: 0,
                constraints: "",
                sampleInput: "",
                sampleOutput: "",
                difficulty: "easy",
                questionType: "coding",
                testCases: [
                    {
                        input: "",
                        output: "",
                        points: 0
                    }
                ]
            },
            selectedOption: { value: 'easy', label: 'Easy' },
        }
        this.onChangeData = this.onChangeData.bind(this);

    }
    difficulty = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ]
    questionType = [
        { value: 'coding', label: 'Coding Question' },
        { value: 'frontend', label: 'Frontend Question' },
        { value: 'frontendDynamic', label: 'Frontend Dynamic Question' },
    ]
    onChangeData(type, value) {
        var question = this.state.question;
        question[type] = value;
        this.setState({ question });

    }
    saveQuestion() {
        this.props.toggleLoading();
        updateCodingQuestion(this.state.question).then((question) => {
            NotificationManager.success("Question Updated");


        }).catch((err) => {
            NotificationManager.error("Error connecting to server..!");

        }).finally(() => {
            this.props.toggleLoading();

        })
    }
    componentDidMount() {
        this.props.toggleLoading();
        getCodingQuestion(this.props.match.params.id).then((question) => {
            this.setState({ question });
        }).catch((err) => {
            NotificationManager.error("Error connecting to server..!");
        }).finally(() => {
            this.props.toggleLoading();
        })

    }
    render() {
        const mdParser = new MarkdownIt();
        return (
            <div style={{ marginTop: "80px" }} className="container">
                <div className="row">
                    <div className="col-12">
                        <h4>Edit Question <span className="mb-5 float-right"><button onClick={() => {
                            this.saveQuestion();
                        }} className="btn btn-lg btn-info">Save</button></span></h4>
                        <hr className="hr" />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <h5>General Details</h5>
                        <hr />
                        <div class="form-group w-100">
                            <label for="exampleFormControlTextarea1">Question Image</label>
                            <div className="row text-center">
                                <div className="mb-2 col-12 text-center">
                                    {this.state.question.imageUrl === "" ? <div></div> :

                                        <div style={{ marginLeft: "35%", maxHeight: "200px", maxWidth: "200px" }} class="img-wrap text-center">
                                            <span onClick={(e) => {
                                                this.onChangeData("imageUrl", "")
                                            }} class="text-danger close">&times;</span>
                                            <img style={{ maxHeight: "200px", maxWidth: "200px" }} src={this.state.question.imageUrl} />
                                        </div>

                                    }
                                    {this.state.question.imageUrl === "" ?
                                        <FontAwesomeIcon
                                            onClick={() => {

                                                window.cloudinary.openUploadWidget({
                                                    cloudName: "sarthaksadh", uploadPreset: "orbnpafv", multiple: false,
                                                    resourceType: "image"
                                                }, (error, result) => {
                                                    if (error) {
                                                        NotificationManager.error('Error', 'Failed Uploading Image');
                                                        return;

                                                    }
                                                    if (!error && result && result.event === "success") {
                                                        NotificationManager.info('Info', 'Image Uploaded');
                                                        this.onChangeData("imageUrl", result.info.secure_url)

                                                    }
                                                })
                                            }}
                                            style={{ fontSize: 25 }} icon={faImage} />
                                        : <div></div>}

                                </div>
                            </div>
                        </div>
                        <div class="form-group w-100">
                            <label for="exampleFormControlTextarea1">Question Title</label>
                            <input onChange={(e) => { this.onChangeData("title", e.target.value) }} value={this.state.question.title} type="text" class="form-control w-100" id="exampleFormControlInput1" placeholder="" />
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Question Description</label>
                            <MdEditor
                                value={this.state.question.desc}
                                style={{ height: "250px" }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={({ html, text }) => { this.onChangeData("desc", text) }}
                            />
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Constraints</label>
                            <MdEditor
                                value={this.state.question.constraints}
                                style={{ height: "150px" }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={({ html, text }) => { this.onChangeData("constraints", text) }}
                            />
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Execution Time</label>
                            <input value={this.state.question.execTime} onChange={(e) => { this.onChangeData("execTime", e.target.value) }} type="number" className="form-control" />
                        </div>

                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Sample Input</label>
                            <textarea value={this.state.question.sampleInput} onChange={(e) => { this.onChangeData("sampleInput", e.target.value) }} className="form-control" rows={"2"}></textarea>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Sample Output</label>
                            <textarea value={this.state.question.sampleOutput} onChange={(e) => { this.onChangeData("sampleOutput", e.target.value) }} className="form-control" rows={"2"}></textarea>
                        </div>

                        <div class="form-group">
                            <div className="row">

                                {/* <label for="exampleFormControlTextarea1"> Difficulty</label><br/> */}
                                <div className="col-12">
                                    <Select
                                        value={this.state.selectedOption}
                                        onChange={(e) => {
                                            var question = this.state.question;
                                            question.difficulty = e.value;
                                            var selectedOption = this.state.selectedOption;
                                            selectedOption = e;
                                            this.setState({ selectedOption, question }, () => {
                                                // alert(this.state.question.difficulty)
                                            })

                                        }}
                                        options={this.difficulty}
                                    />

                                </div>
                            </div>

                        </div>

                        <h5>Test Cases</h5>
                        <hr />
                        <div className="card p-3">
                            {this.state.question.testCases.map((testCae, index) => {
                                return <div className="">
                                    <div class="form-group">
                                        <label for="exampleFormControlTextarea1">Test Case {index + 1} Input</label>
                                        <textarea value={this.state.question.testCases[index].input} onChange={(e) => {
                                            var question = this.state.question;
                                            question.testCases[index].input = e.target.value;
                                            this.setState({ question });
                                        }} className="form-control" rows={"2"}></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleFormControlTextarea1">Test Case {index + 1}  Output</label>
                                        <textarea value={this.state.question.testCases[index].output} onChange={(e) => {
                                            var question = this.state.question;
                                            question.testCases[index].output = e.target.value;
                                            this.setState({ question });
                                        }} className="form-control" rows={"2"}></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleFormControlTextarea1">Test Case {index + 1}  Points</label>
                                        <input type="number" value={this.state.question.testCases[index].points} onChange={(e) => {
                                            var question = this.state.question;
                                            question.testCases[index].points = e.target.value;
                                            this.setState({ question });
                                        }} className="form-control" />
                                    </div>
                                    <div className="">
                                        <button onClick={() => {
                                            var question = this.state.question;
                                            question.testCases.splice(index, 1);
                                            this.setState({ question });
                                        }} className="btn btn-outline-danger">
                                            Remove
                                    </button>
                                    </div>
                                    <hr />
                                </div>
                            })}
                        </div>
                        <div class="mt-2 form-group">
                            <button onClick={() => {
                                var question = this.state.question;
                                question.testCases.push({
                                    input: "",
                                    output: "",
                                    points: 0
                                })
                                this.setState({ question });
                            }} className="btn btn-outline-info">Add More test Cases</button>
                            <br />



                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
export default EditCodingQuestion;





