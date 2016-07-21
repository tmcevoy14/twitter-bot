// Checks the average temp for the last hour and tweets if 
//is below 3 degrees but only if it has been more than 6 hours since last tweet

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
var minTweetInterval = 21600000; //12 hours
var currentTime;
var freezingPoint = 3;	
var temp = 0;
var lastTweetTime = 0;
//Function to get solar data from database and post tweet if returned data satisfies condition  		
function getTempData(){
			//gets the solar average 
	 connection.query('SELECT TempHAve FROM HourAvg ORDER BY Time DESC LIMIT 1', function(err, rows,fields){
		if (err) throw err;
		temp = rows[0]['TempHAve'];			
		console.log(temp);
		//gets the last time the solar average was tweeted
		connection.query('SELECT IceTweet FROM LastTweet' , function(err, rows,fields){
			if (err) throw err;	
			lastTweetTime =	rows[0]['IceTweet'];
			console.log(lastTweetTime);
			currentTime = new Date().getTime();
										//check if its more than 12 hours since last tweet about ice
				if ((temp < freezingPoint) && (currentTime > (lastTweetTime + minTweetInterval) )){
					
					T.post('statuses/update', { status: 'Danger of ice the average temp has been below '+temp +'c for the last hour' }, function(err, reply) { }) 
						
					//function to set last tweet time for sunshine to database
					connection.query('UPDATE LastTweet  SET ?',{IceTweet:currentTime}, function(err, rows,fields){
						if (err) throw err;		
					});
					
					
				}
					
			connection.end();			
		});	//close query for time of last tweet								
	});	//close query for sun data	
};//end function
getTempData()
