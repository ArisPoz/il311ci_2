let express = require('express');
let apiRoutes = require("./api-routes");
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let app = express();

app.use(bodyParser.urlencoded({
   extended: true
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/il311ci', 
            {   
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                useFindAndModify: false
            });
var db = mongoose.connection;

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

var port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send
    (
        'Hi this is an application to manage 311 Chicago incidents. To access it go to /api'
    ));

app.use('/api', apiRoutes)

app.listen(port, function () {
    console.log("Application is running and listening on port " + port);
});