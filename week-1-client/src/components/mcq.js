import React from 'react';
function Mcq(props) {
    return (
        <div>
            <div id="sort" class="sort-filter">
                <div class="card p-2 border-0 rounded  mt-2 p-1">
                    {props.options.map((option, index) => {
                        var bg ="";
                        if(props.isSubmitted &&  props.isAutoGraded && props.ansValue===index && props.marksObtained === 0 && props.marksObtained === props.finalMakrs)bg = "border border-danger";
                        if(props.isSubmitted && props.isAutoGraded && props.correctOption === (index+1)  &&  props.marksObtained === props.finalMakrs )bg = "border border-success"
                        return <label class={`form-check ${bg} rounded p-1  text-left`}>
                            <div className="card-img-top">
                                {option.imageUrl === "" ? <div></div> : <img style={{ maxHeight: "200px" }} src={option.imageUrl} />}
                            </div>
                            <input disabled ={props.disabled}  onChange={(e)=>{props.selectAns(index)}} checked={props.ansValue===index} value={index}  class="form-check-input" type="radio" />
                            <span class="form-check-label">
                                {option.title}
                            </span>
                            <hr/>
                        </label>
                    })}
                </div>
            </div>
        </div>
    );

}
export default Mcq;