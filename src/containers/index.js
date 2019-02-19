import React, { Component } from 'react';

import Axios from 'axios';
import Moment from 'moment';

import '../styles/index.css';
import '../styles/bootstrap.css';

import Month from '../components/calendar/index.js';
import Reminderform from '../components/reminder/form.js';
import Reminder from '../components/reminder/content.js';

let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

class Calendar extends Component {

  constructor(props){
    super(props);

    this.state = {
      current : Moment(),
      toggleform : false,
      clickedday : 0,
      reminders : [],
      id : ""
    }

    this.gotoPrevMonth = this.gotoPrevMonth.bind(this);
    this.gotoNextMonth = this.gotoNextMonth.bind(this);
    this.showreminderForm = this.showreminderForm.bind(this);
    this.fetchReminders = this.fetchReminders.bind(this);
    this.toggleform = this.toggleform.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  gotoPrevMonth(){
    this.setState((prevState,prevProps) => {

      let state = {...prevState};

      let current = state.current;
      current = Moment(current).subtract(1,'month');

      return {
        current : current
      }
    },() => this.fetchReminders());
  }

  gotoNextMonth(){
    this.setState((prevState,prevProps) => {

      let state = {...prevState};

      let current = state.current;
      current =  Moment(current).add(1,'months');

      return {
        current : current
      }
    },() => this.fetchReminders());
  }

  showreminderForm(event,isEdit = false){
    this.setState({
      toggleform : true,
      clickedday : parseInt(event.target.getAttribute("day")),
      isEdit : isEdit,
      id : event.target.id
    });
  }

  componentDidMount(){
    this.fetchReminders();
  }

  fetchReminders(){
    let startOfMonth = this.state.current.startOf('month').format('YYYY-MM-DD');
    let endOfMonth   = this.state.current.endOf('month').format('YYYY-MM-DD');

    Axios.get(`http://localhost:30001/reminders/fetch/${startOfMonth}/${endOfMonth}`)
    .then((result) => {
        this.setState({
          reminders : result.data.data.reminders,
          toggleform : false,
          clickedday : 0,
          id : ""
        });
    });
  }

  deleteReminder(id){
    Axios.delete('http://localhost:30001/reminders/delete/'+id)
    .then((result) => {
      let reminders = this.state.reminders.filter((reminder) => reminder._id !== id);

      this.setState({
        reminders : reminders
      });
    });
  }

  toggleform(){
    this.setState({
      toggleform : false,
      clickedday : 0,
      id : ""
    });
  }

  onDragStart(event,id){
    event.dataTransfer.setData("id", id);
  }

  onDragOver(event){
    event.preventDefault();
  }

  onDrop(event, day){
     let id = event.dataTransfer.getData("id");

     let reminder = this.state.reminders.filter((reminder) => reminder._id === id);

     reminder = reminder[0];

     reminder.datetime = Moment(reminder.datetime).set("date",day);

     Axios.put('http://localhost:30001/reminders/edit/'+id,{
        note : reminder.note,
        datetime : reminder.datetime.format("YYYY-MM-DD HH:mm:ss")
      }).then((response) => this.fetchReminders());
  }

  render() {

    let current = this.state.current;

    let currentMonth = parseInt(current.format('M')) - 1 ;

    let currentmonthName = current.format('MMMM');

    let currentYear = parseInt(current.format('YYYY'));

    let numberofdaysinMonth = current.endOf('month').format('D');

    let weekdayHeader = [];

    for(let i = 0; i < 7; i++){
      weekdayHeader.push(<div className="weekday-header" key={i}>{weekday[i]}</div>);
    }

    let daysBody = [];

    let today = new Date();

    let usedWidth = 1;

    for(let i=1;i<=numberofdaysinMonth;i++){

      let datestring = Moment(new Date(currentYear,currentMonth,i)).format("YYYY-MM-DD");

      let day = (new Date(currentYear,currentMonth,i)).getDay();

      let className = "month-body";

      if(i === 1 && day !== 0){

        let style = {
          width : (day)*14+"%"
        }

        daysBody.push(<div className={"unusedview " + className+" rowfirst"} style={style} key={0}></div>);

        usedWidth = usedWidth*(day)*14;
      }

      if(today.getDate() === i && today.getMonth() === currentMonth && today.getFullYear() === currentYear){
        className += " today";
      }

      usedWidth += 14;

      let filteredreminders = this.state.clickedday !== i ? this.state.reminders.filter((reminder) => Moment(reminder.datetime).format("YYYY-MM-DD") === datestring ) : [];

      let filteredreminder = this.state.toggleform && this.state.clickedday === i && this.state.id !== "" ? this.state.reminders.filter((reminder) => reminder._id === this.state.id) : [];

      filteredreminder = filteredreminder.length === 1 ? filteredreminder[0] : {};

      daysBody.push(
        <div className={ "monthview " + className+ ( usedWidth === 112 || usedWidth === 210 || usedWidth === 308 || usedWidth === 406 || usedWidth === 504 ? " rowfirst" : "")}
             key={i} onDragOver={(event) => this.onDragOver(event)} onDrop={(event) => this.onDrop(event,i)}
        >
          <div className="dayvalue">{i}</div>
          {filteredreminders.map((reminder,index) => { return (<Reminder key={index} reminder={reminder} editreminder={this.showreminderForm} deletereminder={this.deleteReminder} ondragstart={this.onDragStart} />)})}
          {
            this.state.toggleform && this.state.clickedday === i
            ? <Reminderform day={datestring} fetchreminders={this.fetchReminders} filteredreminder={filteredreminder} toggleform={this.toggleform}></Reminderform>
            : (
               this.state.toggleform
               ? ""
               : <button className="addReminder" day={i} id="" onClick={this.showreminderForm}>+</button>
              )
          }
        </div>
      );
    }

    let monthEndDay = (new Date(currentYear,currentMonth,numberofdaysinMonth)).getDay();

    if(monthEndDay !== 6){

      let style = {
        width : (6-monthEndDay)*14+"%"
      }

      daysBody.push(<div className="unusedview month-body" key={numberofdaysinMonth+1} style={style}></div>)
    }

    return (
        <>
          <Month
            gotoprevmonth = {this.gotoPrevMonth}
            gotonextmonth = {this.gotoNextMonth}
            currentmonth = {currentmonthName}
            currentyear = {currentYear}
            weekday = {weekdayHeader}
            days = {daysBody}
          >
          </Month>
        </>
    );
  }
}

export default Calendar;