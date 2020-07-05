import React from 'react';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { NotificationManager } from 'react-notifications';
import { getCodingQuestion, updateCodingQuestion } from '../data/data';
import Select from 'react-select';
import history from '../components/history';
class EditFreeStyleQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                title: "",
                instructions: "",
                imageUrl: "",
                points: 0,
                questionType: "freeStyle",
                difficulty: "easy",
                enableJavascript:false
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

    onChangeData(type, value) {
        var question = this.state.question;
        question[type] = value;
        this.setState({ question });

    }
    componentDidMount() {
        this.props.toggleLoading();
        getCodingQuestion(this.props.match.params.id).then((question) => {
            var diff = this.difficulty.find((dif)=>{
                return dif.value===question.difficulty;
            })
            this.setState({ question ,selectedOption:diff});
        }).catch((err) => {
            NotificationManager.error("Error connecting to server..!");
        }).finally(() => {
            this.props.toggleLoading();
        })

    }
    saveQuestion() {
        this.props.toggleLoading();
        updateCodingQuestion(this.state.question).then((question) => {
            NotificationManager.success("Question Updated");
            history.goBack();



        }).catch((err) => {
            NotificationManager.error("Error connecting to server..!");

        }).finally(() => {
            this.props.toggleLoading();

        })
    }

    render() {
        const mdParser = new MarkdownIt();
        return (
            <div className="container" style={{marginTop:"120px"}}>
                <div className="row ">
                    <div className="col-8">
                        <h5>Edit Question</h5>
                        <hr />
                        <div class="form-group w-100">
                            <label for="exampleFormControlTextarea1" className="blueText font-weight-bold">Question Image</label>
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
                            <label for="exampleFormControlTextarea1" className="blueText font-weight-bold">Question Title</label>
                            <input onChange={(e) => { this.onChangeData("title", e.target.value) }} value={this.state.question.title} type="text" class="form-control w-100" id="exampleFormControlInput1" placeholder="" />
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1" className="blueText font-weight-bold">Question Description</label>
                            <MdEditor
                                value={this.state.question.desc}
                                style={{ height: "250px" }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={({ html, text }) => { this.onChangeData("desc", text) }}
                            />
                        </div>

                        <div class="form-group">
                            <label for="exampleFormControlTextarea1" className="blueText font-weight-bold">Points</label>
                            <input value={this.state.question.points} onChange={(e) => { this.onChangeData("points", e.target.value) }} type="number" className="form-control" />
                        </div>
                        <div class="form-group">
                            <div className="row">
                                <div className="col-8">
                                    <Select
                                        value={this.state.selectedOption}
                                        onChange={(e) => {
                                            var question = this.state.question;
                                            question.difficulty = e.value;
                                            var selectedOption = this.state.selectedOption;
                                            selectedOption = e;
                                            this.setState({ selectedOption, question }, () => {
                                            })

                                        }}
                                        options={this.difficulty}
                                    />

                                </div>

                            </div>
                            <div className="row">
                            <label class="ml-3 mt-2 form-check">
                                <input onChange={(e) => {
                                    var question = this.state.question;
                                    question.enableJavascript = !question.enableJavascript;
                                     question.questionType = "freeStyle";
                                    if(question.enableJavascript)question.questionType ="freeStyleDynamic";
                                    this.setState({ question })

                                }} checked ={this.state.question.enableJavascript}  class="form-check-input" type="checkbox" />
                                <span class="form-check-label">
                                    Enable Javascript?
                             </span>
                            </label>
                            </div>
                            <div className="row mt-3">
                                <button onClick ={()=>{
                                    var question = this.state.question;
                                    this.saveQuestion();
                                }} className="btn btn-lg btn-info">Save</button>
                            </div>

                        </div>


                    </div>
                </div>

            </div>
        )
    }

}
export default EditFreeStyleQuestion;