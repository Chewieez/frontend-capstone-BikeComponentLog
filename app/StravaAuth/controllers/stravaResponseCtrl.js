angular.module("BikeLogApp").controller("stravaResponseCtrl", function ($scope, $location, $timeout, StravaOAuthFactory, ProfileFactory, AuthFactory) {

    console.log("Loaded now")
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

            stravaId = response.data.id
            // $location.url("/update-profile")
        })
    })

    $scope.addStraveToProfile = function() {
        let user = firebase.auth().currentUser
        let userProfile
        ProfileFactory.getProfile(user.uid).then(response => {
            
            userProfile = response
            // add strava ID to the current user Profile
            userProfile.stravaId = stravaId
            // store the updated user profile in Firebase
            ProfileFactory.editProfile(userProfile)
        })
    }




})