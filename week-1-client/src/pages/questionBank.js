import React from 'react';
import Select from 'react-select';
import history from '../components/history';
import { getCodingTest, createCodingQuestion, getAllCodingQuestions, updateCodingTest } from '../data/data';

function QuestionBank(props) {
    var difficulty = [
        { value: 'all', label: 'All' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ]
    var questionType = [
        { value: 'all', label: 'All' },
        { value: 'coding', label: 'Coding Question' },
        { value: 'frontend', label: 'Frontend Question' },
        { value: 'frontendDynamic', label: 'Frontend Dynamic Question' },
    ]
    var questionProps = {
        easy: {
            badge: "badge badge-success",
            value: "Easy"
        },
        medium: {
            badge: "badge badge-warning text-white",
            value: "Medium"
        },
        hard: {
            badge: "badge badge-danger",
            value: "Hard"
        },
        coding: 'Coding Question',
        freeStyleDynamic: 'Frontend Dynamic Question',
        freeStyle: 'Frontend question',
    }
    function calculatePoints(question) {
        var points = parseInt(question.points);
        if (question.questionType !== "coding") {
            return points;
        }
        else {
            question.testCases.forEach((testCase) => {
                points += parseInt(testCase.points);
            })
            return points;
        }



    }


    return (
        <div >
            <div className="row mb-2 mt-4">
                <div className="col-6">
                    <input onChange={(e) => { props.onSearchQuestion(e.target.value) }} className="form-control w-100" placeholder="Search question By name"></input>
                </div>
                <div className="col-2">
                    <Select
                        // value={selectedOption}
                        onChange={(e) => {
                            props.onFilterChange("difficulty", e.value)
                        }}
                        options={difficulty}
                    />

                </div>
                <div className="col-2">
                    <Select
                        // value={selectedOption}
                        onChange={(e) => {
                            props.onFilterChange("questionType", e.value)
                        }}

                        options={questionType}
                    />


                </div>
                <div className="col-2">
                    {/* <Select
                        // value={selectedOption}
                        // onChange={(e) => { }}
                        options={tags}
                    /> */}


                </div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        
                        <th scope="col">Title</th>
                        <th scope="col">Difficulty</th>
                        <th scope="col">Question Type</th>
                        <th scope="col">Points</th>

                    </tr>
                </thead>
                <tbody>
                    {props.filterQuestions.map((index) => {
                        return <tr>
                            
                            <td><a className="text-dark" href={props.questions[index].questionType === "coding" ? `/edit-coding-question/${props.questions[index]._id}` : `/edit-frontend-question/${props.questions[index]._id}`}>{props.questions[index].title} </a></td>
                            <td><span className={questionProps[props.questions[index].difficulty].badge}>{questionProps[props.questions[index].difficulty].value}</span></td>
                            <td>{questionProps[props.questions[index].questionType]}</td>
                            <td>{calculatePoints(props.questions[index])}</td>
                        </tr>
                    })}

                </tbody>
            </table>

        </div>
    );
}

class QuestionBankClass extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: {
                difficulty: "all",
                questionType: "all",
            },

            questions: [],
            filterQuestions: []
        }
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onSearchQuestion = this.onSearchQuestion.bind(this);
    }
    onFilterChange(type, value) {
        var filters = this.state.filters;
        filters[type] = value;
        var filterQuestions = [];
        var questions = [...this.state.questions];
        questions.forEach((question, index) => {
            if (filters.difficulty === "all" && filters.questionType === "all") {
                filterQuestions.push(index);
            }
            else if (filters.difficulty === "all" && filters.questionType !== "all") {
                if (question.questionType === filters.questionType) {
                    filterQuestions.push(index);
                }
            }
            else if (filters.difficulty !== "all" && filters.questionType === "all") {
                if (question.difficulty === filters.difficulty) {
                    filterQuestions.push(index);
                }
            }
            else {
                if (question.difficulty === filters.difficulty && question.questionType === filters.questionType) {
                    filterQuestions.push(index);
                }

            }

        })
        this.setState({ filterQuestions });
    }
    onSearchQuestion(query) {
        var filters = this.state.filters;
        var filterQuestions = [];
        var questions = [...this.state.questions];
        questions.forEach((question, index) => {
            if (filters.difficulty === "all" && filters.questionType === "all") {
                filterQuestions.push(index);
            }
            else if (filters.difficulty === "all" && filters.questionType !== "all") {
                if (question.questionType === filters.questionType) {
                    filterQuestions.push(index);
                }
            }
            else if (filters.difficulty !== "all" && filters.questionType === "all") {
                if (question.difficulty === filters.difficulty) {
                    filterQuestions.push(index);
                }
            }
            else {
                if (question.difficulty === filters.difficulty && question.questionType === filters.questionType) {
                    filterQuestions.push(index);
                }

            }

        })
        var temp = filterQuestions.filter((index) => {
            return this.state.questions[index].title.toLowerCase().includes(query);
        })
        this.setState({ filterQuestions: temp });

    }
    componentDidMount(){
        getAllCodingQuestions().then((questions) => {
            this.setState({  questions }, () => {
                this.onFilterChange("difficulty", "all");

            });

        })
    }
    render() {
        return (<div className="container" style={{ marginTop: "80px" }}>
            <QuestionBank
                filterQuestions={this.state.filterQuestions}
                questions={this.state.questions}
                onFilterChange={this.onFilterChange}
                filters={this.state.filters}
                onSearchQuestion={this.onSearchQuestion}

            />

        </div>)
    }
}
export default QuestionBankClass;