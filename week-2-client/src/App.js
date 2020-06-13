import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './assets/css/bootstrap.min.css';
import './assets/css/main.css';
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

class App extends React.Component {
  state = {
    isLoading: false,
    loadingText: "loading...",
    isLoggedin: false,
    loadingCred: true,
    user:{
      email:"",
      imageUrl:"",
      isLoggedin:false,
      isSocialLogin:false
    }
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
    var user = reactLocalStorage.getObject('user',{
      email:"",
      imageUrl:"",
      isLoggedin:false,
      isSocialLogin:false

    },true);
  
    if(user.isLoggedin){
      this.setState({isLoggedin:true,user})

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
            {this.state.isLoggedin ? <NavbarUi imageUrl ={this.state.user.imageUrl} email ={this.state.user.email}/> : <div></div>}
            <Switch>
              <Route exact path="/" render={(props) =>this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} />:<Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route  path="/topic/:topicId/subtopic/:videoId" render={(props) =>this.state.isLoggedin ? <Topic {...props} toggleLoading={this.toggleLoading} />:<Login {...props} toggleLoading={this.toggleLoading} />}  />
              <Route  path="/login" render={(props) =>this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} />:<Login {...props} toggleLoading={this.toggleLoading} />} />
              <Route  path="/signup" render={(props) =>this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} />:<Signup {...props} toggleLoading={this.toggleLoading} />} />
              <Route  path="/content" render={(props) =>this.state.isLoggedin ? <Content {...props} toggleLoading={this.toggleLoading} />:<Login {...props} toggleLoading={this.toggleLoading} />} />
            </Switch>
          </LoadingOverlay>
        </Router>

    );

  }

}

export default App;