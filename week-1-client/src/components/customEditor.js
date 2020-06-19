import React from 'react';
import ReactDOM from "react-dom";
class CustomEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            value:props.value
         };
         this.handleChange = this.handleChange.bind(this)
    }

    getValue() {
        var column = this.props.column.key
        var data = {};
        data[column] =this.state.value;
        return  data;
    }

    getInputNode() {
        return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
    }

   handleChange(e){
    this.setState({ value: e.target.value }, () => this.props.onCommit());

   }
    render() {
        return (
            <div>
                <div className="card shadow rounded">
                    <div className="card-header"><input onChange={this.handleChange} value={this.state.value} placeholder="/100" className="text-right form-control"/></div>
                    <div className="card-footer"><a href="lll" className="btn text-white btn-sm btn-info">View Submission</a></div>

                </div>
            </div>
        );
    }
}

export default CustomEditor