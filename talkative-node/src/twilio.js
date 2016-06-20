const accountSid = 'AC49c3898540c4e571bf88ca4e59c52367'; // Your Account SID from www.twilio.com/console
const authToken = '78130c3351637fd6161e3c14584ac2ba';   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const client = new twilio.RestClient(accountSid, authToken);

client.messages.create({
    body: 'Hello',
    to: '+14163195100',  // Text this number
    from: '+16474964226' // From a valid Twilio number
}, function(err, message) {
    console.log(message.sid);
});
