import React from 'react';
function Mcq(props) {
    return (
        <div>
            <div id="sort" class="sort-filter">
                <div class="card p-2 border-0 rounded  mt-2 p-1">
                    {props.options.map((option, index) => {
                        return <label class="form-check text-left">
                            <div className="card-img-top">
                                {option.imageUrl === "" ? <div></div> : <img style={{ maxHeight: "200px" }} src={option.imageUrl} />}
                            </div>
                            <input disabled={props.disabled} onChange={(e) => { props.selectAns(index) }} checked={props.ansValue === index} value={index} class="form-check-input" type="radio" />
                            <span class="mrl-5 form-check-label label2">
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