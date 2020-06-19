import React from 'react';
import { getMarks, UpdateUser } from '../data/data';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal'
import { PieChart } from 'react-minimal-pie-chart';


class Marking extends React.Component {


    constructor(props) {
        super(props);
        this.myRef = React.createRef()
        this.myRef2 = React.createRef()

        this.state = {
            deliverables: [],
            users: [],
            userRows: [],
            show: false,
            missing:0,
            late:0,
            handedIn:0,
            notSubmitted:0,
            imageUrl:"",
            name:"",
            email:""
        }
        this.onMarksChange = this.onMarksChange.bind(this);
        this.showUserDetail = this.showUserDetail.bind(this);

    }

    showUserDetail(index) {
        var handedIn = this.state.userRows[index].submission.filter((sub)=>{
           return sub.status ==="Handed In"

        }).length;
        var late = this.state.userRows[index].submission.filter((sub)=>{
            return sub.status ==="Done late"

        }).length;
        var missing = this.state.userRows[index].submission.filter((sub)=>{
            return sub.status ==="Missing"

        }).length;
        var notSubmitted = this.state.userRows[index].submission.filter((sub)=>{
            return sub.status ===""

        }).length;
        var userRows = this.state.userRows;

        this.setState({handedIn,late,missing,notSubmitted,name:userRows[index].name,email:userRows[index].email,imageUrl:userRows[index].imageUrl},()=>{
            this.setState({show:true})
        })


    }

    componentDidMount() {
        var deliverables = [];
        var deliverablesJson = {}
        var index = 0;
        var userRows = [];
        this.props.toggleLoading();
        getMarks().then((data) => {
            data.topics.forEach((topic) => {
                topic.subTopics.forEach((subTopic) => {

                    if (subTopic.type != "video") {
                        var _subTopic = {
                            topicId: topic._id,
                            subTopicId: subTopic.subTopicId,
                            points: subTopic.points,
                            due: subTopic.due,
                            index,
                            title: subTopic.title
                        };
                        index += 1;
                        deliverables.push(_subTopic)
                        deliverablesJson[_subTopic.subTopicId] = _subTopic;
                    }
                })
            })
            deliverables.sort((d1, d2) => {
                var x = new Date(d1.due);
                var y = new Date(d2.due);
                return x <= y;
            })
            this.setState({ deliverables }, () => {
                data.users.forEach((user) => {
                    var userDetail = {
                        name: user.name == "" ? "cryptx" : user.name,
                        email: user.email,
                        imageUrl: user.imageUrl === "" || user.imageUrl === undefined ? "https://bootdey.com/img/Content/user_1.jpg" : user.imageUrl,
                        submission: []
                    }
                    deliverables.forEach((deliverable) => {
                        var res = this.currentSubmission(user, deliverable);
                        var points = res.points;
                        var status = res.status;
                        userDetail.submission.push({
                            points,
                            status,
                            subTopicId: deliverable.subTopicId,
                            topicId: deliverable.topicId
                        })

                    })
                    userRows.push(userDetail);


                })

            })


            this.setState({ userRows })


        }).catch((err) => {
            alert("Server Error")

        }).finally(() => {
            this.props.toggleLoading();
        })



        $(document).ready(function () {
            $('#tbody').scroll(function (e) {
                $('thead').css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
                $('thead th:nth-child(1)').css("left", $("#tbody").scrollLeft()); //fix the first cell of the header
                $('#tbody td:nth-child(1)').css("left", $("#tbody").scrollLeft()); //fix the first column of tdbody
            });
        });

    }
    currentSubmission(user, deliverable) {
        var submission = user.submissions.filter((val) => {
            return val.subTopicId == deliverable.subTopicId;
        })
        var temp = submission.length ? submission[0] : {};
        var points = temp["points"] === undefined ? 0 : temp["points"];
        var data = {
            points,
            status: ""
        }
        if (submission.length) {

            if (submission[0].createdAt > deliverable.due) {
                data.status = "Done late"
                return data
            }
            else {
                data.status = "Handed In"
                return data;
            }

        }
        else {

            var today = new Date();
            var due = new Date(deliverable.due)
            if (due < today) {

                data.status = "Missing"
                return data;
            }
            else {
                data.status = ""
                return data
            }
        }
    }

    onMarksChange(e, index1, index2) {
        var userRows = this.state.userRows;
        userRows[index1].submission[index2].points = parseInt(e.target.value);
        UpdateUser(userRows[index1].email, parseInt(e.target.value), userRows[index1].submission[index2].subTopicId);
        this.setState({ userRows });

    }
    avg(total, users, index) {
        var sum = 0;
        users.forEach((user) => {
            sum += user.submission[index].points;

        })
        return Math.round((sum / (total * users.length)) * 100);
    }
    render() {
        return (
            <div className="text-center " style={{ marginTop: 62 }}>
                <div className="  mt-5">

                    <table id="table" className="text-center  border">
                        <thead id="thead" className="  ">

                            <tr className="text-center">
                                <th className="" style={{ height: "120px", width: "100px", zIndex: 101, backgroundColor: "#F8F9FA" }}>
                                    <div style={{ backgroundColor: "#F8F9FA" }} className="card   text-center   w-100 h-100 rounded">


                                    </div>

                                </th>
                                {this.state.deliverables.map((value, index) => {
                                    return <th style={{ height: "40px", width: "100px" }} className=" text-dark text-center text-truncate">
                                        <div style={{ backgroundColor: "#F8F9FA" }} className="card  text-center   w-100 h-100 rounded">
                                            <p className="mt-2 text-truncate mb-0"><a className="text-truncate heading" href={`/dscore/${value.topicId}-${value.subTopicId}`}>{value.title}</a></p>
                                            <a href={`/deliverable/${value.topicId}-${value.subTopicId}`}><FontAwesomeIcon className="i" icon={faEdit} /></a>
                                            <p style={{ fontSize: 10 }} className="text-dark mt-3 mb-0">{new Date(value.due).toLocaleDateString("en-US")}</p>
                                            <p style={{ fontSize: 10 }} className="mt-0 mb-0 text-muted">Out of {value.points}</p>

                                        </div>

                                    </th>

                                })}


                            </tr>
                        </thead>
                        <tbody id="tbody" className="">
                            <tr>
                                <td style={{ height: "70px", width: "100px" }} >
                                    <div style={{ zIndex: 101, backgroundColor: "#F8F9FA" }} className="card  text-dark shadow rounded w-100 h-100">
                                        <span className="text-dark"> Average</span>
                                    </div>
                                </td>
                                {this.state.deliverables.map((value, index) => {
                                    return <td style={{ height: "70px", width: "100px" }} >
                                        <div className="card  text-dark  rounded w-100 h-100">
                                            <span className="text-dark"> {this.avg(value.points, this.state.userRows, index)}%</span>
                                        </div>
                                    </td>


                                })}
                            </tr>
                            {this.state.userRows.map((value, index1) => {
                                return <tr className="text-center">
                                    <td style={{ height: "70px", width: "100px" }} >
                                        <div style={{ zIndex: 101, backgroundColor: "#F8F9FA" }} className="card  text-dark shadow rounded w-100 h-100">
                                            <span onClick={()=>{this.showUserDetail(index1)}}><img className="mt-1" style={{ height: "30px" }} src={value.imageUrl} /></span> <span className="text-dark"> {value.name}</span>
                                        </div>
                                    </td>
                                    {value.submission.map((value2, index2) => {


                                        return value2.status === "" || value2.status === "Missing" ? <td style={{ height: "70px", width: "100px" }} >
                                            <div className="card text-danger  rounded w-100 h-100">{value2.status}</div>
                                        </td>
                                            : <td style={{ height: "70px", width: "100px" }}>
                                                <div className="card text-danger  rounded w-100 h-100">
                                                    <input className="rounded w-100  text-center"
                                                        onChange={(e) => { this.onMarksChange(e, index1, index2) }}
                                                        type="number" style={{ height: "40px", width: "100px" }} value={value2.points} />
                                                    {value2.status == "Done late" ?
                                                        <div> <span className="badge badge-warning text-white mr-2">{value2.status}</span><span><a href={`/submission/${value2.topicId}-${value2.subTopicId}/${value.email}`}><FontAwesomeIcon className="i" icon={faEye} /></a></span> </div>
                                                        : <span><a href={`/submission/${value2.topicId}-${value2.subTopicId}/${value.email}`}><FontAwesomeIcon className="i" icon={faEye} /></a></span>}
                                                </div>

                                            </td>

                                    })}

                                </tr>

                            })}


                        </tbody>
                    </table>


                </div>

                < Modal show={this.state.show} onHide={() => { this.setState({ show: false }) }}>
                    <Modal.Header closeButton>
                        <Modal.Title> <span ><img className="mt-1" style={{ height: "30px" }} src={this.state.imageUrl} /></span> <span className="text-dark"> {this.state.name}</span></Modal.Title><br/>
                        {/* <Modal.Title>{this.state.email}</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>

                        <PieChart style={{ maxHeight: 180 }} className="card-img-top p-3"
                            data={[
                                { title: 'Late', value: this.state.late, color: '#f0ad4e' },
                                { title: 'Missing', value: this.state.missing, color: '#d9534f' },
                                { title: 'Handed In', value: this.state.handedIn, color: '#5cb85c' },
                                { title: 'Not Submitted', value:this.state.notSubmitted , color: '#f7f7f7' },
                            ]}
                        />

                </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>


            </div>



        );
    }
}
export default Marking;