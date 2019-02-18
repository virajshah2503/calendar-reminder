import React from 'react';

let Month = (props) => {
	return (
		<>
			<div className="calendar-header">
		        <div className="calendar-prevmonth">
		            <span className="glyphicon glyphicon-menu-left" onClick={props.gotoprevmonth}></span>
		        </div>
		        <div className="calendar-currentmonth">
		        	{props.currentmonth}, {props.currentyear}
		        </div>
		        <div className="calendar-nextmonth">
		            <span className="glyphicon glyphicon-menu-right" onClick={props.gotonextmonth}></span>
		        </div>
	        </div>
			<div className="weeks">
				{props.weekday}
			</div>
	        <div className="days">
	        	{props.days}
			</div>
		</>
	);
};

export default Month;