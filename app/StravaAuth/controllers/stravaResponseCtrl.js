angular.module("BikeLogApp").controller("stravaResponseCtrl", function ($scope, $location, $timeout, StravaOAuthFactory, ProfileFactory, AuthFactory) {


    let stravaToken = ""
    let stravaId = ""
    // parse the Auth code out of the returned URL
    const stravaAuthCode = window.location.href.split("code=")[1].split("#")[0]
    // console.log("stravaAuthCode: ", stravaAuthCode)

    // trade the code for a token from Strava
    StravaOAuthFactory.getToken(stravaAuthCode).then(response => {
        stravaToken = response.data.access_token
        StravaOAuthFactory.getStravaProfile(stravaToken).then(response => {
            console.log("athlete data: ", response)
            debugger

            stravaId = response.data.id
            StravaOAuthFactory.stravaId = stravaId
            debugger
            $location.url("/update-profile")
        })
    })




})