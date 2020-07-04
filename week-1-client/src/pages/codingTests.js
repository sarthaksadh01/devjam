import React from 'react';
import Select from 'react-select';
import { getAllCodingTests, createCodingTest, updateCodingTest } from '../data/data';
import { NotificationManager } from 'react-notifications';
import history from '../components/history';
const ReactMarkdown = require('react-markdown')
class CodingTests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            codingTests: [],
            filterCodingTests: [],
            selectedOption: { value: 'all', label: 'All' }

        }
        this.onFilterChange = this.onFilterChange.bind(this);
    }
    componentDidMount() {
        this.props.toggleLoading();
        getAllCodingTests().then((codingTests) => {
            this.setState({ codingTests, filterCodingTests: codingTests });
        }).catch((err) => {
            NotificationManager.error("Error connecting to the server..!")

        }).finally(() => {
            this.props.toggleLoading();

        })

    }
    onClickTestCreate(){
        this.props.toggleLoading();
        createCodingTest().then((doc)=>{
            history.push(`/edit-coding-test/${doc._id}`);
            window.location.reload();


        }).catch((err)=>{
            NotificationManager.error("Error connecting to the server..!")

        }).finally(()=>{
            this.props.toggleLoading();

        })
    }
    buttonText = {
        draft: "Publish",
        published: "Close",
        closed: "View Result"
    }
    badgeColor = {
        draft: "badge-warning",
        published: "badge-success",
        closed: "badge-info"
    }
    functionCall = {
        draft: (index) => {
            history.push(`/publish-coding-test/${this.state.filterCodingTests[index]._id}`)
            window.location.reload();
        },
        published: (index) => {
            if (window.confirm("Are you sure you want to close the test?")) {

                this.props.toggleLoading("loading....");
                var filterCodingTests = this.state.filterCodingTests;
                filterCodingTests[index].status = "closed";
                var codingTests = this.state.codingTests;
                for (var i = 0; i < codingTests.length; i++) {
                    if (codingTests[i]._id === filterCodingTests[index]._id) {
                        codingTests[i].status = "closed";
                    }
                }
        
                updateCodingTest(filterCodingTests[index]).then(() => {
                    NotificationManager.success("Test Closed");
                    this.setState({ filterCodingTests, codingTests })

                }).catch((err) => {
                    NotificationManager.error("Cannot connect to the Server!");

                }).finally(() => {
                    this.props.toggleLoading();

                })

            }

        },
        closed: (index) => {
            history.push(`/view-coding-results/${this.state.codingTests[index]._id}`);
            window.location.reload()


        }
    }
    onFilterChange(e) {
        var filterCodingTests;
        var codingTests = this.state.codingTests;
        if (e.value === "all") {
            filterCodingTests = codingTests;

        }
        else {
            var filterCodingTests = codingTests.filter((test) => {
                return test.status === e.value;
            })
        }
        this.setState({ filterCodingTests, selectedOption: e });
    }
    testOptions = [
        { value: 'all', label: 'All' },
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'closed', label: 'Closed' },
    ]
    render() {
        return (
            <div style={{ marginTop: "80px" }}>
                <div className="container">
                <br />
               
                    <div className="row my-4 ">
                    <div className="col-7">
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.onFilterChange}
                                options={this.testOptions}
                            />

                        </div>
                        <div className="col-4 ml-4">
                            <button onClick ={()=>{this.onClickTestCreate()}} className="btn  blueBack font-weight-bold text-white float-right">Create New Test</button>

                        </div>
                   
                        </div>
               
                    <br />
                    <div className="row mt-3">
                        {this.state.filterCodingTests.map((value, index) => {
                            return <div className="col-12 mb-4">
                                <div className="card mb-3 shadow rounded">
                                    <div className="card-header redBack text-white font-weight-bold">
                                        <h4>{value.title} <span className={`badge ${this.badgeColor[value.status]} text-white float-right mt-1`}>{value.status}</span></h4>
                                    </div>
                                    <div className="card-body mx-3">
                                        <ReactMarkdown escapeHtml={false} source={value.instructions} />

                                    </div>
                                    <div className="m-2 mb-4 text-center">
                                        <div class="btn-group" role="group" aria-label="Basic example">
                                            <button onClick={()=>{
                                                history.push(`/edit-coding-test/${value._id}`);
                                                window.location.reload();
                                            }} type="button" class="btn btn-outline-danger ">Edit</button>
                                            <button onClick ={()=>{
                                                history.push(`/view-coding-test/${value._id}`);
                                                window.location.reload();

                                            }} type="button" class="btn btn-outline-danger">Preview</button>
                                            <button onClick ={()=>{
                                                this.functionCall[value.status](index);
                                            }} type="button" class="btn btn-outline-danger">{this.buttonText[value.status]}</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                        })}
                    </div>
                </div>

            </div>
        );
    }
}
export default CodingTests;