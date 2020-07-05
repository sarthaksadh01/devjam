/* 

This file checks whether the user is loggedin or not.
 
It also takes cares of any threat 
to the site since credentials are verified from the database
each time.

If a user is not logged in then he/she is redirected to 
login page.

*/

import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './assets/css/bootstrap.min.css';
import './assets/css/main.css';
import './assets/css/main2.css';
import 'react-notifications/lib/notifications.css';
import NavbarUi from './components/navbar';
import LoadingOverlay from 'react-loading-overlay';
import { reactLocalStorage } from 'reactjs-localstorage';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Content from './pages/content';
import history from "./components/history"
import Topic from './pages/topic';
import Login from './pages/login';
import Signup from './pages/signup';
import { getNotification } from './data/data';
import Notification from './pages/notification';
import ViewTest from './pages/test'
import Course from './pages/course';
import AllTests from './pages/allTest';
import Allcourses from './pages/allCourses';
import Result from './pages/result';
import ViewCodingTest from './pages/viewCodingTest';
import ViewSingleCodingResult from './pages/viewSingleCodingResult';
import AllCodingTest from './pages/allCodingTest';

class App extends React.Component {
  state = {
    isLoading: false,
    loadingText: "loading...",
    isLoggedin: false,
    loadingCred: true,
    user: {
      email: "",
      imageUrl: "",
      isLoggedin: false,
      isSocialLogin: false
    },
    notifications: []
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
    var user = reactLocalStorage.getObject('user', {
      email: "",
      imageUrl: "",
      isLoggedin: false,
      isSocialLogin: false

    }, true);

    if (user.isLoggedin) {
      getNotification(user.email).then((notifications) => {
        // alert(JSON.stringify(notifications))
        this.setState({ notifications })

      }).catch((err) => {

      })
      this.setState({ isLoggedin: true, user })

    }

  }
  render() {
    return (
      <Router history={history}>
        < NotificationContainer />
        <LoadingOverlay
          active={this.state.isLoading}
          spinner
          text={this.state.loadingText}
        >
          {/* <NavbarUi />  */}
          {this.state.isLoggedin ?
            <NavbarUi
              imageUrl={this.state.user.imageUrl}
              email={this.state.user.email}
              notifications={this.state.notifications}
            /> : <div></div>}
          <Switch>
            <Route exact path="/" render={(props) => this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/topic/:topicId/subtopic/:videoId" render={(props) => this.state.isLoggedin ? <Topic {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/login" render={(props) => this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/signup" render={(props) => this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} /> : <Signup {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/content" render={(props) => this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/notification" render={(props) => this.state.isLoggedin ? <Notification {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/test/:id" render={(props) => this.state.isLoggedin ? <ViewTest {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/course/:id" render={(props) => this.state.isLoggedin ? <Course {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/tests/" render={(props) => this.state.isLoggedin ? <AllTests {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/courses/" render={(props) => this.state.isLoggedin ? <Allcourses {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/result/:id" render={(props) => this.state.isLoggedin ? <Result {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/coding-test/:id" render={(props) => this.state.isLoggedin ? <ViewCodingTest {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/coding-test-result/:id" render={(props) => this.state.isLoggedin ? <ViewSingleCodingResult {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
            <Route path="/coding-tests" render={(props) => this.state.isLoggedin ? <AllCodingTest {...props} toggleLoading={this.toggleLoading} /> : <Login {...props} toggleLoading={this.toggleLoading} />} />
          </Switch>
        </LoadingOverlay>
      </Router>

    );

  }

}

export default App;