//Totals the minute data for the last hour and then
//gets the average and stores it in the HourAvg table

var mysql = require('mysql');
var connection = mysql.createConnection({
					host:'danu6.it.nuigalway.ie',
					database:'mydb1408',	
					user:'mydb1408lm',
					password:'xi5kej'
				});
var totalTemp = 0;
var totalSolar =0;
var totalRain =0;
var totalHumidity=0;
var totalWind=0;
var totalGust =0;
var totalPressure =0;
//var getData;




		
var getData = function(){
			//connect to data base				
			connection.connect();				
			//send query to data base	
			connection.query('SELECT * FROM History ORDER BY upDateMinute DESC LIMIT 60', function(err, rows,fields){
				if (err) throw err;
				//get totals for last hour
				//value for rain is the total rain for the last hour so doesn't need to be averaged
				totalRain  =  rows[0]['rainFall'];
				for(var i = 0; i < 60; i++){
					totalTemp  +=  rows[i]['Temp'];
					totalSolar +=  rows[i]['totalSolar'];
					totalHumidity +=  rows[i]['Humidity'];
					totalWind +=  rows[i]['windSpeed'];
					totalGust +=  rows[i]['gust'];
					totalPressure +=  rows[i]['Barometer'];
				}
				
				//get average of totals for last hour
				tempAve = totalTemp/60;
				solarAve = totalSolar/60;
				
				humidityAve = totalHumidity/60;
				windAve = totalWind/60;
				gustAve = totalGust/60;
				pressureAve = totalPressure/60;
				console.log(tempAve,solarAve);
				
				//store them in var to post to database
				var post  = {Time:new Date(),
							 TempHAve:tempAve,
							 SolarAve: solarAve,
							 RainAve: totalRain,
							 HumidityAve:humidityAve,
							 WindAve:windAve,
							 GustAve:gustAve, 
							 PressureAve:pressureAve};
							 
				connection.query('INSERT INTO HourAvg  SET ?',post, function(err, rows,fields){
				if (err) throw err;		
				});
				connection.query('DELETE FROM HourAvg LIMIT 1' , function(err, rows,fields){
				if (err) throw err;		
				});
				connection.end();
			
				});
				
			
		};
		getData();




		
		
			
		
