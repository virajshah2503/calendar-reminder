let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ReminderSchema = new Schema({
    note : {type: String, required: true},
    datetime : {type: Date, required: true},
    color: {type: String, required : true, default : '#000'},
	},
	{
		timestamps : true
	}
);


module.exports = mongoose.model('Reminder', ReminderSchema);