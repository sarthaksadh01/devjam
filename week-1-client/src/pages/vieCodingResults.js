
import React from 'react';
import { getTest, getUsers, getsubmissionByTestId, releaseResult, getCodingTest, releaseCodingResult } from '../data/data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NotificationManager } from 'react-notifications';
const ReactMarkdown = require('react-markdown')
class ViewCodingResult extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            test: {
                questions: []
            },
            users: [],
            queryUsers: [],
            sort: "",
            numericFilter: "",
            singleInput: 0,
            range: {
                from: 0,
                to: 0
            },
            modifiedUser: [],
            isSingle: false,
            isMultiple: false,
            isNumericFilter: false,
            isSort: false,
            submissions: [],
            isAllReleased: false



        }
        this.generateModifiedUsers = this.generateModifiedUsers.bind(this)
        this.onSortChange = this.onSortChange.bind(this);
        this.calculateMarks = this.calculateMarks.bind(this);
        this.calculateFinalMarks = this.calculateFinalMarks.bind(this)
        this.onClickreleaseResult = this.onClickreleaseResult.bind(this);
        this.calculateTotalMarks = this.calculateTotalMarks.bind(this);

    }

    onClickreleaseResult(index, all = false) {
        if (all) {
            var submissions = [];
            var modifiedUser = this.state.modifiedUser;
            modifiedUser.forEach((user) => {
                submissions.push(user.testSubmission);


            })
            releaseCodingResult(this.state.test, this.state.submissions).then((doc) => {
                modifiedUser.forEach((user) => {
                    user.testSubmission.isReleased = true;


                })
                this.setState({ modifiedUser, isAllReleased: true });


            }).catch((err) => {

            }).finally(() => {

            })

        }
        else {
            var submissions = [];
            submissions.push(this.state.modifiedUser[index].testSubmission);
            releaseCodingResult(this.state.test, submissions).then((doc) => {
                var modifiedUser = this.state.modifiedUser;
                modifiedUser[index].testSubmission.isReleased = true;
                this.setState({ modifiedUser });

            }).catch((err) => {

            }).finally(() => {

            })


        }
    }


    generateModifiedUsers() {
        var users = this.state.users;
        var requiredUsers = this.state.test.testFor;
        var newUsers = users.filter((user) => {
            for (var i = 0; i < requiredUsers.length; i++) {
                if (requiredUsers[i] === user.email) {
                    return true;
                }

            }
            return false;
        })

        var submissions = this.state.submissions;
        newUsers.forEach((user) => {
            user['testSubmission'] = {
                isStarted: false,
                email: user.email,
                isReleased: false,
                testId: this.state.test._id
            };
            submissions.forEach((submission) => {
                if (submission.email === user.email) {
                    user['testSubmission'] = submission;
                }
            })
        })
        var isAllReleased = false;
        var notReleased = newUsers.filter((user) => {
            return user.testSubmission.isReleased === false;
        })
        if (notReleased.length === 0) isAllReleased = true;
        var queryUsers = []
        newUsers.forEach((user, index) => {
            queryUsers.push(index)


        })
        console.log(newUsers)

        this.setState({ modifiedUser: newUsers, queryUsers, isAllReleased });
    }
    avgAutoGraded() {
        var modifiedUser = this.state.modifiedUser;
        var marks = 0;
        modifiedUser.forEach((user) => {
            var mark = this.calculateMarks(user.testSubmission) == -1 ? 0 : this.calculateMarks(user.testSubmission);
            marks += mark;
        })
        return Math.round((marks / this.state.modifiedUser.length))

    }
    avgFinal() {
        var modifiedUser = this.state.modifiedUser;
        var marks = 0;
        modifiedUser.forEach((user) => {
            var mark = this.calculateFinalMarks(user.testSubmission) == -1 ? 0 : this.calculateFinalMarks(user.testSubmission);
            marks += mark;
        })
        return Math.round((marks / this.state.modifiedUser.length))
    }

    componentDidMount() {
        this.props.toggleLoading();
        getCodingTest(this.props.match.params.id).then((test) => {
            getsubmissionByTestId(this.props.match.params.id).then((submissions) => {
                getUsers().then((users) => {
                    this.setState({ users, test, submissions }, () => {
                        this.generateModifiedUsers();
                    })

                }).catch((err) => {

                }).finally(() => {
                    this.props.toggleLoading();

                })
            }).catch((err) => {

            }).finally(() => {

            })
        }).catch((err) => {

        }).finally(() => {

        })

    }
    calculateTotalMarks(){
        var marks = 0;
        this.state.test.questions.forEach((question)=>{
            if(question.questionType === "coding"){
                question.testCases.forEach((testCase)=>{
                    marks += parseInt(testCase.points);
                })
 
            }
            else{
                marks += parseInt(question.points);
            }

        })
        return marks;
    }

    calculateMarks(submission) {
        if (submission.isStarted === false) return -1;
        var marks = 0;
        submission.ans.forEach((ans, index) => {
            if(!ans.isSubmitted)return;
           if(ans.questionType === "coding"){
               ans.submission.result.forEach((output,index2)=>{
                   if(output.stderr === ''){
                       if(output.stdout === this.state.test.questions[index].testCases[index2].output)
                       marks += parseInt(this.state.test.questions[index].testCases[index2].points);
                   }
               })

           }
           else{
               marks += parseInt(this.state.test.questions[index].points);
           }
        })
        return marks
    }
    calculateFinalMarks(submission) {
        if (submission.isStarted === false) return -1;
        var marks = 0;
        submission.ans.forEach((ans, index) => {
            if(!ans.isSubmitted)return;
           if(ans.questionType === "coding"){
               ans.submission.result.forEach((output,index2)=>{
                   if(output.stderr === ''){
                      if(output.stdout === this.state.test.questions[index].testCases[index2].output)
                       marks += parseInt(this.state.test.questions[index].testCases[index2].points);
                   }
               })

           }
           else{
               marks += parseInt(ans.finalMarks); 
           }
        })
        return marks
    }
    onSortChange(e) {
        var queryUsers = [];
        var isSingle = false;
        var isMultiple = false;
        var modifiedUser = [...this.state.modifiedUser]

        switch (e.target.value) {
            case "Ran out of time":
                modifiedUser.forEach((user, index) => {
                    if (user['testSubmission'].isStarted === true && (user['testSubmission'].completedOnTime === false || user['testSubmission'].isOver === false))
                        queryUsers.push(index);

                })
                break;
            case "Completed in time":
                modifiedUser.forEach((user, index) => {
                    if (user['testSubmission'].isStarted === true && user['testSubmission'].completedOnTime === true)
                        queryUsers.push(index);

                })
                break;
            case "Did not attempt":
                modifiedUser.forEach((user, index) => {
                    if (user['testSubmission'].isStarted === false) queryUsers.push(index);

                })
                break;
            case "released":
                modifiedUser.forEach((user, index) => {
                    if (user['testSubmission'].isReleased === true) queryUsers.push(index);

                })
                break;
            case "not released":
                modifiedUser.forEach((user, index) => {
                    if (user['testSubmission'].isReleased === false) queryUsers.push(index);

                })
                break;
            case "asc":


                modifiedUser.forEach((user, index) => {
                    user.testSubmission["lolIndex"] = index;

                })

                modifiedUser.sort((user1, user2) => {
                    return (this.calculateFinalMarks(user1.testSubmission) - this.calculateFinalMarks(user2.testSubmission))
                });


                modifiedUser.forEach((user, index) => {
                    // alert(user.testSubmission.lolIndex);

                    queryUsers.push(user.testSubmission.lolIndex);

                })
                break;

            case "desc":
                modifiedUser.forEach((user, index) => {
                    user.testSubmission["lolIndex"] = index;

                })

                modifiedUser.sort((user1, user2) => {
                    return (this.calculateFinalMarks(user2.testSubmission) - this.calculateFinalMarks(user1.testSubmission))
                })
                modifiedUser.forEach((user, index) => {
                    queryUsers.push(user.testSubmission.lolIndex);

                })
                break;
            case "greaterThan":
                modifiedUser.forEach((user, index) => {
                    if (this.calculateFinalMarks(user.testSubmission) > this.state.singleInput) {
                        queryUsers.push(index);
                    }

                })
                isSingle = true;

                break;
            case "lessThan":
                modifiedUser.forEach((user, index) => {
                    if (this.calculateFinalMarks(user.testSubmission) < this.state.singleInput) {
                        queryUsers.push(index);
                    }

                })
                isSingle = true;
                break;
            case "greaterThanEqual":
                modifiedUser.forEach((user, index) => {
                    if (this.calculateFinalMarks(user.testSubmission) >= this.state.singleInput) {
                        queryUsers.push(index);
                    }

                })
                isSingle = true;
                break;
            case "lessThanEqual":
                modifiedUser.forEach((user, index) => {
                    if (this.calculateFinalMarks(user.testSubmission) <= this.state.singleInput) {
                        queryUsers.push(index);
                    }

                })
                isSingle = true;
                break;
            case "isEqual":
                modifiedUser.forEach((user, index) => {
                    if (this.calculateFinalMarks(user.testSubmission) === this.state.singleInput) {
                        queryUsers.push(index);
                    }

                })
                isSingle = true;
                break;
            case "isNotEqual":
                modifiedUser.forEach((user, index) => {
                    if (this.calculateFinalMarks(user.testSubmission) !== this.state.singleInput) {
                        queryUsers.push(index);
                    }

                })
                isSingle = true;
                break;
            case "isBetween":
                modifiedUser.forEach((user, index) => {
                    if (this.calculateFinalMarks(user.testSubmission) >= this.state.range.from && this.calculateFinalMarks(user.testSubmission) <= this.state.range.to) {
                        queryUsers.push(index);
                    }

                })

                isMultiple = true;
                break;
            case "isNotbetween":
                modifiedUser.forEach((user, index) => {
                    if (!(this.calculateFinalMarks(user.testSubmission) >= this.state.range.from && this.calculateFinalMarks(user.testSubmission) <= this.state.range.to)) {
                        queryUsers.push(index);
                    }

                })

                isMultiple = true;
                break;
            default:
                modifiedUser.forEach((user, index) => {
                    queryUsers.push(index)
                })

        }
        this.setState({ sort: e.target.value, queryUsers, isSingle, isMultiple })

    }

    render() {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        if (this.state.test === {}) return null
        return (
            <div id="page-content">



                <div class="container title" style={{marginTop:"120px"}}>

                    {/* <div class="title text-dark">
                        <a href={undefined}><h2 class="blueText mt-5 inline-block">{this.state.test.title}</h2></a>
                        <h3 class="text-muted float-right">{this.state.isAllReleased ? <div></div> : <button onClick ={()=>{
                            this.onClickreleaseResult("sarthak",true)
                        }} className="btn btn-lg text-white rounded-pill bg-info">Release All</button>} </h3>
                    </div>
                    <hr /> */}
                    <div class="mt-5 " >
                        <div class="card  rounded p-3 title">
                        <div class=" text-dark">
                        <a href={undefined}><h2 class="blueText inline-block">{this.state.test.title}</h2></a>
                        <h3 class="text-muted  float-right">{this.state.isAllReleased ? <div></div> : <button onClick ={()=>{
                            this.onClickreleaseResult("sarthak",true)
                        }} className="btn btn-lg text-white rounded-pill bg-info">Release All</button>} </h3>
                    </div>
                    <hr />

                            <div class="px-3">
                                <h5 class="blueText inline-block"> Created Date : </h5>
                                <p class="text-muted inline-block"> {new Date(this.state.test.createdAt).toLocaleDateString("en-US", options)}</p>
                            </div>

                            <div class="px-3">
                                <h5 class="blueText inline-block">Points : </h5>
                                <p class="text-muted inline-block"> {this.calculateTotalMarks()}  Points</p>
                            </div>
                            <div class="px-3">
                                <h5 class="blueText inline-block">Duration : </h5>
                                <p class="text-muted inline-block"> {this.state.test.isTimed ? this.state.test.testTiming : "N/A"}  Mins</p>
                            </div>

                        </div>
                    </div>




                    <div class="my-5">
                        <div class="row">
                            <div class="col-md-5 col-sm-12 mt-3 sorting">
                                <button class="border border-info btn btn-lg btn-block col-6 text-info mx-5 hide"
                                    onClick={() => {
                                        var isSort = this.state.isSort;
                                        this.setState({ isSort: !isSort });

                                    }}
                                >
                                    <i class="fa fa-sort mr-2"></i>
                                Sort
                            </button>
                                {this.state.isSort ?
                                    <div id="sort" class="sort-filter">
                                        <div class="card rounded shadow p-3 col-6 mx-5 mt-1">
                                            <label class="form-check">
                                                <input checked={this.state.sort === "Ran out of time"} value="Ran out of time" onChange={this.onSortChange} class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Ran out of time
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "Completed in time"} value="Completed in time" onChange={this.onSortChange} class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Completed in time
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "Did not attempt"} onChange={this.onSortChange} value="Did not attempt" class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Did not attempt
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "released"} onChange={this.onSortChange} value="released" class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Released
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "not released"} onChange={this.onSortChange} value="not released" class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Not Released
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "desc"} onChange={this.onSortChange} value="desc" class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Descending
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "asc"} onChange={this.onSortChange} value="asc" class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Ascending
                                    </span>
                                            </label>
                                            <label class="form-check">
                                                <input checked={this.state.sort === "clear"} onChange={this.onSortChange} value="clear" class="form-check-input" type="radio" />
                                                <span class="form-check-label">
                                                    Clear
                                    </span>
                                            </label>
                                        </div>
                                    </div>
                                    : <div></div>
                                }

                                <button onClick={() => {
                                    var isNumericFilter = this.state.isNumericFilter;
                                    this.setState({ isNumericFilter: !isNumericFilter });

                                }} class=" border border-info btn btn-lg btn-block col-6 text-info mx-5 mt-1 mb-1"
                                >
                                    <i class="fa fa-filter mr-2"></i>
                                Numeric Filters
                            </button>
                                {this.state.isNumericFilter ?
                                    <div class="card rounded   col-8 mx-5 mt-1 numeric-filter" id="filter">
                                        <article class=" card-group-item">

                                            <div class="filter-content mt-4">
                                                <div class="">
                                                    <div class="custom-control custom-checkbox">

                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "greaterThan"} onChange={this.onSortChange} value="greaterThan" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Greater Than
                                                    </span>
                                                        </label>
                                                    </div>
                                                    <div class="custom-control custom-checkbox">

                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "lessThan"} onChange={this.onSortChange} value="lessThan" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Less Than
                                                    </span>
                                                        </label>
                                                    </div>
                                                    <div class="custom-control custom-checkbox">

                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "greaterThanEqual"} onChange={this.onSortChange} value="greaterThanEqual" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Greater than or equal
                                                    </span>
                                                        </label>
                                                    </div>
                                                    <div class="custom-control custom-checkbox">

                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "lessThanEqual"} onChange={this.onSortChange} value="lessThanEqual" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Less than or equal
                                                    </span>
                                                        </label>
                                                    </div>
                                                    <div class="custom-control custom-checkbox">

                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "isEqual"} onChange={this.onSortChange} value="isEqual" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Is Equal
                                                    </span>
                                                        </label>
                                                    </div>
                                                    <div class="custom-control custom-checkbox">

                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "isNotEqual"} onChange={this.onSortChange} value="isNotEqual" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Is Not Equal
                                                    </span>
                                                        </label>
                                                    </div>
                                                    <div class="custom-control custom-checkbox">

                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "isBetween"} onChange={this.onSortChange} value="isBetween" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Is Between
                                                    </span>
                                                        </label>
                                                    </div>
                                                    <div class="custom-control custom-checkbox">

                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "isNotbetween"} onChange={this.onSortChange} value="isNotbetween" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Is not between
                                                    </span>
                                                        </label>
                                                        <label class="form-check">
                                                            <input checked={this.state.sort === "clear"} onChange={this.onSortChange} value="clear" class="form-check-input" type="radio" />
                                                            <span class="form-check-label">
                                                                Clear
                                                    </span>
                                                        </label>
                                                    </div>


                                                    {this.state.isMultiple ?
                                                        <div>
                                                            <div class="form-group mr-5">
                                                                <label for="exampleInputEmail1">From</label>
                                                                <input onChange={(e) => {
                                                                    var range = this.state.range
                                                                    range.from = parseInt(e.target.value);
                                                                    this.setState({ range }, () => {
                                                                        this.onSortChange({
                                                                            target: {
                                                                                value: this.state.sort
                                                                            }
                                                                        })
                                                                    })
                                                                }}
                                                                    value={this.state.range.from}
                                                                    type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />

                                                            </div>
                                                            <div class="form-group mr-5">
                                                                <label for="exampleInputPassword1">To</label>
                                                                <input onChange={(e) => {
                                                                    var range = this.state.range
                                                                    range.to = parseInt(e.target.value);
                                                                    this.setState({ range }, () => {
                                                                        this.onSortChange({
                                                                            target: {
                                                                                value: this.state.sort
                                                                            }
                                                                        })
                                                                    })
                                                                }}
                                                                    value={this.state.range.to}
                                                                    type="number" class="form-control" id="exampleInputPassword1" />
                                                            </div>
                                                        </div> : <div></div>}

                                                    {this.state.isSingle ?
                                                        <div class="form-group mr-5">
                                                            <label for="exampleInputEmail1">Value</label>
                                                            <input onChange={(e) => {
                                                                var singleInput = this.state.singleInput
                                                                singleInput = parseInt(e.target.value);
                                                                this.setState({ singleInput }, () => {
                                                                    this.onSortChange({
                                                                        target: {
                                                                            value: this.state.sort
                                                                        }
                                                                    })
                                                                })
                                                            }}
                                                                value={this.state.singleInput}
                                                                type="number" class="form-control " id="exampleInputEmail1" aria-describedby="emailHelp" />

                                                        </div>
                                                        : <div></div>

                                                    }





                                                </div>

                                            </div>

                                        </article>
                                    </div>

                                    : <div></div>
                                }
                                <button class="border border-info btn btn-lg btn-block col-6 text-info mx-5 mt-2 mb-5"
                                    onClick={() => {
                                        this.onSortChange({
                                            target: {
                                                value: "clear"
                                            }
                                        })
                                    }}>
                                    Clear
                            </button>
                            </div>
                            <div class="col-md-6 col-sm-12 mb-5">
                                <div class="card rounded p-1 ">
                                    <table class="table text-dark text-center ">
                                        <thead class="bg-light blueText">
                                            <tr>

                                                <th><span>User</span></th>
                                                <th scope="col">Autograded</th>
                                                <th scope="col">Final</th>
                                                <th scope="col">Release</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>

                                                    Average

                                                    </td>
                                                <td>
                                                    {this.avgAutoGraded()}/{this.calculateTotalMarks()}

                                                </td>
                                                <td>
                                                    {this.avgFinal()}/{this.calculateTotalMarks()}

                                                </td>
                                                <td>

                                                </td>
                                            </tr>

                                            {this.state.queryUsers.map((user) => {
                                                // alert(JSON.stringify(this.state.modifiedUser[user]))
                                                return <tr>
                                                    <td>

                                                        <img src={this.state.modifiedUser[user].imageUrl} class="avatar-2"
                                                            alt="" />
                                                        <a className="user-link text-dark padding-top" href={this.state.modifiedUser[user].testSubmission.isStarted === false ? undefined : `/view-coding-test-result-single/${this.state.test._id}/${this.state.modifiedUser[user].testSubmission._id}`}> {(this.state.modifiedUser[user].name === '' || this.state.modifiedUser[user].name === undefined || this.state.modifiedUser[user].name === null )? this.state.modifiedUser[user].email : this.state.modifiedUser[user].name}  </a>

                                                    </td>
                                                    <td>
                                                        <h6 class="text-center">{this.state.modifiedUser[user].testSubmission.isStarted === false ? -1 : this.calculateMarks(this.state.modifiedUser[user].testSubmission)}/{this.calculateTotalMarks()}</h6>
                                                    </td>
                                                    <td>
                                                        <h6 class="text-center">{this.state.modifiedUser[user].testSubmission.isStarted === false ? -1 : this.calculateFinalMarks(this.state.modifiedUser[user].testSubmission)}/{this.calculateTotalMarks()}</h6>
                                                    </td>
                                                    <td>
                                                        <h5 class="text-center">{this.state.modifiedUser[user].testSubmission.isReleased === false ? <div
                                                        ><button onClick={() => { this.onClickreleaseResult(user) }} className="btn btn-success">Release</button></div> :
                                                            <div>
                                                                <span>

                                                                    <span onClick={() => {
                                                                        navigator.clipboard.writeText(`http://hiii-15fdf.web.app/coding-test-result/${this.state.modifiedUser[user].testSubmission._id}`)
                                                                        NotificationManager.info("Link Copied")
                                                                    }} class="badge badge-info mr-2">

                                                                        User
                                                            </span>
                                                                    <span onClick={() => {
                                                                        navigator.clipboard.writeText(`https://sarthak-493c6.web.app/view-coding-test-result-single/${this.state.test._id}/${this.state.modifiedUser[user].testSubmission._id}`)
                                                                        NotificationManager.info("Link Copied")
                                                                    }} class="badge badge-info">

                                                                        Admin
                                                            </span>
                                                                </span>
                                                            </div>}</h5>
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer id="sticky-footer" class="py-4  text-white-50 blueBack fixed-bottom">
                    <div class="container text-center">
                        <small>Copyright &copy; Cryptx</small>
                    </div>
                </footer>
            </div>
        )
    }
}

export default ViewCodingResult;



