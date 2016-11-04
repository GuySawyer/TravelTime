var https = require('https');
var fs = require('fs');

var travel_time;

var home = "12+Greenways+Road,+Cape+Town";
var work = "32+Darters+Road,+Cape+Town";

var options = {
  host: 'maps.googleapis.com',
  path: '/maps/api/directions/json\?origin\='+home+'\&destination\='+work+'\&mode\=driving\&key\=AIzaSyAH0lYaA1fNYDjWJ1XB2LcmwTNoeJt2zls\&departure_time\=now\&traffic_model\=best_guess'
};
var optionsReverse = {
  host: 'maps.googleapis.com',
  path: '/maps/api/directions/json\?origin\='+work+'\&destination\='+home+'\&mode\=driving\&key\=AIzaSyAH0lYaA1fNYDjWJ1XB2LcmwTNoeJt2zls\&departure_time\=now\&traffic_model\=best_guess'
};

callback = function(response) {
  var str = '';
  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
});

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    var obj = JSON.parse(str);
    travel_time = obj.routes[0].legs[0].duration_in_traffic.value/60;
    
    var dateTime = getDateTime();
      
    fs.appendFile("Home-Work", "Time: " +dateTime+ " Duration: " +travel_time+"\n", function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
  
  });
}

callback2 = function(response) {
  var str = '';
  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
});

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    var obj = JSON.parse(str);
    travel_time = obj.routes[0].legs[0].duration_in_traffic.value/60;
    
    var dateTime = getDateTime();
      
    fs.appendFile("Work-Home", "Time: " +dateTime+ " Duration: " +travel_time+"\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  
  });
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

var minutes = 2, the_interval = minutes * 60 * 1000;
setInterval(function() {
    // do your stuff here
    https.request(options, callback).end();
    https.request(optionsReverse, callback2).end();
}, the_interval);