let moment = require('moment');

let Reminder = require('../models/schema_reminder');

exports.reminder_add = function (req, res) {

    let reminder = new Reminder(
        {
            note: req.body.note,
            datetime: moment(req.body.datetime),
            color : req.body.color
        }
    );

    reminder.save(function (err) {
        if (err) {
            res.json(
                {
                    data : {
                        status : 0,
                        message : "Something went wrong."
                    }
                }
            )
        }

        res.json(
            {
                data : {
                    status : 1,
                    message : "Reminder added successfully."
                }
            }
        );
    })
};

exports.reminder_edit = function (req, res) {
    Reminder.findByIdAndUpdate(req.params.id, {$set: {
        note : req.body.note,
        datetime : moment(req.body.datetime)
    }}, function (err, reminder) {
        if (err || !reminder){
            res.json(
                {
                    data : {
                        status : 0,
                        message : "Something went wrong."
                    }
                }
            )
        }

        res.json(
            {
                data : {
                    status : 1,
                    message : "Reminder edited successfully."
                }
            }
        );
    });
};

exports.reminder_delete = function (req, res) {
    Reminder.findByIdAndRemove(req.params.id, function (err) {
        if (err){
            res.json(
                {
                    data : {
                        status : 0,
                        message : "Something went wrong."
                    }
                }
            )
        }
        res.json(
            {
                data : {
                    status : 1,
                    message : "Reminder deleted successfully."
                }
            }
        );
    })
};

exports.reminder_fetch = function(req,res){
    let startDateTime = moment(req.params.startDate + " 00:00:00");
    let endDateTime = moment(req.params.endDate + " 23:59:59");

    Reminder.find({
        datetime: {"$gte": startDateTime, "$lt": endDateTime}
    })
    .select('id note color datetime')
    .exec((err,reminders) => {
        res.json(
            {
                data : {
                    status : 1,
                    message : "Reminder fetched successfully.",
                    reminders : reminders
                }
            }
        );
    })
}