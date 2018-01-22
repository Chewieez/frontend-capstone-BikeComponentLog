const functions = require('firebase-functions');
// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({ origin: true });

// const corsOptions = {
//     origin: '*',
//     allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
//     methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
// };


exports.stravaInfo = functions.https.onRequest((req, res) => {
    let stravaSecret = functions.config().stravalink.secret

    cors(req, res, () => {
        res.send(stravaSecret);
    });



// console.log("sending info")
// res.status(200).send(stravaSecret)

    
})



// let stravaAuthCode = req.originalUrl
// // debugger 
// stravaAuthCode = stravaAuthCode.split("code=")[1].split("#")[0]

// return request({
//     url: 'https://www.strava.com/oauth/token',
//     headers: {
//         'client_id': 21849,
//         'client_secret': functions.config().stravalink.secret,
//         'code': stravaAuthCode
//     },
//     body: { email: email }
// });