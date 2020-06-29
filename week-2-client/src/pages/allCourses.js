import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import history from '../components/history';
import { getAllCourses } from '../data/data';
class Allcourses extends React.Component {
    constructor(props){
        super(props);
        
        this.state ={
            courses:null
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
      
          getAllCourses().then((courses)=>{
            //   alert(JSON.stringify(courses))
            var modifiedcourses = courses.filter((course)=>{
                return course.courseFor.find((email)=>{
                    return email===user.email
                })!==undefined
            })
            this.setState({courses:modifiedcourses})
        }).catch((err)=>{
            alert(JSON.stringify(err))

        }).finally(()=>{
            this.props.toggleLoading();
        })

    }
   
    render() {
        if(this.state.courses===null)return null;
        return (
            <div style={{ marginTop: "80px" }} class="container mb-5  ">

                <div class="title text-center">
                    <h2 class="details  inline-block font-weight-bold"> Courses</h2>
                </div>
                {this.state.courses.map((course,index)=>{
                    return <div class="my-5">
                    <div class="alert alerts-bg " role="alert">
                        <h4 class="alert-heading">{course.title} </h4>
                        <p>{course.desc}</p>
                        <hr />
                        <p class="mb-0"><a onClick ={(e)=>{
                        
                        }} className="text-dark" href={`/course/${course._id}`}>View</a></p>

                    </div>


                </div>
                })}

                
            </div>

        );


    }
}
export default Allcourses;