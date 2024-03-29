/*
This file contains Signup functionalities
and Signup UI.

Signup can be done through :
1. Github
2. Google
3. Manually

*/

import React from 'react';

import { reactLocalStorage } from 'reactjs-localstorage';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import GitHubLogin from 'react-github-login';
import GoogleLogin from 'react-google-login';
import { faPlayCircle, faEllipsisH, faPlus, faLongArrowAltRight, faGhost } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signupWithEmailPassword, createAccount } from '../data/data';
var validator = require("email-validator");
class Signup extends React.Component {
    state = {
        userName: "",
        password: "",
    }

    constructor(props) {
        super(props)
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.googleLogin = this.googleLogin.bind(this);
        this.githubLogin = this.githubLogin.bind(this);
    }

    handleUserNameChange(event) {
        this.setState({ userName: event.target.value })

    }
    handlePasswordChange(event) {
        this.setState({ password: event.target.value })

    }
    toggleLoginPage() {
        var loginPage = this.state.loginPage;
        loginPage = !loginPage;
        this.setState({ loginPage })
    }

   

    handleFormSubmit(event) {
        event.preventDefault();
        var email = this.state.userName.trim();
        if(!validator.validate(email)){
            NotificationManager.error("Invalid Email");
            return;

        }
        if (this.state.password.trim().length < 6) {
            NotificationManager.error("Password too short!");
            return;

        }
        this.props.toggleLoading();
        var data = {
            email: this.state.userName,
            password: this.state.password,
            isSocialLogin: false
        }
        createAccount(data).then((res) => {
            if (res.success) {
                NotificationManager.success("Success..!");
                reactLocalStorage.setObject('user', { email: this.state.userName, imageUrl: "", isSocialLogin: false, isLoggedin: true });
                window.location.reload();

            }
            else {
                NotificationManager.error(res.err);
            }
        }).catch((err) => {
            NotificationManager.error("Server Error!");
        }).finally(() => {
            this.props.toggleLoading();

        })


    }
    googleLogin(res, error = false) {
        if (error) {
            this.props.toggleLoading();
            NotificationManager.error("Error login in!")

        } else {
            var data = {
                email: res.profileObj.email,
                name: res.profileObj.name,
                imageUrl: res.profileObj.imageUrl,
                isSocialLogin: true
            }
            createAccount(data).then((res2) => {
                if (res2.success) {
                    NotificationManager.success("Success..!");
                    reactLocalStorage.setObject('user', { email: res.profileObj.email, imageUrl: res.profileObj.imageUrl, isSocialLogin: true, isLoggedin: true });
                    window.location.reload();

                }
                else {
                    NotificationManager.error(res2.err);
                }
            }).catch((err) => {
                NotificationManager.error("Server Error!");
            }).finally(() => {
                this.props.toggleLoading();

            })


        }


    }
    githubLogin(data) {

    }


    render() {
        return (

            <div class="container-outer bg-dark">
                <div class="inner">
                    <div className="shadow round p-5  card">
                        <div className="text-center mb-3 "> <h3 className="heading">Cryptx</h3></div>
                        <form onSubmit={this.handleFormSubmit}>
                            <div class="form-group">
                                <label for="exampleInputEmail1"></label>
                                <input  class="mx-auto pl-4"onChange={this.handleUserNameChange} value={this.state.userName} type="email" placeholder="Email" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1"></label>
                                <input  class="mx-auto pl-4"onChange={this.handlePasswordChange} value={this.state.password} type="password" placeholder="Password" id="exampleInputPassword1" />
                            </div>

                            <div className="col-sm-12 text-center">
                                <button type="submit" class="rounded-pill text-center submit">Signup</button>
                            </div>

                        </form>

                        <div className="row mr-3 mt-2 text-center">
                            <div className="col-sm-12 ">

                                <GoogleLogin
                                    clientId="826597553367-h6f2fi709f0586pfse1f0pgld1dukqlo.apps.googleusercontent.com"
                                    buttonText=""
                                    render={renderProps => (
                                        <button type="button" className="btn mr-1 text-danger " onClick={() => { this.props.toggleLoading("Waiting for google!"); renderProps.onClick() }} ><i style={{ fontSize: 25 }} class="fab fa-google-plus-g"></i></button>
                                    )}
                                    onSuccess={this.googleLogin}
                                    onFailure={(data) => { this.googleLogin(data, true) }}
                                    cookiePolicy={'single_host_origin'}
                                />
                                     <a type="" className=" text-dark" href={`https://github.com/login/oauth/authorize?scope=user&client_id=${'Iv1.819423876210273a'}&state=signup`}><i style={{ fontSize: 25 }} class="fab fa-github"></i></a>

                            </div>

                        </div>
                        <div style={{ marginLeft: 28 }} className="col-sm-12">
                            <a className="text-center mx-auto mt-3 text-dark Already" href="/login">Already Account?</a>
                        </div>
                    </div>
                </div>
                {/* </div> */}
                <NotificationContainer />
            </div>

        )
    }
}
export default Signup;