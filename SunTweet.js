// checks the value of the total sun irradiance and tweets
//a warning if it is above 800 but only if it has been more than
//12 hours since last tweet

//requires use of node twit module
var Twit = require('twit');

//requires use of node mysql module
var mysql = require('mysql');
//Database connection details
var connection = mysql.createConnection({
					host:'danu6.it.nuigalway.ie',
					database:'mydb1408',	
					user:'mydb1408lm',
					password:'xi5kej'
				});
				
//Twitter app connection details				
var T = new Twit({
			  consumer_key:         'TOJYxQnDSvRkYlSGyVE3pg'
			, consumer_secret:      'GAQbx8s14ocCtBSSRlHbuf1LHCrID8IJty5hRMiIU0'
			, access_token:         '2413052664-wuyjRZGRnEhDw2MR1XHOOqykVxkomAzIVhiIgwk'
			, access_token_secret:  'eJ4nkrKoxl4mtPlo9nccwxKuVTITkDWidgOurFa2cktlr'
		});
var lastTweetTime;
var currentTime;	
var minTweetInterval = 43200000; //12 hours
var burnLevel = 800;
var sun = 0;
var lastTweetTime = 0;
//Function to get solar data from database and post tweet if returned data satisfies condition  		
function getSunData(){
			//gets the solar average 
	 connection.query('SELECT SolarAve FROM HourAvg ORDER BY Time DESC LIMIT 1', function(err, rows,fields){
		if (err) throw err;
		sun = rows[0]['SolarAve'];			
		console.log(sun);
		//gets the last time the solar average was tweeted
		connection.query('SELECT SunTweet FROM LastTweet ' , function(err, rows,fields){
			if (err) throw err;	
			lastTweetTime =	rows[0]['SunTweet'];
			console.log(lastTweetTime);
			currentTime = new Date().getTime();
										//check if its more than 12 hours since last tweet about sun burn
				if ((sun > burnLevel) && (currentTime > (lastTweetTime + minTweetInterval) )){
					
					T.post('statuses/update', { status: 'sun index has been more than  '+sun +' for the last hour' }, function(err, reply) { }) 
						
					//function to update last tweet time for sunshine to database
					connection.query('UPDATE LastTweet  SET ?',{SunTweet:currentTime}, function(err, rows,fields){
						if (err) throw err;		
					});
					
					console.log(lastTweetTime);
					
				}
					
			connection.end();			
		});	//close query for time of last tweet								
	});	//close query for sun data	
};//end function
getSunData()

