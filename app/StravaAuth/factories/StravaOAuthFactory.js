angular.module("BikeLogApp").factory("StravaOAuthFactory", function ($http, STRAVA_CONFIG, $location, $route) {

    return Object.create(null, {
        "stravaId": {
            value: "",
            writable: true,
            enumerable: true
        },
        "getToken": {
            value: (stravaCode) => {
                return $http({
                    "method": "POST",
                    "url": "https://www.strava.com/oauth/token",
                    "data": {
                        client_id: STRAVA_CONFIG.clientId,
                        client_secret: STRAVA_CONFIG.clientSecret,
                        code: stravaCode
                    }
                })
            }
        },
        "getStravaProfile": {
            value: (token) => {
                return $http({
                    "method": "GET",
                    "url": `https://www.strava.com/api/v3/athlete?access_token=${token}`,
                })
            }
        }
    })
})    