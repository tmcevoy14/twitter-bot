//Node express server that responds to requests for 
//live data, past pressure and average values for the last hour

var mysql = require('mysql');
var express = require('express');
var app = express();
var connection = mysql.createConnection({
					host:'danu6.it.nuigalway.ie',
					database:'mydb1408',	
					user:'mydb1408lm',
					password:'xi5kej'
				});
				
app.get('/liveData', function(req,res){
			
			connection.query('SELECT * FROM History ORDER BY upDateMinute DESC LIMIT 1 ', function(err, rows,fields){
				if (err) throw err;
				//code to test result
				console.log(rows[0]['Temp']);
				
				res.send(rows[0]);
				});
				
	});
app.get('/pastPressure', function(req,res){
				
			var data = req.param('value');
			connection.query('SELECT PressureAve FROM HourAvg ORDER BY Time DESC LIMIT 24', function(err, rows,fields){
				if (err) throw err;
				
				res.send(rows[data]);
				});
				
	});
app.get('/hourAve.txt', function(req,res){
				
				
			connection.query('SELECT * FROM HourAvg ORDER BY Time  LIMIT 24', function(err, rows,fields){
				if (err) throw err;
				console.log('test');
				console.log(rows);
				res.send(rows);
				});
				
	});

				
	
app.listen(8706,function(){
	console.log('listening');
	});