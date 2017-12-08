angular.module("BikeLogApp").factory("StravaOAuthFactory", function ($http, STRAVA_CONFIG, $location, $route) {

    return Object.create(null, {
        "stravaId": {
            value: "",
            writable: true,
            enumerable: true
        },
        "getCode": {
            value: function() {
                return $http({
                    "method": "GET",
                    "url": "https://www.strava.com/oauth/authorize?client_id=21849&response_type=code&redirect_uri=http://localhost:8080/#!/strava-response&state=logged&approval_prompt=auto"
                }).then(r =>{
                    console.log(r)
                })
            }
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