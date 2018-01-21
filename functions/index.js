const functions = require('firebase-functions');
// const request = require('request-promise');
// const app = express();

const client = "hello"

exports.userCreated = functions.database.ref('/users/{id}').onWrite(event => {

    return client
//   let email = event.data.child('email').val();

//   return request({
//     url: 'https://someservice.com/api/some/call',
//     headers: {
//       'X-Client-ID': functions.config().stravalink.clientid,
//       'Authorization': `Bearer ${functions.config().someservice.key}`
//     },
//     body: {email: email}
//   });
});