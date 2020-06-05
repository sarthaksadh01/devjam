import React from 'react';
import { createAdmin, getAllAdmins, removeAdmin } from "../data/data"
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Modal from 'react-bootstrap/Modal'
import "../assets/css/superAdmin.css"
class SuperAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            admins: [],
            userName: "",
            password: "",
            show: false
        }
        this.onFormSumbit = this.onFormSumbit.bind(this);
        this.onUserNameChange = this.onUserNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }

    onUserNameChange(event) {
        this.setState({ userName: event.target.value });
    }
    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }
    onFormSumbit(event) {
        event.preventDefault();
        if (this.state.userName.length < 6) {
            NotificationManager.error("Username Too short");
            return;
        }
        if (this.state.password.length < 6) {
            NotificationManager.error("Password Too short");
            return
        }
        this.setState({show:false})
        this.props.toggleLoading("Creating Admin")
        createAdmin(this.state.userName, this.state.password).then((doc) => {
            var admins = this.state.admins;
            admins.push(doc);
            this.setState({admins})
            NotificationManager.success("Admin created");

        }).catch((err) => {
            NotificationManager.error("Username already taken");
        }).finally(() => {
            this.props.toggleLoading("Creating Admin")

        })

    }

    onRemove(index) {
        this.props.toggleLoading("Removing Admin")
        removeAdmin(this.state.admins[index].userName).then((doc) => {
            this.setState(this.state.admins.splice(index,1))
            NotificationManager.success("Admin Removed");

        }).catch((err) => {
            NotificationManager.error("Error connecting to server");
        }).finally(() => {
            this.props.toggleLoading("Removing Admin")

        })
    }
    componentDidMount() {
        getAllAdmins().then((data) => {
            this.setState({ admins: data });
        })

    }

    render() {
        return (<div>
            <NotificationContainer />
            <div class="mt-5 container">

                <div class="bg-white borderT jumbotron">
                    <h1 class="display-4">Super Admin Panel</h1>
                    {/* <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p> */}
                    <hr class="my-4" />
                    <p>Create and remove admins from here.</p>
                    <a onClick={()=>{this.setState({show:true})}} class="btn btn-success create-button rounded-pill btn-lg" href="#" role="button">Create</a>
                    <a class="ml-2 rounded-pill shadow btn create-button btn-danger btn-lg" href="#" role="button">Logout</a>
                </div>


                <div className="row">
                    <div className="text-center col-md-12">
                        <table class="text-center table-responsive-sm table">
                            <thead class="thead-dark">
                                <tr className="text-white">
                                    <th scope="col">#</th>
                                    <th scope="col">UserName</th>
                                    <th scope="col">Hashed UserName</th>
                                    <th scope="col">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.admins.map((value, index) => {
                                    return <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{value.name}</td>
                                        <td className="text-truncate">{value.userName}</td>
                                        <td> <button onClick={() => { this.onRemove(index) }} className="btn create-button btn-danger">Remove</button> </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>

            < Modal show={this.state.show} onHide={() => { this.setState({ show: false }) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.onFormSumbit}>
                        <div class="form-group">
                            <label for="exampleInputEmail1">UserName</label>
                            <input value={this.state.userName} onChange={this.onUserNameChange} type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input value={this.state.password} onChange={this.onPasswordChange} type="password" class="form-control" id="exampleInputPassword1" />
                        </div>
                        <button type="submit" class="btn create-button btn-primary">Create</button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" onClick={handleClose}>
                        Close
          </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Create
          </Button> */}
                </Modal.Footer>
            </Modal>


        </div>)
    }





}

export default SuperAdmin