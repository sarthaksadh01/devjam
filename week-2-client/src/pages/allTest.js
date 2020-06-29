import React from 'react';
import { getNotification,updateNotification } from '../data/data';
import { reactLocalStorage } from 'reactjs-localstorage';
import history from '../components/history';
import { getAllTests,getTestSubmission } from '../data/data';
class AllTests extends React.Component {
    constructor(props){
        super(props);
        
        this.state ={
            tests:[]
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
          
        getAllTests().then(async(tests)=>{
            var modifiedTests = tests.filter((test)=>{
                return test.testFor.find((email)=>{
                    return email===user.email
                })!==undefined
            })
            modifiedTests.forEach((test)=>{
                 getTestSubmission(user.email,test._id).then((submission)=>{
                     if(submission!==null && submission.isReleased){
                       var tests = this.state.tests;
                        test['result'] = submission;
                        tests.push(test);
                        this.setState({tests});
                        

                     }
                     
                    
                    
                })
            })
            
            
        }).catch((err)=>{

        }).finally(()=>{
            this.props.toggleLoading();
        })

    }
   
    render() {
        if(this.state.tests===null)return null;
        return (
            <div style={{ marginTop: "80px" }} class="container mb-5  ">

                <div class="title text-center">
                    <h2 class="details  inline-block font-weight-bold"> Tests</h2>
                </div>
                {this.state.tests.map((test,index)=>{
                    return <div class="my-5">
                    <div class="alert alerts-bg " role="alert">
                        <h4 class="alert-heading">{test.title} </h4>
                        <p>{test.desc}</p>
                        <hr />
                        <p class="mb-0"><a onClick ={(e)=>{
                        
                        }} className="text-dark" href={`/result/${test.result._id}`}>View</a></p>

                    </div>


                </div>
                })}

                
            </div>

        );


    }
}
export default AllTests;