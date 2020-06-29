import React from 'react';
import { getUsers, getTest, publishTest } from '../data/data';
import history from '../components/history';
import Modal from 'react-bootstrap/Modal'
class Publish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searchUsers: [],
            test: null,
            isSelectAll: false,
            publishModal: false
        }
        this.addRemoveUser = this.addRemoveUser.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.searchQuery = this.searchQuery.bind(this);
        this.onPublishTest = this.onPublishTest.bind(this);
    }
    componentDidMount() {
        this.props.toggleLoading();
        getUsers().then((users) => {
            console.log(JSON.stringify(users))
            getTest(this.props.match.params.id).then((test) => {
                console.log(JSON.stringify(test))
                this.setState({ test, users, searchUsers: users })
            })
        }).catch((err) => {
            console.log(err)

        }).finally(() => {
            this.props.toggleLoading();
        })

    }
    addRemoveUser(user) {
        var test = this.state.test
        var isChecked = test.testFor.find((email) => email === user.email) !== undefined
        if (isChecked) {
            var index = test.testFor.indexOf(user.email);
            if (index !== -1) test.testFor.splice(index, 1);
            this.setState({ test });

        }
        else {
            test.testFor.push(user.email);
            this.setState({ test });

        }

    }
    searchQuery(e) {
        var searchUsers = this.state.users.filter((user) => {
            return user.name.toLowerCase().includes(e.target.value.toLowerCase());
        })
        this.setState({ searchUsers })
    }
    onPublishTest() {
        this.props.toggleLoading();
        var test = this.state.test;

        test["status"] = "published"
        publishTest(test).then((doc) => {

            history.push("/tests");
            window.location.reload();

        }).catch((err) => {
            alert(err);
        }).finally(() => {
            this.props.toggleLoading();

        })
    }
    selectAll() {
        var test = this.state.test;
        var isSelectAll = !this.state.isSelectAll;
        if (isSelectAll) {
            test.testFor = []
            var users = this.state.users;
            users.forEach((user) => {
                test.testFor.push(user.email);
            })
            this.setState({ users, isSelectAll })

        }
        else {
            test.testFor = []
            this.setState({ test, isSelectAll });
        }
    }
    render() {
        if (this.state.test === null) return null;

        return (
            <div class="container mb-5 ">

                <div class="title text-center">
                    <h2 class="details  inline-block font-weight-bold">{this.state.test.title}</h2>

                </div>

                <div class="mt-5">
                    <div class="card shadow-lg rounded p-3">
                        <div class="row text-dark ml-4 my-4">
                            <div class="col-6"><h3 class="details2 text-monospace inline-block font-weight-bold">STUDENTS</h3></div>
                            <div class="col-6">
                                <button onClick={() => { this.setState({ publishModal: true }) }} class="btn btn-success bgGradient col-3 mr-3 float-right">PUBLISH</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 px-5 text-center">
                                <div class="form-check" >
                                    <input onChange={(e) => { this.selectAll() }} checked={this.state.isSelectAll} class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                    <label class="form-check-label details" for="defaultCheck1" >
                                        Select All
                                </label>
                                </div>
                            </div>
                            <div class="col-md-8 ">
                                <form className="form" method="post" >
                                    <input onChange={this.searchQuery} type="text" class="textbox" placeholder="Search" />
                                    <input title="Search" value="" type="submit" class="button" />
                                </form>

                            </div>

                        </div>
                        <div class="row mt-5">
                            <div class="col-3"></div>
                            <div class="col-6 ">
                                <div class="card p-1 user-table">
                                    <div class="list-group checkbox-list-group">
                                        {this.state.searchUsers.map((user, index) => {
                                            var isChecked = this.state.test.testFor.find((email) => email === user.email) !== undefined
                                            return <div class="list-group-item">
                                                <label>
                                                    <input onChange={(e) => { this.addRemoveUser(user) }} checked={isChecked} type="checkbox" />
                                                    <span class="list-group-item-text">
                                                        <i class="fa fa-fw"></i>
                                                        <img style={{ height: "30px" }} class="rounded-circle mr-3" src={user.imageUrl === "" ? "https://api.adorable.io/avatars/285/abott@adorable.png" : user.imageUrl} />{user.name === "" ? "Cryptx" : user.name}
                                                    </span>
                                                </label>
                                            </div>
                                        })}


                                    </div>

                                </div>
                            </div>

                            <div class="col-3"></div>
                        </div>


                    </div>
                </div>


                < Modal size="lg" centered={true} show={this.state.publishModal} onHide={() => { this.setState({ publishModal: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Publish Test </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container text-center">
                            <div class="row mt-5">
                                {/* <div class="col-3"></div> */}
                                <div class="col-12 ">
                                    <div class="card p-1 user-table text-left">
                                        <div class="list-group checkbox-list-group">
                                            {this.state.test.testFor.map((user, index) => {
                                                var userDetail = this.state.users.find((u) => {
                                                    return u.email === user;
                                                })

                                                return <div class="list-group-item">
                                                    <label>
                                                        <span class="list-group-item-text">
                                                            <i class="fa fa-fw"></i>
                                                            <img style={{ height: "30px" }} class="rounded-circle mr-3" src={userDetail.imageUrl === "" ? "https://api.adorable.io/avatars/285/abott@adorable.png" : userDetail.imageUrl} />{userDetail.name === "" ? "Cryptx" : userDetail.name}
                                                        </span>
                                                    </label>
                                                </div>
                                            })}


                                        </div>

                                    </div>
                                </div>

                                {/* <div class="col-3"></div> */}
                            </div>

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={() => { this.onPublishTest(); this.setState({ publishModal: false }) }} className="btn text-white filter">Publish</button>
                    </Modal.Footer>
                </Modal>



            </div>
        );
    }
}

export default Publish;