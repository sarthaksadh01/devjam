import React from 'react';
import { getNotification,updateNotification } from '../data/data';
import { reactLocalStorage } from 'reactjs-localstorage';
import history from '../components/history';
class Notification extends React.Component {
    constructor(props){
        super(props);
        
        this.state ={
            notifications:[]
        }
    }
    componentDidMount() {
        this.props.toggleLoading();
        var user = reactLocalStorage.getObject('user', {
            email: "",
            imageUrl: "",
            isLoggedin: false,
            isSocialLogin: false
      
          }, true);
      
        getNotification(user.email).then((notifications)=>{
            this.setState({notifications})
        }).catch((err)=>{

        }).finally(()=>{
            this.props.toggleLoading();
        })

    }
    onClickupdateNotification(index){
       
        var notifications = this.state.notifications;
        if(!notifications[index].isRead){
            var data = notifications[index];
            
            data.isRead= true;
            // alert(JSON.stringify(data));
            updateNotification(data).then((doc)=>{
                // alert(JSON.stringify(doc))
                var url  = notifications[index].url;
                history.push(url);
                window.location.reload();
            })
            
        }
        else{
            var url  = notifications[index].url;
            history.push(url);
            window.location.reload();

        }
        
    }
    render() {
        return (
            <div style={{ marginTop: "80px" }} class="container mb-5  ">

<section class="jumbotron text-center">
      <div class=" jumboMargin" >
        <h1 class="text-orange font-weight-bold">Notifications</h1>
        <p class="lead text-orange"> Hey! Go through your notifications and alerts..</p>
       
      </div>
    </section>
                {this.state.notifications.map((notification,index)=>{
                    return <div class="my-5">
                    <div class="alert shadow " role="alert">
                        <h4 class="alert-heading inline-block">{notification.title} {notification.isRead===false?<span className="ml-3 badge badge-info text-white">new</span>:<span></span>}</h4>
                        <button class="mb-0 btn btn-warning inline-block float-right"><a onClick ={(e)=>{
                            e.preventDefault();
                            this.onClickupdateNotification(index);

                        }} className="text-dark " href={notification.isUrl?notification.url:undefined}>View</a></button>
                        <hr/>
                        <p>{notification.text}</p>
                       
                        

                    </div>


                </div>
                })}

                
            </div>

        );


    }
}
export default Notification;