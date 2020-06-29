/* 

This file is used to develop the All course  page.
It contains the the methods to implement:
1. Filter Test
2. Publish Test
3. Edit test
4. View test


*/

import React from 'react';
import { getAllTests, createTest, updateTest } from '../data/data';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import history from "../components/history"

class Tests extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFilter: true,
            filter: "",
            tests: [],
            filterTest: []

        }
        this.onFilterChange = this.onFilterChange.bind(this)
    }
    componentDidMount() {
        this.props.toggleLoading();
        getAllTests().then((tests) => {
            this.setState({ tests, filterTest: tests });
        }).finally((err) => {
            this.props.toggleLoading();

        })

    }
    buttonText = {
        draft: "Publish",
        published: "Close",
        closed: "View Result"
    }
    functionCall = {
        draft: (index) => {
            history.push(`/publish/${this.state.tests[index]._id}`)
            window.location.reload();
        },
        published: (index) => {
            if (window.confirm("Are you sure you want to close the test?")) {

                this.props.toggleLoading("loading....");
                var filterTest = this.state.filterTest;
                filterTest[index].status = "closed";
                var tests = this.state.tests;
                for (var i = 0; i < tests.length; i++) {
                    if (tests[i]._id === filterTest[index]._id) {
                        tests[i].status = "closed";
                    }
                }
                updateTest(filterTest[index]).then(() => {
                    NotificationManager.success("Test Closed");
                    this.setState({ filterTest, tests })

                }).catch((err) => {
                    NotificationManager.error("Cannot connect to the Server!");

                }).finally(() => {
                    this.props.toggleLoading();

                })

            }

        },
        closed: (index) => {
            history.push(`/view-results/${this.state.tests[index]._id}`);
            window.location.reload()


        }
    }
    onFilterChange(e) {
        var query = e.target.value;
        var tests = this.state.tests;
        if (query === "clear") {
            this.setState({ filterTest: tests, filter: query })
            return;

        }
        else {
            var filterTest = tests.filter((test) => {
                return test.status === query;
            })
            this.setState({ filterTest, filter: query })

        }


    }
    onClickCreate() {
        this.props.toggleLoading("Creating Test");
        createTest().then((testDetail) => {
            NotificationManager.success('Success', 'New test Created');
            history.push(`/edit-test/${testDetail._id}`);
            window.location.reload()

        }).catch((err) => {
            NotificationManager.error('Error', 'Cannot connect to the Server!');
        }).finally(() => {
            this.props.toggleLoading();
        })
    }

    render() {
        return (
            <div>
                <div class="bg-light sidenav">
                    <button onClick={() => {
                        var isFilter = this.state.isFilter;
                        this.setState({ isFilter: !isFilter });

                    }} class="filter btn btn-lg text-center w-100 mr-1 text-white hide">
                        <i class="fa fa-sort mr-2"></i>
                                Filter
                            </button>
                    {this.state.isFilter ?
                        <div id="sort" class="sort-filter">
                            <div class="card p-2 rounded shadow mt-2">
                                <label class="form-check">
                                    <input checked={this.state.filter === "draft"} value="draft" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                    <span class="form-check-label">
                                        Drafts
                                    </span>
                                </label>
                                <label class="form-check">
                                    <input checked={this.state.filter === "published"} value="published" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                    <span class="form-check-label">
                                        Published
                                    </span>
                                </label>
                                <label class="form-check">
                                    <input checked={this.state.filter === "closed"} value="closed" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                    <span class="form-check-label">
                                        Closed
                                    </span>
                                </label>
                                <label class="form-check">
                                    <input checked={this.state.filter === "clear"} value="clear" onChange={this.onFilterChange} class="form-check-input" type="radio" />
                                    <span class="form-check-label">
                                        Clear
                                    </span>
                                </label>
                            </div>
                        </div>
                        : <div></div>}

                </div>
                <div className="main">
                    <div className="container">
                        <div className="mb-5 create-button" onClick={() => { this.onClickCreate() }} ><span>Create </span></div>
                        <ul>
                            {this.state.filterTest.map((test, index) => {
                                return <li key={test._id} className="topic">
                                    <div className="row">
                                        <div className="col-md-10"><h4 className=" text-truncate text-dark text-topic"><a href={test.status === "draft" ? `/edit-test/${test._id}` : undefined} className="text-truncate text-dark text-topic">{test.title}</a><span className="badge rounded text-white ml-1 badge-warning">{test.status}</span>
                                        
                                        {test.status==="published"?
                                        <span>
                                            <span onClick ={()=>{
                                                 navigator.clipboard.writeText(`http://sarthak-493c6.web.app/view-test/${test._id}`)
                                            }} className="badge ml-3 mr-3 badge-info"><FontAwesomeIcon icon={faCopy} />SAdmin Link</span>
                                            <span  onClick ={()=>{
                                                 navigator.clipboard.writeText(`http://hiii-15fdf.web.app/result/test/${test._id}`)
                                            }}  className="badge badge-info"><FontAwesomeIcon icon={faCopy} />SStudent Link</span>
                                        </span>
                                        :<span></span>
                                        }

                                        </h4></div>
                                        <div className="float-right col-md-2">
                                            <section onClick={() => { this.functionCall[test.status](index) }} className="btn text-white button-edit">{this.buttonText[test.status]}</section>
                                        </div>
                                    </div>
                                    <hr className="hr" />
                                    <br />
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
export default Tests;