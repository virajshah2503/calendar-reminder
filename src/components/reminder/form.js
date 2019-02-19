import React, {Component} from 'react';
import Moment from 'moment';
import Axios from 'axios';

class Reminderform extends Component{
	constructor(props){
		super(props);

		this.state = {
			day : this.props.day,
			id :  typeof this.props.filteredreminder._id !== "undefined" ? this.props.filteredreminder._id : "",
			note : typeof this.props.filteredreminder.note !== "undefined" ? this.props.filteredreminder.note : "",
			hour : typeof this.props.filteredreminder.datetime !== "undefined" ? Moment(this.props.filteredreminder.datetime).format("hh") : Moment().format("hh"),
			minute : typeof this.props.filteredreminder.datetime !== "undefined" ? Moment(this.props.filteredreminder.datetime).format("mm") : Moment().format("mm"),
			ampm : typeof this.props.filteredreminder.datetime !== "undefined" ? Moment(this.props.filteredreminder.datetime).format("A") : Moment().format("A"),
			color : typeof this.props.filteredreminder.color !== "undefined" ? this.props.filteredreminder.color : getRandomColor(),
			isedit : typeof this.props.filteredreminder._id !== "undefined" ? true : false
		}

		this.changeHandler = this.changeHandler.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.editForm = this.editForm.bind(this);
		this.cancelForm = this.cancelForm.bind(this);
	}

	changeHandler(event){

      const name = event.target.name;
      const value = event.target.value;

      this.setState({
          [name] : value
      });
  	}

  	submitForm(event){
  		event.preventDefault();

  		let formdata = {...this.state};

  		Axios.post('http://localhost:30001/reminders/add',{
  			note : formdata.note,
  			datetime : formdata.day + " " + formdata.hour + ":" + formdata.minute + " " + formdata.ampm,
  			color : formdata.color
  		}).then((response) => this.props.fetchreminders());
  	}

  	editForm(event){
  		event.preventDefault();

  		let formdata = {...this.state};

  		Axios.put('http://localhost:30001/reminders/edit/'+formdata.id,{
  			note : formdata.note,
  			datetime : formdata.day + " " + formdata.hour + ":" + formdata.minute + " " + formdata.ampm
  		}).then((response) => this.props.fetchreminders());
  	}

  	cancelForm(event){
  		event.preventDefault();

  		this.props.toggleform();
  	}

	render(){

		let hourOptions = [];

		for(let i=1;i<=12;i++){
			hourOptions.push(<option value={addZero(i)} key={i}>{addZero(i)}</option>);
		}

		let minuteOptions = [];

		for(let i=0;i<=59;i++){
			minuteOptions.push(<option value={addZero(i)} key={i}>{addZero(i)}</option>);
		}
		return (
		      <form className="reminder-form">
		        <div className="form-group">
		          <textarea type="text" name="note" placeholder="Add Reminder..." className="form-control" value={this.state.note} onChange={this.changeHandler}/>
		        </div>
		        <div className="form-group">
		        	<select className="hourselect" name="hour" value={this.state.hour} onChange={this.changeHandler}>
			       		{hourOptions}
		        	</select>
		        	{" : "}
		        	<select className="minuteselect" name="minute" value={this.state.minute} onChange={this.changeHandler}>
			       		{minuteOptions}
		        	</select>
		        	{"  "}
		        	<select className="ampmselect" name="ampm" value={this.state.ampm} onChange={this.changeHandler}>
			       		<option value="AM">AM</option>
			       		<option value="PM">PM</option>
		        	</select>
		        </div>
		        <button className="btn btn-default add" onClick={this.state.isedit ? this.editForm : this.submitForm}>{ this.state.isedit ? "Edit" : "Add"}</button>
		        <button className="btn btn-default cancel" onClick={this.cancelForm}>Cancel</button>
		      </form>
		  );
	}
}

function addZero(input){
	return (input < 10 ? "0" : "")+input;
}

function getRandomColor() {

  let letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

export default Reminderform;