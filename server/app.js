let express = require('express');
let bodyParser = require('body-parser');

let route_reminder = require('./routes/routing_reminder');
let app = express();

let mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/localmongodb';

mongoose.connect(dev_db_url,{ useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/',(req,res,next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");

	console.log("requested at : " + (new Date()).toString());
	next();
});

app.use('/reminders', route_reminder);

const port = 30001;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});