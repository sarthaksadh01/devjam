import React from 'react';
import Select from 'react-select';

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
    coding:'Coding Question',
    frontend:'Frontend Question',
    frontendDynamic:'Frontend Dynamic Question',
    freeStyle:'FreeStyle frontend question',
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
    <div>
      <div className="row mb-2 mt-4">
        <div className="col-6">
          <input onChange ={(e)=>{props.onSearchQuestion(e.target.value)}} className="form-control w-100" placeholder="Search question By name"></input>
        </div>
        <div className="col-2">
          <Select
            // value={selectedOption}
             onChange={(e) => {
               props.onFilterChange("difficulty",e.value)
              }}
            options={difficulty}
          />

        </div>
        <div className="col-2">
          <Select
            // value={selectedOption}
             onChange={(e) => {
              props.onFilterChange("questionType",e.value)
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
            <th scope="col">Selected</th>
            <th scope="col">Title</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Question Type</th>
            <th scope="col">Points</th>

          </tr>
        </thead>
        <tbody>
          {props.filterQuestions.map((index) => {
            return <tr>
              <th scope="row"><input 
              onChange ={(e)=>{props.addRemoveQuestion(index)}}
              checked ={props.selectedQuestions.find((question)=>{
                return question._id === props.questions[index]._id;
              })!==undefined} className="from-check-input" type={"checkbox"} /></th>
              <td><a className="text-dark" href={`/edit-coding-question/${props.questions[index]._id}`}>{props.questions[index].title} </a></td>
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
export default QuestionBank;