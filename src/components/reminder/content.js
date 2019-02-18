import React from 'react';

import Moment from 'moment';

let Reminder = (props) => {
  return (
  	<div className="reminder-details" style={{background : props.reminder.color}}>
	    <div className="reminder-actions">
	        <button className="glyphicon glyphicon-remove" onClick={() => props.deletereminder(props.reminder._id)}></button>
	        <button className="glyphicon glyphicon-edit" onClick={(event) => props.editreminder(event,true)} day={Moment(props.reminder.datetime,"YYYY-MM-DD HH:mm:ss").format("D")} id={props.reminder._id}></button>
	    </div>
      	<span className="reminder-note">{props.reminder.note}</span>
      	<span className="reminder-time">{Moment(props.reminder.datetime).format("hh:mm A")}</span>
  	</div>
  );
};

export default Reminder;