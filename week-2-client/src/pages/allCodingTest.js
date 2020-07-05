import React, { useReducer } from 'react';
import { getAllCodingTests, getTestSubmission } from '../data/data';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Chart } from "react-google-charts";
class AllCodingTest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tests: [],
            data:[],
            profile: {

            },
            points: 0
        }
        this.calculateTotalMarks = this.calculateTotalMarks.bind(this)
    }
    data = [
        ["Test", "%", ],
        ["2004", 1000],
        ["2005", 1170],
        ["2006", 660],
        ["2007", 1030]
    ];
    options = {
        title: "Student Performance",
        curveType: "function",
        legend: { position: "bottom" }
    };
    calculateTotalMarks(test) {
        var marks = 0;
        test.questions.forEach((question) => {
            if (question.questionType === "coding") {
                question.testCases.forEach((testCase) => {
                    marks += parseInt(testCase.points);
                })

            }
            else {
                marks += parseInt(question.points);
            }

        })
        return marks;
    }

    calculateFinalMarks(submission, test) {
        if (submission.isStarted === false) return 0;
        var marks = 0;
        submission.ans.forEach((ans, index) => {
            if (!ans.isSubmitted) return;
            if (ans.questionType === "coding") {
                ans.submission.result.forEach((output, index2) => {
                    if (output.stderr === '') {
                        if (output.stdout === test.questions[index].testCases[index2].output)
                            marks += parseInt(test.questions[index].testCases[index2].points);
                    }
                })

            }
            else {

                marks += parseInt(ans.finalMarks);
            }
        })

        return marks
    }
    componentDidMount() {
        var user = reactLocalStorage.getObject('user', {
            email: "",
            imageUrl: "",
            isLoggedin: false,
            isSocialLogin: false

        }, true);
        getAllCodingTests().then((tests) => {
            var modifiedTests = tests.filter((test) => {
                return test.testFor.find((email) => {
                    return email === user.email;
                }) !== undefined
            })
            var points = 0;
            var data = [ ["Test", "%", ]]
            modifiedTests.forEach((test) => {
                var total = this.calculateTotalMarks(test);
                
                getTestSubmission(user.email, test._id).then((submission) => {
                    if (submission !== null && submission.isReleased) {
                        var finalMarks = this.calculateFinalMarks(submission, test)
                        points += finalMarks
                        var per = Math.round((finalMarks/total)*100);
                        data.push([test.title,per])
                        this.setState({ points ,data})


                    }



                })
            })
            this.setState({ tests: modifiedTests, profile: user, points });
        })

    }
    render() {
        return (<div>
            <div style={{ marginTop: "80px" }} className="container">
  <section class="jumbotron text-center mb-5 ">
      <div class=" jumboMargin"  >
         <h1 class="text-orange font-weight-bold">Welcome !</h1>
      <img className="rounded-circle " src={this.state.profile.imageUrl} />
      <p class="lead text-orange">{this.state.profile.name}</p>
    <p class="lead text-orange ">{this.state.profile.email}</p>
    <p class="lead text-orange ">Points <span className="badge badge-warning">{this.state.points}</span></p>
       
      </div>
    </section>
                <div className="row ml-3">
                   
                    <div className="col-12 ">
                        <div className="row">
                            <div className="col-12">
                                <div className="card mb-3">
                                    <div className="card-header blueBack text-orange font-weight-bold">
                                        Performance
                                   </div>
                                    <div className="card-body">
                                        <Chart
                                            chartType="LineChart"
                                            data={this.state.data}
                                            options={this.options}
                                            width="100%"
                                            height="400px"
                                            legendToggle
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header blueBack text-orange font-weight-bold">
                                        <p>Coding Challenges</p>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Contest Name</th>
                                                        <th scope="col">Points</th>
                                                        <th scope="col">View</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.tests.map((test, index) => {
                                                        return <tr>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{test.title}</td>
                                                            <td>{this.calculateTotalMarks(test)}</td>
                                                            <td><a href={`/coding-test/${test._id}`}>View</a></td>
                                                        </tr>
                                                    })}


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row mt-5">
                    <main role="main" >

                        <section class="jumbotron text-center">
                            <div class="container jumboMargin" >
                                <h1 class="text-orange font-weight-bold">Cryptx Store</h1>
                                <p class="lead text-orange">Shop in our store or redeem our products  by using CryptCoins.</p>

                            </div>
                        </section>

                        <div class="album py-5 bg-light">
                            <div class="container">

                                <div class="row">
                                <div class="col-md-4">
                                        <div class="card mb-4 shadow-sm">
                                            <img class="bd-placeholder-img card-img-top p-2" src="https://leetcode.com/static/images/store/tshirt_promo.png" />
                                            <div class="card-body">
                                                <p class="m-0 inline-block" >Cryptx T-Shirt </p>
                                                <button class="btn blueBack float-right text-orange" ><i class="fa fa-coins mr-2" style={{color:"yellow"}}>5000</i>Redeem</button>
                                                <br />
                                                <small class="text-muted">Redeem our t-shirts !</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card mb-4 shadow-sm">
                                            <img class="bd-placeholder-img card-img-top p-2" src="https://leetcode.com/static/images/store/tshirt_promo.png" />
                                            <div class="card-body">
                                                <p class="m-0 inline-block" >Cryptx T-Shirt </p>
                                                <button class="btn blueBack float-right text-orange" ><i class="fa fa-coins mr-2" style={{color:"yellow"}}>5000</i>Redeem</button>
                                                <br />
                                                <small class="text-muted">Redeem our t-shirts !</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card mb-4 shadow-sm">
                                            <img class="bd-placeholder-img card-img-top p-2" src="https://leetcode.com/static/images/store/tshirt_promo.png" />
                                            <div class="card-body">
                                                <p class="m-0 inline-block" >Cryptx T-Shirt </p>
                                                <button class="btn blueBack float-right text-orange" ><i class="fa fa-coins mr-2" style={{color:"yellow"}}>5000</i>Redeem</button>
                                                <br />
                                                <small class="text-muted">Redeem our t-shirts !</small>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </main>

                </div>
               
            </div>
            <footer id="sticky-footer" class="py-4  text-white-50 blueBack ">
             <div class="container text-center">
                 <small>Copyright &copy; Cryptx</small>
             </div>
         </footer>
           </div>
        )
    }
}
export default AllCodingTest;