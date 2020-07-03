import React from 'react';
import { getCodingTest, getUsers, publishCodingTest } from '../data/data';
import { NotificationManager } from 'react-notifications';
import history from '../components/history';
import Modal from 'react-bootstrap/Modal'
class PublishCodingTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: {
                testFor:[]
            },
            users: [],
            searchUsers: [],
            isSelectAll: false,
            showModal: false

        }
        this.selectAll = this.selectAll.bind(this)
        this.searchQuery = this.searchQuery.bind(this)
    }
    componentDidMount() {
        this.props.toggleLoading();
        getCodingTest(this.props.match.params.id).then((test) => {
            getUsers().then((users) => {
                this.setState({ users, test, searchUsers: users });
            })
            // this.setState({ test });


        }).catch((err) => {
            NotificationManager.error("Error connecting to server..!");
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
    onPublishTest() {
        this.props.toggleLoading();
        var test = this.state.test;
        test['status'] = "published";
        publishCodingTest(test).then((doc) => {
            history.push('/coding-tests');
            window.location.reload();

        }).catch((err) => {
            NotificationManager.error("Error connecting to server..!");

        }).finally(() => {
            this.props.toggleLoading();
        })
    }
    searchQuery(e) {

        var searchUsers = this.state.users.filter((user) => {
            return (user.name !== null && user.name.toLowerCase().includes(e.target.value.toLowerCase()));
        })
        this.setState({ searchUsers })
    }
    selectAll(e) {
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
        
        return (
            <div style={{ marginTop: "80px" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-8">
                            <h4>{this.state.test.title}</h4>
                            <hr className="hr" />
                        </div>
                        <div className="col-4">
                            <button onClick ={()=>{
                                this.setState({showModal:true})



                            }} className="btn btn-outline-info">
                                Publish
                            </button>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <h6>Test Desciption</h6>
                            <p>This International Dance Day, an event management company organized an evening of Indian classical dance performances to celebrate the rich, eloquent, and elegant art of dance. Post the event, the company planned to create a microsite to promote and raise awareness among the public about these dance forms. However, identifying them from images is a tough nut to crack.

You have been appointed as a Machine Learning Engineer for this project. Build an image tagging Deep Learning model that can help the company classify these images into eight categories of Indian classical dance.</p>
                            <hr className="" />
                        </div>
                        <div className="col-4">

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <div className="card mb-5">
                                <div className="card-header">
                                    <input onChange={this.searchQuery} placeholder="Search Students" className="form-control w-100" />
                                </div>
                                <div style={{ maxHeight: "300px", overflowY: "auto" }} className="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"><input onChange={this.selectAll} checked={this.state.selectAll} className="form-check-control" type="checkbox" /></th>
                                                <th scope="col">Profile Image</th>
                                                <th scope="col">Name</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.searchUsers.map((user, index) => {
                                                var isChecked = this.state.test.testFor.find((email) => email === user.email) !== undefined
                                                return <tr>
                                                    <th scope="row"><input onChange={(e) => { this.addRemoveUser(user) }} checked={isChecked} className="form-check-control" type="checkbox" /></th>
                                                    <td>  <img style={{ height: "30px" }} class="rounded-circle mr-3" src={user.imageUrl} /></td>
                                                    <td>{user.name}</td>

                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                < Modal size="lg" centered={true} show={this.state.showModal} onHide={() => { this.setState({ showModal: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Publish Test </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container text-center">
                            <div class="row">
                                <div style={{ maxHeight: "300px", overflowY: "auto" }} className="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Profile Image</th>
                                                <th scope="col">Name</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.test.testFor.map((user, index) => {
                                                var userDetail = this.state.users.find((u) => {
                                                    return u.email === user;
                                                })

                                                return <tr>
                                                    <th scope="row"><img style={{ height: "30px" }} class="rounded-circle mr-3" src={userDetail.imageUrl} /></th>
                                                    <td>{userDetail.name}</td>

                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={() => { this.onPublishTest(); this.setState({ showModal: false }) }} className="btn text-white filter">Publish</button>
                    </Modal.Footer>
                </Modal>
            </div>
        )

    }
}
export default PublishCodingTest;