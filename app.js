const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const http = require('http');
const { STATUS_CODES } = require('http');
const CronJob = require('cron').CronJob;
const port = 3210;
require('dotenv').config();

// Setting express middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
const mockApi = require('./mockApi');
app.use('/mock', mockApi);

// Setting Global Variables for fetch API response
var accessToken;
var expiresIn;
var refreshStatus;
var lastTimeFetched;

// Axios configuration
var config = {
    method: 'post',
    url: process.env.API_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + process.env.BASIC_AUTHORIZATION

    }
};

function periodicallyFetch() {
    axios(config)
        .then(function (response) {
            accessToken = response.data.access_token;
            expiresIn = response.data.expires_in;
            refreshStatus = "success";
            lastTimeFetched = new Date;
            console.log(JSON.stringify(response.data));
            return "success"
        })
        .catch(function (error) {
            refreshStatus = error;
            console.log(JSON.stringify(error));
            return error
        });
}

periodicallyFetch()
// Setting Cron JOB for periodic fetch API
var CronJOB = new CronJob(process.env.CRON_JOB_SCHEDULER, function () {
    var time = new Date;
    console.log(time, ' JOB will run periodically');
    var funcStatus =  periodicallyFetch();
    console.log(time, 'JOB Run successfully: ');
}, null, true, 'America/Los_Angeles');
// Starting Cron Job
CronJOB.start();

// REST API

app.all('/app/v1/periodically-fetch', async (req, res) => {
    res.status(200).json({
        accessToken: accessToken,
        refreshStatus: refreshStatus,
        lastTimeFetched: lastTimeFetched,
        expiresIn: expiresIn,
        message: STATUS_CODES[200]
    });
});

app.listen(port, () => {
    console.log(`periodically-fetch Server listening on port  ${port}`);
});