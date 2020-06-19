import React from 'react';
import { getSubTopic, getUsers } from '../data/data'
const ReactMarkdown = require('react-markdown')
class Dscore extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            deliverable: {},
            users: [],
            queryUsers: [],
            sort: "",
            numericFilter: "",
            singleInput: 0,
            range: {
                from: 0,
                to: 0
            },
            isSingle: false,
            isMultiple: false,


        }
        this.fillUsers = this.fillUsers.bind(this)
        this.onSortChange = this.onSortChange.bind(this);
        this.avg = this.avg.bind(this);
    }


    fillUsers(users) {
        var modifiedUser = []
        users.forEach((user) => {
            var submission = user.submissions.filter((val) => {
                return val.subTopicId == this.state.deliverable.subTopicId;
            })
            var temp = submission.length ? submission[0] : {};
            var points = temp.points === undefined ? 0 : temp.points;
            var isMarked = temp.points === undefined ? false : true;
            var isSubmitted = submission.length ? true : false;
            var isLate = false;
            var due = new Date(this.state.deliverable.due);
            if (isSubmitted) {
                var createdAt = new Date(temp.createdAt);
                if (createdAt > due) isLate = true;

            }
            else {
                var today = new Date();
                if (today > due) isLate = true;

            }

            if (temp[points] != undefined) points = temp.points;

            modifiedUser.push({
                points,
                isMarked,
                isSubmitted,
                isLate,
                name: user.name == "" ? "cryptx" : user.name,
                imageUrl:user.imageUrl==="" || user.imageUrl===undefined?"https://bootdey.com/img/Content/user_1.jpg":user.imageUrl,

            });
            // alert(JSON.stringify(modifiedUser))
            this.setState({ users: modifiedUser, queryUsers: modifiedUser })

        })
       

    }
    avg(){
        var sum = 0;
        this.state.users.forEach((user)=>{
            sum+=user.points;
        })
        // alert(sum)

        return Math.round(sum/(this.state.deliverable.points*this.state.users.length))
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
    onSortChange(e) {
        var queryUsers;
        var isSingle = false;
        var isMultiple = false;

        switch (e.target.value) {
            case "late":
                queryUsers = this.state.users.filter((user) => {
                    return user.isLate === true;
                })
                break;
            case "unmarked":
                queryUsers = this.state.users.filter((user) => {
                    return user.isMarked === false;
                })
                break;
            case "notSubmitted":
                queryUsers = this.state.users.filter((user) => {
                    return user.isSubmitted === false;
                })
                break;
            case "asc":
                queryUsers =[...this.state.users];
                queryUsers.sort((user1, user2) => {
                    return user1.points >= user2.points

                })
                break;

            case "desc":
                queryUsers = [...this.state.users];
                queryUsers.sort((user1, user2) => {
                    return user1.points <= user2.points

                })
                break;
            case "greaterThan":
                queryUsers = this.state.users.filter((user) => {
                    return user.points > this.state.singleInput;
                })
                isSingle = true;

                break;
            case "lessThan":
                queryUsers = this.state.users.filter((user) => {
                    return user.points < this.state.singleInput;
                })
                isSingle = true;
                break;
            case "greaterThanEqual":
                queryUsers = this.state.users.filter((user) => {
                    return user.points >= this.state.singleInput;
                })
                isSingle = true;
                break;
            case "lessThanEqual":
                queryUsers = this.state.users.filter((user) => {
                    return user.points <= this.state.singleInput;
                })
                isSingle = true;
                break;
            case "isEqual":
                queryUsers = this.state.users.filter((user) => {
                    return user.points === this.state.singleInput;
                })
                isSingle = true;
                break;
            case "isNotEqual":
                queryUsers = this.state.users.filter((user) => {
                    return user.points !== this.state.singleInput;
                })
                isSingle = true;
                break;
            case "isBetween":
                queryUsers = this.state.users.filter((user) => {
                    return user.points >= this.state.range.from && user.points <= this.state.range.to;
                })
                isMultiple = true;
                break;
            case "isNotbetween":
                queryUsers = this.state.users.filter((user) => {
                    return !(user.points >= this.state.range.from && user.points <= this.state.range.to);
                })
                isMultiple = true;
                break;
            default:
                queryUsers = this.state.users;

        }
        this.setState({ sort: e.target.value, queryUsers, isSingle, isMultiple })

    }

    render() {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return (
            <div id="page-content">



                <div class="container ">

                    <div class="title text-dark ">
                        <h2 class="details text-monospace inline-block">{this.state.deliverable.title}</h2>
                        <h3 class="text-muted float-right"> X {this.state.deliverable.points} Points</h3>
                    </div>

                    <div class="mt-5">
                        <div class="card shadow-lg rounded p-3">
                            <div class="px-3">
                                <h5 class="details2 text-monospace inline-block">Description : </h5>
                                <p class="text-muted inline-block">
                                    <ReactMarkdown escapeHtml={false} source={this.state.deliverable.instruction} />
                                </p>
                            </div>

                            <div class="px-3">
                                <h5 class="details2 text-monospace inline-block">Due Date : </h5>
                                <p class="text-muted inline-block"> {new Date(this.state.deliverable.due).toLocaleDateString("en-US", options)}</p>
                            </div>

                            <div class="px-3">
                                <h5 class="details2 text-monospace inline-block">Points : </h5>
                                <p class="text-muted inline-block"> {this.state.deliverable.points} Points</p>
                            </div>

                        </div>
                    </div>




                    <div class="my-5">
                        <div class="row">
                            <div class="col-md-6 col-sm-12 mt-5 sorting">
                                <button class="filter btn btn-lg btn-block col-6 text-white mx-5 hide"
                                    onclick="toggle_visibility('sort');">
                                    <i class="fa fa-sort mr-2"></i>
                                Sort
                            </button>
                                <div id="sort" class="sort-filter">
                                    <div class="card rounded shadow p-3 col-6 mx-5 mt-1">
                                        <label class="form-check">
                                            <input checked={this.state.sort === "unmarked"} value="unmarked" onChange={this.onSortChange} class="form-check-input" type="radio" />
                                            <span class="form-check-label">
                                                Unmarked
                                            </span>
                                        </label>
                                        <label class="form-check">
                                            <input checked={this.state.sort === "late"} value="late" onChange={this.onSortChange} class="form-check-input" type="radio" />
                                            <span class="form-check-label">
                                                Late
                                            </span>
                                        </label>
                                        <label class="form-check">
                                            <input checked={this.state.sort === "notSubmitted"} onChange={this.onSortChange} value="notSubmitted" class="form-check-input" type="radio" />
                                            <span class="form-check-label">
                                                Not Submitted
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
                                <button class="filter btn btn-lg btn-block col-6 text-white mx-5 mt-5 mb-1"
                                    onclick="toggle_visibility('filter');">
                                    <i class="fa fa-filter mr-2"></i>
                                Numeric Filters
                            </button>
                                <div class="card rounded   p-2 col-8 mx-5 mt-1 numeric-filter" id="filter">
                                    <article class=" card-group-item">

                                        <div class="filter-content">
                                            <div class="card-body">
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

                                                {/* <form> */}
                                                {this.state.isMultiple ?
                                                    <div>
                                                        <div class="form-group">
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
                                                            value ={this.state.range.from}
                                                            type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />

                                                        </div>
                                                        <div class="form-group">
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
                                                            value ={this.state.range.to}
                                                             type="number" class="form-control" id="exampleInputPassword1" />
                                                        </div>
                                                    </div> : <div></div>}

                                                {this.state.isSingle ?
                                                    <div class="form-group">
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
                                                        value ={this.state.singleInput}
                                                        type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />

                                                    </div>
                                                    : <div></div>

                                                }





                                            </div>

                                        </div>

                                    </article>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12 ">
                                <div class="card rounded p-1 user-table">
                                    <table class="table text-light text-center bgGradient">
                                        <thead class="bg-light details">
                                            <tr>

                                                <th><span>User</span></th>
                                                <th scope="col">Score</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><h6 class="user-link padding-top">Average</h6></td>
                                                <td>
                                                    {this.avg()}
                                                </td>
                                            </tr>
                                            {this.state.queryUsers.map((user) => {
                                                return <tr>
                                                    <td>
                                                        <img src={user.imageUrl} class="avatar-2"
                                                            alt="" />
                                                        <h6 class="user-link padding-top">{user.name}</h6>

                                                    </td>
                                                    <td>
                                                        <h6 class="text-center">{user.points}</h6>
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
                <footer id="sticky-footer" class="py-4 bg-dark text-white-50 bgGradient">
                    <div class="container text-center">
                        <small>Copyright &copy; Cryptx</small>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Dscore;