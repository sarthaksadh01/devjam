import React from 'react';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import DatePicker from "react-datepicker";
import { getSubTopic,updateSubTopic } from "../data/data"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/sidebar.css"
class Deliverable extends React.Component {
    state = {
        data: {
            title: `loading`,
            instruction: ``,
            points: 0,
            type: `deliverable`,
            due: new Date,
        }
    }

    constructor(props) {
        super(props)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handlePointsChange = this.handlePointsChange.bind(this)
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)

    }

    componentDidMount() {
        this.props.toggleLoading()
        getSubTopic(this.props.match.params.id, "deliverable").then((data) => {
            this.setState({ data });
        }).catch((err) => {
            NotificationManager.error('Error', 'Error loading page');

        }).finally(() => {
            this.props.toggleLoading()

        })

    }

    onClickSave() {
        this.props.toggleLoading("Saving..")
        updateSubTopic(this.props.match.params.id,this.state.data).then((data)=>{
            NotificationManager.success('Success', 'Saved..');
        }).catch((err)=>{
            NotificationManager.error('Error', 'Error saving..');
            
        }).finally(()=>{
            this.props.toggleLoading()

        })


    }
    handleTitleChange(event) {
        var data = this.state.data;
        data.title = event.target.value
        this.setState({ data });


    }
    handleDateChange(date) {
        var data = this.state.data;
        data.due = date;
        this.setState({ data });

    }
    handlePointsChange(event) {
        var val = parseInt(event.target.value);
        
        if(isNaN(val)){
            var data = this.state.data;
            data.points = 0
            this.setState({ data });
            return;

        }
        var data = this.state.data;
        
        data.points = val;
        this.setState({ data });
        

    }
    handleEditorChange({ html, text }) {
        var data = this.state.data;
        data.instruction = text
        this.setState({ data });

    }
   
    render() {
        const mdParser = new MarkdownIt();

        return (<div style={{ marginTop: "70px" }} className="mt-5 container">
            <div style={{ marginTop: "90px" }} className="row">
                <div className="col-md-8">
                    <form>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Deliverable Title</label>
                            <textarea onChange={this.handleTitleChange} value={this.state.data.title} class="form-control" id="exampleFormControlTextarea1" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Deliverable Instruction</label>
                            <MdEditor
                                value={this.state.data.instruction}
                                style={{ height: "350px" }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                            />
                        </div>             
                    </form>
                   
                </div>
                <div className="col-md-4">
                    <form>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1"><b>Points</b></label>
                            <input onChange={this.handlePointsChange} value={this.state.data.points} type="number" class="form-control" id="exampleFormControlInput1" placeholder="points" />
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1"><b>Due</b></label> <br />
                            <DatePicker
                                startDate={new Date()}
                                selected={new Date(this.state.data.due)}
                                onChange={(date) => { this.handleDateChange(date) }}
                            />
                        </div>

                    </form>
                    <button onClick={()=>{this.onClickSave()}} class="btn create-button  align-text-bottom">Save</button>

                </div>
            </div>
            <NotificationContainer />
        </div>);

    }

}
export default Deliverable;