import React from 'react';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal'
class AddCodingQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showNumber: false,
            showString: false,
            minRange:0,
            maxRange:100,
            stringSize:10,
            integerCount:10,
            stringCount:10,
            seperator: { value: ' ', label: 'Space Separated' },
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
            resetQuestion: {
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
    seperator = [
        { value: '\n', label: 'New Line Separated' },
        { value: ' ', label: 'Space Separated' },
        { value: ',', label: 'Comma separated' },
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
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
      }
      generateRandomString(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    componentDidMount() {

    }
    render() {
        const mdParser = new MarkdownIt();
        return (
            <div>
                <div className="row mt-3">
                    <div className="col-8">
                        
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
                            <label for="exampleFormControlTextarea1" className="blueText font-weight-bold">Constraints</label>
                            <MdEditor
                                value={this.state.question.constraints}
                                style={{ height: "150px" }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={({ html, text }) => { this.onChangeData("constraints", text) }}
                            />
                        </div>
                        <div class="form-group" >
                            <label for="exampleFormControlTextarea1" className="blueText font-weight-bold">Execution Time</label>
                            <input value={this.state.question.execTime} onChange={(e) => { this.onChangeData("execTime", e.target.value) }} type="number" className="form-control" />
                        </div>

                        <div class="form-group">
                            <label for="exampleFormControlTextarea1" className="blueText font-weight-bold">Sample Input</label>
                            <textarea value={this.state.question.sampleInput} onChange={(e) => { this.onChangeData("sampleInput", e.target.value) }} className="form-control" rows={"2"}></textarea>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1" className="blueText font-weight-bold">Sample Output</label>
                            <textarea value={this.state.question.sampleOutput} onChange={(e) => { this.onChangeData("sampleOutput", e.target.value) }} className="form-control" rows={"2"}></textarea>
                        </div>

                        <div class="form-group">
                            <div className="row">

                                {/* <label for="exampleFormControlTextarea1" className="blueText font-weight-bold"> Difficulty</label><br/> */}
                                <div className="col-8">
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

                        <label className="blueText font-weight-bold">Test Cases</label>
                        <hr />
                        <div className="card p-3">
                            {this.state.question.testCases.map((testCae, index) => {
                                return <div className="mr-4">
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
                            <button onClick={() => {

                                this.setState({ showNumber: true });
                            }} className="btn btn-outline-info ml-1">Random Number</button>
                            <button onClick={() => {

                                this.setState({ showString: true });
                            }} className="btn btn-outline-info ml-1">Random String</button>

                            <br />

                            <button onClick={() => {
                                var question = this.state.question;
                                var resetQuestion = JSON.parse(JSON.stringify(this.state.resetQuestion));
                                this.props.saveQuestion(question);
                                this.setState({ question: resetQuestion });
                            }} className="btn mt-3 btn-info">Save</button>

                        </div>
                    </div>
                </div>

                < Modal size="md" centered={true} show={this.state.showNumber} onHide={() => { this.setState({ showNumber: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Random Number Generator</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container text-center">
                            <div className="row">
                                <div className="col-4">
                                    <div class="form-group">
                                        <label for="exampleFormControlTextarea1">Min Range</label>
                                        <input value = {this.state.minRange} onChange ={(e)=>{
                                            this.setState({minRange:parseInt(e.target.value)})
                                        }} />

                                    </div>
                                </div>
                                <div className="col-4">
                                    <div class="form-group">
                                        <label for="exampleFormControlTextarea1">Max Range</label>
                                        <input value = {this.state.maxRange} onChange ={(e)=>{
                                            this.setState({maxRange:parseInt(e.target.value)})
                                        }} />

                                    </div>
                                </div>
                                
                                
                                
                                <div className="col-10">

                                    <Select
                                        value={this.state.seperator}
                                        onChange={(e) => {
                                            this.setState({ seperator: e }, () => {
                                                // alert(this.state.question.difficulty)
                                            })

                                        }}
                                        options={this.seperator}
                                    />
                                </div>
                                <div className="col-10 mt-3">
                                    <div class="form-group">
                                        <label className="mr-2" for="exampleFormControlTextarea1">Integer Count</label>
                                        <input value = {this.state.integerCount} onChange ={(e)=>{
                                            this.setState({integerCount:parseInt(e.target.value)})
                                        }} />

                                    </div>
                                </div>
                            </div>


                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick ={(e)=>{
                            var res = '';
                            for(var i = 0;i<this.state.integerCount;i++){
                                res+= String(this.getRandomIntInclusive(this.state.minRange,this.state.maxRange));
                                res+= this.state.seperator.value;

                            }
                            navigator.clipboard.writeText(res);
                            NotificationManager.success("Numbers copied to clipboard");
                            this.setState({showNumber:false})

                        }} className="btn btn-info">Generate</button>
                    </Modal.Footer>
                </Modal>

                < Modal size="md" centered={true} show={this.state.showString} onHide={() => { this.setState({ showString: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Random String Generator</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="container text-center">
                            <div className="row">
                                
                                <div className="col-10">

                                    <Select
                                        value={this.state.seperator}
                                        onChange={(e) => {
                                            this.setState({ seperator: e }, () => {
                                               
                                            })

                                        }}
                                        options={this.seperator}
                                    />
                                </div>
                                <div className="col-10 mt-3">
                                    <div class="form-group">
                                        <label className="mr-2" for="exampleFormControlTextarea1">String Length</label>
                                        <input value = {this.state.stringCount} onChange ={(e)=>{
                                            this.setState({stringCount:parseInt(e.target.value)})
                                        }} />

                                    </div>
                                </div>
                            </div>


                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                    <button onClick ={(e)=>{
                            var res = '';
                            for(var i = 0;i<this.state.stringCount;i++){
                                res+= String(this.generateRandomString(this.state.stringCount));
                                res+= this.state.seperator.value;

                            }
                            navigator.clipboard.writeText(res);
                            NotificationManager.success("Strings copied to clipboard");
                            this.setState({showString:false})

                        }} className="btn btn-info">Generate</button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}
export default AddCodingQuestion;





