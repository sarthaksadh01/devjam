import React from 'react';
function McqGrid(props) {
    return (
        <div>
            <table class="table">
                <thead class="thead-transparent">
                    <tr>
                        <th scope="col"></th>
                        {props.columns.map((column, index1) => {
                            return <th scope="col">{column}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((row, index1) => {
                        return <tr>
                            <th scope="row">{row}</th>
                            {props.columns.map((colum, index2) => {
                                return <td>
                                    <label class="form-check text-left">
                                        <input disabled ={props.disabled}  onChange={(e) => {
                                            var ansValue = props.ansValue;
                                            ansValue[index1] = index2;
                                            props.selectAns(ansValue)
                                        }} checked={props.ansValue[index1] === index2} value={index2} class="form-check-input" type="radio" />
                                    </label>
                                </td>
                            })}

                        </tr>
                    })}

                </tbody>
            </table>
        </div>
    );

}
export default McqGrid;