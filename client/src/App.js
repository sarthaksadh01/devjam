/* 

This file checks whether the user access the site
as a Admin or Super Admin by checking isLoggedin & 
isSuperLogin flags. 

Also ensures that pages cannot be accessed without having 
either flags set to true. This takes cares of any threat 
to the site since credentials are verified from the database
each time.

If a user is not logged in then he/she is redirected to 
login page.

*/

import React from 'react';
import "./assets/css/loader.css"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './assets/css/bootstrap.min.css';
import Video from './pages/video';
import NavbarUi from './components/navbar';
import Deliverable from './pages/deliverable';
import Topic from './pages/topic';
import Content from './pages/content';
import Login from './pages/login';
import SuperLogin from "./pages/superLogin"
import Home from './pages/home';
import history from './components/history'
import LoadingOverlay from 'react-loading-overlay';
import SuperAdmin from "./pages/superAdmin"
import { reactLocalStorage } from 'reactjs-localstorage';
import EditProfile from "./pages/editProfile"
import AllProfiles from './pages/allprofiles';
import { verifyLogin, verifySuperLogin } from "./data/data"
import { NotificationContainer, NotificationManager } from 'react-notifications';

class App extends React.Component {
  state = {
    isLoading: false,
    loadingText: "loading...",
    isLoggedin: false,
    loadingCred: true,
    isSuperLogin: false,
    userName: ""
  }
  constructor(props) {
    super(props)
    this.toggleLoading = this.toggleLoading.bind(this)
  }
  toggleLoading(text = "loading...") {
    var currentState = this.state.isLoading;
    this.setState({ isLoading: !currentState, loadingText: text });
  }
  componentDidMount() {
    var isSuperLogin = reactLocalStorage.get('isSuperLogin', false, true);
    var isLoggedin = reactLocalStorage.get('isLoggedin', false, true)
    if (isLoggedin) {
      var userName = reactLocalStorage.get('userName', "fake", true);
      var password = reactLocalStorage.get('password', "fake", true);
      verifyLogin(userName, password).then((data) => {

        this.setState({ isLoggedin: data.success, loadingCred: false, userName })

      }).catch((err) => {
        NotificationManager.error("Error connecting to server!")

      })
    }
    else {
      this.setState({ isLoggedin: false, loadingCred: false })

    }
    if (isSuperLogin) {

      var userName = reactLocalStorage.get('superUser', "fake", true);
      var password = reactLocalStorage.get('superPass', "fake", true);
      verifySuperLogin(userName, password).then((data) => {
        this.setState({ isSuperLogin: data.success })
      }).catch((err) => {
        NotificationManager.error("Error connecting to server!")

      })

    }
    else {
      this.setState({ isSuperLogin: false })

    }


  }
  render() {
    return (
      this.state.loadingCred ? <div><div className="preloader"></div></div> :
        <Router history={history}>
          < NotificationContainer />
          <LoadingOverlay
            active={this.state.isLoading}
            spinner
            text={this.state.loadingText}
          >
            {this.state.isLoggedin ? <NavbarUi /> : <div></div>}
            <Switch>
              <Route path="/superadmin" render={(props) => this.state.isSuperLogin ? <SuperAdmin {...props} toggleLoading={this.toggleLoading} /> : <SuperLogin {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/superlogin" render={(props) => this.state.isSuperLogin ? <SuperAdmin {...props} toggleLoading={this.toggleLoading} /> : <SuperLogin {...props} toggleLoading={this.toggleLoading} />} />
              <Route exact path="/" render={(props) => this.state.isLoggedin ? <Home /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/login" render={(props) => this.state.isLoggedin ? <Home {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/content" render={(props) => this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} userName={this.state.userName} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/topic/:id" render={(props) => this.state.isLoggedin ? <Topic {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/deliverable/:id" render={(props) => this.state.isLoggedin ? <Deliverable {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/video/:id" render={(props) => this.state.isLoggedin ? <Video {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/editprofile/:id" render={(props) => this.state.isLoggedin ? <EditProfile {...props} toggleLoading={this.toggleLoading} userName={this.state.userName} isCreated={true} isEditable={true} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/createprofile" render={(props) => this.state.isLoggedin ? <EditProfile  {...props} toggleLoading={this.toggleLoading} userName={this.state.userName} isCreated={false} isEditable={true} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route path="/profile/:id" render={(props) => <EditProfile {...props} toggleLoading={this.toggleLoading} isCreated={true} userName={this.state.userName} isEditable={false} />} />
              <Route path="/profiles" render={(props) => this.state.isLoggedin ? <AllProfiles {...props} toggleLoading={this.toggleLoading} userName={this.state.userName} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            </Switch>
          </LoadingOverlay>
        </Router>

    );

  }

}

export default App;
