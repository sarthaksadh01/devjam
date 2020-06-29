import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faImage, faCopy, faPlusSquare, faTrash, faCross, faTimes, faLeaf, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { getTest, updateTest } from '../data/data'
import { NotificationManager } from 'react-notifications';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import ReactDragListView from 'react-drag-listview/lib/index.js';
class EditTest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isTimed: false,
            isShuffle: false,
            testTiming: 10,
            title: "",
            desc: "",
            questions: [
                {
                    questionId: this.makeQid(8),
                    imageUrl: "",
                    type: "Multiple choice",
                    title: "",
                    options: [],
                    isAutoGraded: false,
                    correctOption: 1,

                },

            ]

        }
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.onQuestionTypeChange = this.onQuestionTypeChange.bind(this);
        this.addOption = this.addOption.bind(this);
        this.deleteOption = this.deleteOption.bind(this);
        this.addRowColumn = this.addRowColumn.bind(this);
        this.deleteRowColumn = this.deleteRowColumn.bind(this);
        this.onOptionChange = this.onOptionChange.bind(this);
        this.onQuestionTitleChange = this.onQuestionTitleChange.bind(this);
        this.onRowColumnChange = this.onRowColumnChange.bind(this);
        this.handleTestTimeChange = this.handleTestTimeChange.bind(this);
        this.onClickUpdateTest = this.onClickUpdateTest.bind(this);
        this.updateQImage = this.updateQImage.bind(this)
        this.updateOptionImage = this.updateOptionImage.bind(this)
    }
    componentDidMount() {
        this.props.toggleLoading();
        getTest(this.props.match.params.id).then((test) => {
            this.setState(this.state = test);

        }).catch((err) => {

        }).finally(() => {
            this.props.toggleLoading();
        })

    }
    quesionType = {
        "Multiple choice": {
            imageUrl: "",
            type: "Multiple choice",
            title: "",
            options: [],
            correctOption: 1,
            isAutoGraded: false,

        },
        "Paragraph": {
            title: "",
            type: "Paragraph",

        },
        "Multiple choice grid": {
            title: "",
            type: "Multiple choice grid",
            rows: [],
            columns: [],

        }

    }
    makeQid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value })

    }
    handleTestTimeChange(e) {
        this.setState({ testTiming: e.target.value });
    }
    handleDescChange(e) {
        this.setState({ desc: e.target.value })

    }

    onQuestionTypeChange(e, index) {
        var questions = this.state.questions;
        questions[index] = this.quesionType[e.target.value];
        questions["questionId"] = this.makeQid(8)
        this.setState({ questions })

    }

    onClickUpdateTest() {
        this.props.toggleLoading();
        updateTest(this.state).then(() => {
            NotificationManager.success("Test Updated!");

        }).catch((err) => {
            NotificationManager.error("Error updating test..!");


        }).finally(() => {
            this.props.toggleLoading();

        })


    }
    addOption(index) {
        var questions = this.state.questions;
        questions[index].options.push(
            {
                value: "",
                imageUrl: ""
            },
        )
        this.setState({ questions })
    }
    deleteOption(index1, index2) {
        var questions = this.state.questions;
        questions[index1].options.splice(index2, 1);
        this.setState({ questions });

    }
    addRowColumn(index, type) {
        var questions = this.state.questions;
        questions[index][type].push("")
        this.setState({ questions });

    }
    deleteRowColumn(index1, index2, type) {
        var questions = this.state.questions;
        questions[index1][type].splice(index2, 1);
        this.setState({ questions });

    }
    copyQuestion(index) {
        var questions = this.state.questions.splice(0);
        var question = JSON.parse(JSON.stringify(questions[index]))
        question['questionId'] = this.makeQid(8);
        questions.splice(index + 1, 0, question);
        this.setState({ questions });


    }
    addQuestion(index) {
        var questions = this.state.questions.splice(0);
        var question = JSON.parse(JSON.stringify(this.quesionType['Multiple choice']))
        question['questionId'] = this.makeQid(8);
        questions.splice(index + 1, 0, question);
        this.setState({ questions });

    }
    deleteQuestion(index) {
        var questions = [...this.state.questions]
        if (questions.length === 1) return;
        if (questions.length > 1) {
            questions.splice(index, 1);
            this.setState({ questions });
        }



    }
    onOptionChange(e, index1, index2) {
        var questions = this.state.questions;
        questions[index1].options[index2].title = e.target.value;
        this.setState({ questions });
    }
    onQuestionTitleChange(e, index) {
        var questions = this.state.questions;
        questions[index].title = e.target.value;
        this.setState({ questions });

    }
    onRowColumnChange(e, index1, index2, type) {
        var questions = this.state.questions;
        questions[index1][type][index2] = e.target.value;
        this.setState({ questions })
    }
    updateQImage(url, index) {
        var questions = this.state.questions;
        questions[index].imageUrl = url;
        this.setState({ questions })

    }
    updateOptionImage(url, index1, index2) {
        var questions = this.state.questions;
        questions[index1].options[index2].imageUrl = url;
        this.setState({ questions })

    }


    render() {
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const { questions } = that.state;
                const item = questions.splice(fromIndex, 1)[0];
                questions.splice(toIndex, 0, item);
                that.setState({ questions });
            },
            nodeSelector: 'li',
            handleSelector: 'section'
        };
        return (
            <div className="container mt-5">
                <div style={{ marginTop: "90px" }} className="row">
                    <div className="col-md-8">
                        <div className="col-md-10"><h4 className=" text-truncate text-topic">{this.state.title}<span className="badge float-right rounded text-white badge-info">X {this.state.questions.length}</span></h4></div>
                        <hr className="hr" />
                        <br />
                    </div>

                    <div className="col-md-4">

                        <a href ={`/view-test/${this.state._id}`} className="btn float-left round-shape-btn  ml-3"><FontAwesomeIcon className="text-white mr-1" icon={faEye} /></a>
                        <button onClick={() => { this.onClickUpdateTest() }} className="btn float-left round-shape-btn  ml-3">Save</button>
                        <a href={`/publish/${this.state._id}`} className="btn text-white float-left round-shape-btn  ml-3">Publish</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="col-md-8">
                            <form>
                                <div class="form-group">
                                    <label for="exampleFormControlTextarea1">Topic Title</label>
                                    <input onChange={this.handleTitleChange} value={this.state.title} type="text" class="form-control" id="exampleFormControlInput1" placeholder="" />
                                </div>
                                <div class="form-group">
                                    <label for="exampleFormControlTextarea1">Topic Description</label>
                                    <textarea onChange={this.handleDescChange} value={this.state.desc} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row  ml-2 mt-2">
                    <div className="col-md-1">
                        <label class="form-check">
                            <input onChange={(e) => {
                                var isTimed = !this.state.isTimed;
                                this.setState({ isTimed })

                            }} checked={this.state.isTimed} class="form-check-input" type="checkbox" />
                            <span class="form-check-label">
                                Timed
                             </span>
                        </label>
                    </div>
                    <div className="col-md-4">
                        {this.state.isTimed ? <span><input onChange={this.handleTestTimeChange} value={this.state.testTiming} type="number" className="form-control" /></span> : <span></span>}
                    </div>
                    <div className="col-md-4">
                        <label class="form-check">
                            <input onChange={(e) => {
                                var isShuffle = !this.state.isShuffle;
                                this.setState({ isShuffle })
                            }} checked={this.state.isShuffle} class="form-check-input" type="checkbox" />
                            <span class="form-check-label">
                                Shuffle Questions
                             </span>
                        </label>
                    </div>
                </div>
                <hr className="hr" />
                <ReactDragListView {...dragProps}>
                    <ol>

                        {this.state.questions.map((question, index1) => {
                            return <li> <div className="border mt-2 p-2 rounded  card">
                                <div className="row text-center">
                                    <div className="mb-2 col-12">
                                        <section className="">    <FontAwesomeIcon  icon={faEllipsisH}/></section>
                                    </div>


                                </div>

                                <div className="row text-center">
                                    <div className="mb-2 col-12 text-center">
                                        {question.imageUrl === "" ? <div></div> :

                                            <div style={{ marginLeft: "35%", maxHeight: "200px", maxWidth: "200px" }} class="img-wrap text-center">
                                                <span onClick={(e)=>{
                                                    this.updateQImage("",index1)
                                                }} class="text-danger close">&times;</span>
                                                <img style={{ maxHeight: "200px", maxWidth: "200px" }} src={question.imageUrl} />
                                            </div>

                                        }
                                    </div>


                                </div>
                                <div className="row">
                                    <div className="col-10">
                                        <div className="row">
                                            <div className="col-7">
                                                <input value={question.title} onChange={(e) => { this.onQuestionTitleChange(e, index1) }} placeholder="Question title" className="w-100 form-control" />
                                            </div>
                                            <div className="col-1">
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
                                                                this.updateQImage(result.info.secure_url, index1)
                                                            }
                                                        })
                                                    }}
                                                    style={{ fontSize: 25 }} icon={faImage} />
                                            </div>
                                            <div className="col-4">
                                                <select onChange={(e) => { this.onQuestionTypeChange(e, index1) }} value={question.type} className="w-100">
                                                    <option>Multiple choice</option>
                                                    <option>Multiple choice grid</option>
                                                    <option>Paragraph</option>
                                                </select>
                                            </div>
                                        </div>
                                        {question.type === "Multiple choice"
                                            ? <div>
                                                <ul>
                                                    {question.options.map((option, index2) => {
                                                        return <li>

                                                            <div className="row mt-4">
                                                                <div className="col-4">
                                                                    <input onChange={(e) => { this.onOptionChange(e, index1, index2) }} value={option.title} placeholder="" className="form-control" />
                                                                </div>
                                                                <div className="col-2">
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

                                                                                    this.updateOptionImage(result.info.secure_url, index1, index2)
                                                                                }
                                                                            })
                                                                        }}
                                                                        className="mr-2" style={{ fontSize: 25 }} icon={faImage} />
                                                                    <FontAwesomeIcon onClick={() => { this.deleteOption(index1, index2) }} className="text-danger" style={{ fontSize: 25 }} icon={faTimes} />
                                                                </div>
                                                                <div className="col-4">
                                                                    {option.imageUrl === "" ? <div></div> :
                                                                        <div style={{ maxHeight: "150px" }} class="img-wrap text-center">
                                                                            <span onClick={()=>{
                                                                                this.updateOptionImage("",index1,index2)
                                                                            }} class="text-danger close">&times;</span>
                                                                            <img style={{ maxHeight: "150px" }} src={option.imageUrl} />
                                                                        </div>
                                                                    }

                                                                </div>
                                                            </div>
                                                        </li>

                                                    })}
                                                </ul>
                                                <div className="row mt-2">
                                                    <div className="col-8">
                                                        <span onClick={() => { this.addOption(index1) }} className="round-shape-btn btn"> Add option</span>
                                                    </div>
                                                    <div className="col-2">
                                                        <BootstrapSwitchButton
                                                            width={100}
                                                            checked={question.isAutoGraded}
                                                            onlabel='Autogra..'
                                                            // offlabel='Regular User'
                                                            onChange={(checked) => {
                                                                var questions = this.state.questions;
                                                                questions[index1].isAutoGraded = checked;


                                                                this.setState({ questions })
                                                            }}
                                                        />


                                                    </div>
                                                    <div className="col-2">
                                                        {question.isAutoGraded ? <input
                                                            onChange={(e) => {
                                                                var questions = this.state.questions;
                                                                var value = parseInt(e.target.value);
                                                                var options = questions[index1].options.length;
                                                                if (value < 1) value = 1;
                                                                if (value > options) value = options;
                                                                questions[index1].correctOption = value;
                                                                this.setState({ questions })
                                                            }}
                                                            value={question.correctOption} type="number" className="form-control w-100" /> : <div></div>}

                                                    </div>
                                                </div>
                                            </div>

                                            : <div></div>

                                        }
                                        {question.type === "Paragraph"
                                            ? <textarea className="mt-3 form-control" rows={5}></textarea>
                                            : <div></div>}
                                        {question.type === "Multiple choice grid"
                                            ? <div className="row mt-3">
                                                <div className="col-6">
                                                    <p className="text-center">Rows</p>
                                                    <ol>
                                                        {question.rows.map((row, index2) => {
                                                            return <li><div className="row">
                                                                <div className="col-10">
                                                                    <input value={row} onChange={(e) => { this.onRowColumnChange(e, index1, index2, "rows") }} className="mt-2 form-control" />

                                                                </div>
                                                                <div className="col-2">
                                                                    <FontAwesomeIcon onClick={() => { this.deleteRowColumn(index1, index2, "rows") }} icon={faTimes} />

                                                                </div>

                                                            </div>
                                                            </li>

                                                        })}
                                                    </ol>
                                                    <div className="col-8">
                                                        <span onClick={() => { this.addRowColumn(index1, "rows") }} className="round-shape-btn btn"> Add Row</span>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <p className="text-center">Columns</p>
                                                    <ol>
                                                        {question.columns.map((column, index2) => {
                                                            return <li> <div className="row">
                                                                <div className="col-10">
                                                                    <input value={column} onChange={(e) => { this.onRowColumnChange(e, index1, index2, "columns") }} className="mt-2 form-control" />

                                                                </div>
                                                                <div className="col-2">
                                                                    <FontAwesomeIcon onClick={() => { this.deleteRowColumn(index1, index2, "columns") }} icon={faTimes} />

                                                                </div>

                                                            </div>
                                                            </li>

                                                        })}
                                                    </ol>
                                                    <div className="col-8">
                                                        <span onClick={() => { this.addRowColumn(index1, "columns") }} className="round-shape-btn btn"> Add Column</span>
                                                    </div>

                                                </div>

                                            </div>

                                            : <div></div>}
                                    </div>
                                    <div className="col-2 text-center">
                                        <div className="text-muted text-center">
                                            <div className="text-center row">
                                                <div className="col-12 text-center">
                                                    <FontAwesomeIcon onClick={() => { this.addQuestion(index1) }} style={{ fontSize: 22 }} className="largeIcons" icon={faPlusSquare} />
                                                </div>
                                            </div>

                                            <div className="text-center row">
                                                <div className="col-12 text-center">
                                                    <FontAwesomeIcon onClick={() => { this.copyQuestion(index1) }} style={{ fontSize: 22 }} className="largeIcons" icon={faCopy} />
                                                </div>
                                            </div>

                                            <div className="text-center row">
                                                <div className="col-12 text-center">
                                                    <FontAwesomeIcon onClick={() => { this.deleteQuestion(index1) }} style={{ fontSize: 22 }} className="largeIcons" icon={faTrash} />
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>
                            </li>
                        })}
                    </ol>
                </ReactDragListView>


            </div>
        );
    }
}
export default EditTest;