import React from 'react';
import "../assets/css/login.css"

import { superLogin } from "../data/data"
import { reactLocalStorage } from 'reactjs-localstorage';
import { NotificationContainer, NotificationManager } from 'react-notifications';
class SuperLogin extends React.Component {
    state = {
        userName: "",
        password: ""
    }

    constructor(props) {
        super(props)
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleUserNameChange(event) {
        this.setState({ userName: event.target.value })

    }
    handlePasswordChange(event) {
        this.setState({ password: event.target.value })

    }
    handleFormSubmit(event) {
        event.preventDefault();
        this.props.toggleLoading();
        superLogin(this.state.userName.trim(), this.state.password.trim()).then((data) => {
            this.props.toggleLoading();
            if (data.success === true) {
                reactLocalStorage.set("isSuperLogin", true);
                reactLocalStorage.set("superUser", data.userName);
                reactLocalStorage.set("superPass", data.password);
                window.location.reload();
            }
            else {
                NotificationManager.error("Invalid Details")
                return;

            }

        }).catch((err) => {
            this.props.toggleLoading();
            NotificationManager.error("Error connecting to server!")

        }).finally(() => {


        })
    }


    render() {
        return (

            <div class="container-outer pl-0">
                <div class="wrap-login100 pl-0">
                    <div class="inner pl-0">
                        <div class="login100-form pl-0" >
                            <span class="login100-form-title ml-4">Cryptx</span>
                            <div class="container pl-0">
                                <form onSubmit={this.handleFormSubmit} class="">
                                    <div class="wrap-input100 pl-0">

                                        {/* <label for="exampleInputEmail1" class="label">Username</label> */}

                                        <input onChange={this.handleUserNameChange} type="text" class="form-control input100" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter your Username" />
                                        {/* <small id="emailHelp" class="form-text text-muted">We'll never share your details with anyone.</small> */}
                                    </div>
                                    <div class="form-group">
                                        {/* <label for="exampleInputPassword1" class="label">Password</label> */}
                                        <input onChange={this.handlePasswordChange} type="password" class="form-control input100 " id="exampleInputPassword1" placeholder="Enter your Password" />
                                    </div>
                                    <button type="submit" class="btn login100-form-btn ml-4">Submit</button>
                                    <div className="mt-3 ml-5 text-center"> <a className="text-mute text-dark" href="/login">Login as Admin</a></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </div>

        )
    }
}
export default SuperLogin;
