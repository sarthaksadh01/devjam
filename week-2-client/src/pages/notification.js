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

                <div class="title text-center">
                    <h2 class="details  inline-block font-weight-bold"> NOTIFICATIONS</h2>
                </div>
                {this.state.notifications.map((notification,index)=>{
                    return <div class="my-5">
                    <div class="alert alerts-bg " role="alert">
                        <h4 class="alert-heading">{notification.title} {notification.isRead===false?<span className="ml-3 badge badge-info text-white">new</span>:<span></span>}</h4>
                        <p>{notification.text}</p>
                        <hr />
                        <p class="mb-0"><a onClick ={(e)=>{
                            e.preventDefault();
                            this.onClickupdateNotification(index);

                        }} className="text-dark" href={notification.isUrl?notification.url:undefined}>View</a></p>

                    </div>


                </div>
                })}

                
            </div>

        );


    }
}
export default Notification;