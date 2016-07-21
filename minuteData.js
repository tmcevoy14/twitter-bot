//gets the live data from the NUIG weather site
//and stores it every minute in the History table
var mysql = require('mysql');

		var request;
		var weatherData;
		var dataArray;
		var txtTemp;
		var request;
		var allData;
		request = require("request");
		
		var getData = function(){
			
			
			request("http://weather.nuigalway.ie/getLiveData.php", function(error,response,weatherData){
				dataArray = weatherData.split(",");
				
				console.log(weatherData);
				var connection = mysql.createConnection({
					host:'danu6.it.nuigalway.ie',
					database:'mydb1408',	
					user:'mydb1408lm',
					password:'xi5kej'
				});
				var post  = {upDateMinute:dataArray[0],
							 WindDirection: dataArray[1],	
							 Temp: dataArray[2],
							 Barometer: dataArray[3],
							 windSpeed:dataArray[4],
							 gust:dataArray[5],
							 Humidity:dataArray[6], 
							 totalSolar:dataArray[7],
							 diffuseSolar:dataArray[8],							 
							 upDateHour:dataArray[26],
							 rainFall:dataArray[27],
							 todaySR:dataArray[29],
							 todaySS:dataArray[30]};
							 
				var avg = {	avgYesTemp:dataArray[9],
							 maxYesTemp:dataArray[10],
							 minYesTemp:dataArray[11],
							 avgYesWindSpeed:dataArray[12],
							 maxYesWindSpeed:dataArray[13],
							 avgYesWD:dataArray[14],
							 maxYesGust:dataArray[15],
							 avgYesBar:dataArray[16]}		 
				connection.connect();

				connection.query('INSERT INTO History  SET ?',post, function(err, rows,fields){
				if (err) throw err;		
				});
				connection.query('DELETE FROM History LIMIT 1' , function(err, rows,fields){
				if (err) throw err;		
				});

				connection.query('SELECT Temp FROM History ORDER BY upDateMinute DESC LIMIT 1', function(err, rows,fields){
				if (err) throw err;
		
				console.log(rows);
				});
				//need to close the connection inside the callback 
				//if put at the end it closes the connection before they 
				//are used
				connection.end();
				
				
				
			})
			
			
		};
		getData();
		
		
		
		
			
		
