const functions = require('firebase-functions');

// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({ origin: true });


exports.stravaInfo = functions.https.onRequest((req, res) => {
    let stravaSecret = functions.config().stravalink.secret

    cors(req, res, () => {
        res.send(stravaSecret);
    });
})
