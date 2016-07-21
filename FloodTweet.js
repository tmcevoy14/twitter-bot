//Checks the total rain for the last 24 hours
//and tweets if it is more than 25mm but only
//if it has been more than 12 hours since last tweet


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
var floodWarning = 25;
var minTweetInterval = 43200000; //12 hours
var currentTime;	
var totalRain = 0;
var lastTweetTime = 0;
//Function to get solar data from database and post tweet if returned data satisfies condition  		
function getRainData(){
			//gets the solar average 
	 connection.query('SELECT RainAve FROM HourAvg ORDER BY Time ASC LIMIT 24', function(err, rows,fields){
				if (err) throw err;
				
				for(var i = 0; i < 24; i++){
					totalRain  +=  rows[i]['RainAve'];
					
				}
				console.log(totalRain);
				
			
		//gets the last time the solar average was tweeted
		connection.query('SELECT FloodTweet FROM LastTweet ' , function(err, rows,fields){
			if (err) throw err;	
			lastTweetTime =	rows[0]['FloodTweet'];
			console.log(lastTweetTime);
			currentTime = new Date().getTime();
										//check if its more than 12 hours since last tweet about flood
				if ((totalRain > floodWarning) && (currentTime > (lastTweetTime + minTweetInterval) )){
					
					T.post('statuses/update', { status: 'Danger of flooding there has been more than  '+totalRain  +'mm  of rain in the last 24 hours' }, function(err, reply) { }) 
						
					//function to set last tweet time for sunshine to database
					connection.query('UPDATE LastTweet  SET ?',{FloodTweet:currentTime}, function(err, rows,fields){
						if (err) throw err;		
					});
					
					
				}
					
			connection.end();			
		});	//close query for time of last tweet								
	});	//close query for sun data	
};//end function
getRainData()