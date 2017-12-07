angular.module("BikeLogApp").factory("StravaOAuthFactory", function ($http, $timeout, $location, $route) {

    return Object.create(null, {
        "link": {
            value: () => {
                return $http({
                    "url": "https://www.strava.com/oauth/authorize?client_id=21849&response_type=code&redirect_uri=http://localhost:8080/#!/strava-link&approval_prompt=auto"
                }).then((response)=>{
                    console.log("response to strava auth", response)
                })
            }
        }
    })
})    