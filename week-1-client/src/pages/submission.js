import React, { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { getUsers, getSubTopic, UpdateUser } from '../data/data'
import SelectSearch from 'react-select-search';


class Submission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            deliverable: {
                title: "lol",
            },
            currentIndex: 0,
        }

        this.chnageUser = this.chnageUser.bind(this);
        this.moveUser = this.moveUser.bind(this);
        this.fillUsers = this.fillUsers.bind(this);
    }

    fillUsers(users) {
        var modifiedUsers = [];
        var currentIndex = 0;
        var i = 0;
        users.forEach((user) => {
            if (user.email === this.props.match.params.email) {
                currentIndex = i;
            }
            else {
                i += 1;
            }
            var submission = user.submissions.filter((val) => {
                return val.subTopicId == this.state.deliverable.subTopicId;
            })
            var temp = submission.length ? submission[0] : {}
            // alert(JSON.stringify(temp))
            modifiedUsers.push({
                name: user.name == "" ? "cryptx" : user.name,
                email: user.email,
                subTopicId: submission.length ? submission[0].subTopicId : "",
                isSubmitted: submission.length > 0,
                imageUrl: user.imageUrl === "" || user.imageUrl === undefined ? "https://bootdey.com/img/Content/user_1.jpg" : user.imageUrl,
                submissionStatus: this.currentSubmission(user),
                points: (submission.length && submission[0]['points'] != undefined) ? submission[0].points : 0,
                isMarked:(submission.length && submission[0]['points'] != undefined) ? true : false,
                submission: temp

            })
        })
        this.setState({ users: modifiedUsers, currentIndex });

    }


    currentSubmission(user) {
        var submission = user.submissions.filter((val) => {
            return val.subTopicId == this.state.deliverable.subTopicId;
        })
        if (submission.length) {

            if (submission[0].createdAt > this.state.deliverable.due) {
                return "Handed in Done late"
            }
            else {
                return "Handed In"
            }

        }
        else {

            var today = new Date();
            var due = new Date(this.state.deliverable.due)
            if (due < today) {

                return "Missing"
            }
            else {
                return ""
            }
        }
    }
    componentDidMount() {
        this.props.toggleLoading();
        getSubTopic(this.props.match.params.id, "deliverable").then((deliverable) => {
            getUsers().then((users) => {
                this.setState({ deliverable }, () => {
                    this.fillUsers(users)
                })


            }).finally(() => {
                this.props.toggleLoading();
            })

        })
    }
    moveUser(direction) {
        var index = this.state.currentIndex
        var users = this.state.users;
        if (direction == "left") {
            if (index === 0) return;
            this.setState({ currentIndex: index - 1 });

        }
        else {
            if (index === users.length - 1) return;
            this.setState({ currentIndex: index + 1 })

        }
    }
    chnageUser(index) {
        var users = this.state.users;
        this.setState({ currentIndex: index });


    }
    calculate(type) {
        return this.state.users.filter((user) => {
            return user.submissionStatus === type;
        }).length;
    }
    render() {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        if (this.state.users.length === 0) return <div><div className="preloader"></div></div>;

        return (


            <div id="page-content">



                <div class="container ">

                    <div class="title text-dark ">
                        <h2 class="details text-monospace inline-block">{this.state.deliverable.title}</h2>
                        <h5 class="text-muted inline-block ml-3"> X {this.state.deliverable.points} Points</h5>
                        <h3 class="float-right details2 ml-5">
                            <i onClick={() => { this.moveUser("left") }} class="fa fa-chevron-left mr-2"></i>
                            <i onClick={() => { this.moveUser("right") }} class="fa fa-chevron-right"></i></h3>
                    </div>
                    <hr/>
                    <div class="ml-3 mt-5 ">
                        <div class="dropdown ">
                            <button class="btn shadow dropdown-toggle col-4 bgWhite" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img style={{ height: "30px" }} class="rounded-circle float-left" src={this.state.users[this.state.currentIndex].imageUrl} />
                                <span class="details mx-3 ">{this.state.users[this.state.currentIndex].name}</span>
                                <span class="badge badge-secondary  bgPink ">{this.state.users[this.state.currentIndex].submissionStatus}</span>

                            </button>
                            <div class="dropdown-menu mt-1 col-4" aria-labelledby="dropdownMenuButton"
                                style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {this.state.users.map((user, index) => {
                                    var outline;
                                    if (user.submissionStatus === "Missing") outline = "badge-danger";
                                    else if (user.submissionStatus === "Handed in Done late") outline = "badge-warning"
                                    else outline = "badge-success";
                                    return (<div><a onClick={() => { this.chnageUser(index) }} class="dropdown-item  " href="#">

                                        <img style={{ height: "30px" }} class="rounded-circle" src={user.imageUrl} />
                                        <span class="details mx-3">{user.name}</span>
                                        <span className={`badge float-right ${outline} ml-2 `}>{user.submissionStatus}</span>

                                    </a>
                                        <hr />
                                    </div>)

                                })}





                            </div>
                        </div>
                        
                    </div>
                   

                    <div class="row my-5">
                        <div class="col-4 mt-5">
                            <span className="ml-2">Files </span><br />
                            {this.state.users[this.state.currentIndex].isSubmitted ?
                                <h5><span class="text-muted text-truncate badge mb-5 ">Handed on {new Date(this.state.users[this.state.currentIndex].submission.createdAt).toLocaleDateString("en-US", options)}</span></h5> :
                                <h5><span class="text-muted badge mb-5 ">N/A</span></h5>
                            }

                            <h4><span class=" text-center details2 ">Marks</span></h4>
                            <input
                                onChange={(e) => {
                                    UpdateUser(this.state.users[this.state.currentIndex].email, parseInt(e.target.value), this.state.users[this.state.currentIndex].subTopicId)
                                    var users = this.state.users;
                                    users[this.state.currentIndex].points = parseInt(e.target.value);
                                    this.setState({ users })

                                }}
                                disabled={!this.state.users[this.state.currentIndex].isSubmitted} value={this.state.users[this.state.currentIndex].points} type="number" class="text-center form-control col-6 inline-block" />
                            <button class="btn btn-success bgGradient col-4 mr-3 float-right">{this.state.users[this.state.currentIndex].isMarked?"Update":"Set"}</button>
                        </div>
                        <div class="col-4">
                            <div class="w-100 rounded  card">
                                <img src={this.state.users[this.state.currentIndex].isSubmitted ? "https://thomashueblonline.com/wp-content/uploads/2017/01/zip-file-icon.jpg" : "https://img.favpng.com/14/12/17/warning-sign-hazard-symbol-warning-label-png-favpng-36YMUPNeu9W0P0yPVW7FpXqBG.jpg"} class="card-img-top img-thumbnail " />
                                <div class="card-header text-center">
                                    {this.state.users[this.state.currentIndex].submission.fileName}
                                </div>
                                <div class="card-footer text-center">
                                    <a class="mr-2" href={this.state.users[this.state.currentIndex].submission.fileUrl} >Download </a>
                                </div>

                            </div>

                        </div>
                        <div class="col-4 ">
                            <div class="card shadow">
                                <h4 class="details text-monospace text-center p-4">Deliverable Stats</h4>
                                <hr />

                                <PieChart style={{ maxHeight: 180 }} className="card-img-top p-3"
                                    data={[
                                        { title: 'Late', value: this.calculate("Handed in Done late"), color: '#f0ad4e' },
                                        { title: 'Missing', value: this.calculate("Missing"), color: '#d9534f' },
                                        { title: 'Handed In', value: this.calculate("Handed In"), color: '#5cb85c' },
                                        { title: 'Not Submitted', value: this.calculate(""), color: '#f7f7f7' },
                                    ]}
                                />;


                            </div>

                        </div>
                    </div>
                    {this.state.users[this.state.currentIndex].submission.comment === "" || this.state.users[this.state.currentIndex].submission.comment === undefined
                        ?<div></div>:
                        <div>
                            <div class="p-2 row">
                                <div class="col-md-1">
                                    <img class="mr-3 rounded" style={{ height: "40px" }} src={this.state.users[this.state.currentIndex].imageUrl} />
                                </div>
                                <div class="col-md-8">
                                    <div class="row">
                                        <span class="details">{this.state.users[this.state.currentIndex].name}</span>
                                    </div>
                                    <div class="row">
                                        <span class="text-muted">{this.state.users[this.state.currentIndex].submission.comment}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3 mb-5 row col-8">
                                <div class="col-md-11">
                                    <input placeholder="Reply to private comment" class="form-control" />
                                </div>
                                <div class="col-md-1">
                                    <i style={{ fontSize: "30px" }} class="mr-5 fa fa-paper-plane"></i>

                                </div>

                            </div>
                        </div>
           
                    }
                    
                </div>

            </div>);
    }
}
export default Submission;