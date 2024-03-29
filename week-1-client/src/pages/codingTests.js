/* 

This file contains all challenges.

*/

import React from 'react';
import Select from 'react-select';
import { getAllCodingTests, createCodingTest, updateCodingTest } from '../data/data';
import { NotificationManager } from 'react-notifications';
import history from '../components/history';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { reactLocalStorage } from '../../../week-2-client/node_modules/reactjs-localstorage/react-localstorage';

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
    onClickTestCreate() {
        this.props.toggleLoading();
        createCodingTest().then((doc) => {
            history.push(`/edit-coding-test/${doc._id}`);
            window.location.reload();


        }).catch((err) => {
            NotificationManager.error("Error connecting to the server..!")

        }).finally(() => {
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
    handleJoyrideCallback = data => {
        const { action, index, status, type } = data;


        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {

            reactLocalStorage.set("tour-1", "yes");
            this.setState({ run: false });
        }
    };
    render() {
        return (
            <div style={{ marginTop: "80px" }}>
                <div className="container">
                    <br />
                    {reactLocalStorage.get("tour-1", "no", true) === "no" ?
                        <Joyride
                            callback={this.handleJoyrideCallback}

                            steps={[
                                {
                                    target: '.create-coding-test',
                                    content: 'To Create a new test click on this Create button',
                                },
                                {
                                    target: '.coding-test-filter',
                                    content: 'Filter the Created test based on the status',
                                },
                                {
                                    target: '.coding-test-status',
                                    content: 'Test status will appear here',
                                },
                                {
                                    target: '.coding-test-status',
                                    content: 'Test status will appear here',
                                },
                                {
                                    target: '.coding-test-buttons',
                                    content: 'Click here to perform relevant action',
                                },
                                // coding-test-status
                            ]}

                        />
                        : <div></div>}



                    <div className="row my-4 ">
                        <div className="col-7 coding-test-filter">
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.onFilterChange}
                                options={this.testOptions}
                            />

                        </div>
                        <div className="col-4 ml-4">
                            <button onClick={() => { this.onClickTestCreate() }} className="btn create-coding-test  blueBack font-weight-bold text-white float-right">Create New Test</button>

                        </div>

                    </div>

                    <br />
                    <div className="row mt-3">
                        {this.state.filterCodingTests.map((value, index) => {
                            return <div className="col-12 mb-4">
                                <div className="card mb-3 shadow rounded">
                                    <div className="card-header redBack blueText font-weight-bold">
                                        <h4>{value.title} <span className={`badge coding-test-status ${this.badgeColor[value.status]} text-white float-right mt-1`}>{value.status}</span></h4>
                                    </div>
                                    <div className="card-body mx-3">
                                        <ReactMarkdown escapeHtml={false} source={value.instructions} />

                                    </div>
                                    <div className="m-2 mb-4 text-center">
                                        <div class="coding-test-buttons btn-group" role="group" aria-label="Basic example">
                                            <button onClick={() => {
                                                history.push(`/edit-coding-test/${value._id}`);
                                                window.location.reload();
                                            }} type="button" class="btn border-info2 blueLight">Edit</button>
                                            <button onClick={() => {
                                                history.push(`/view-coding-test/${value._id}`);
                                                window.location.reload();

                                            }} type="button" class="btn border-info2 blueLight">Preview</button>
                                            <button onClick={() => {
                                                this.functionCall[value.status](index);
                                            }} type="button" class="btn border-info2 blueLight">{this.buttonText[value.status]}</button>

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
