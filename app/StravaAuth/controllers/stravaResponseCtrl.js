angular.module("BikeLogApp").controller("stravaResponseCtrl", function ($scope, $location, $timeout, StravaOAuthFactory, ProfileFactory, AuthFactory) {

    //console.log("Loaded now")
    let stravaToken = ""
    let stravaId = ""
    // parse the Auth code out of the returned URL
    const stravaAuthCode = window.location.href.split("code=")[1].split("#")[0]
    // console.log("stravaAuthCode: ", stravaAuthCode)

    // trade the code for a token from Strava
    StravaOAuthFactory.getToken(stravaAuthCode).then(response => {
        stravaToken = response.data.access_token
        StravaOAuthFactory.getStravaProfile(stravaToken).then(response => {

            stravaId = response.data.id
            
        })
    })

    // function runs on OK button click
    $scope.addStraveToProfile = function() {
        // get current user
        let user = AuthFactory.getUser()
        // get current profile
        let userProfile = ProfileFactory.profileCache
        

        ProfileFactory.getProfile(user.uid).then(response => {
            
            let userProfile = response
            // add strava ID to the current user Profile
            userProfile.stravaId = stravaId
            // store the updated user profile in Firebase
            ProfileFactory.editProfile(userProfile)

            // after a little bit of time, redirect user to profile. Setting timeout to make sure that when the user lands back in Profile page, firebase has been updated with the strava Id and the Profile page will reflect that the user has already connected with Strava. I attempted putting this inside a .then() after the ProfileFactory.editProfile() promise, but it was not working. 
            $timeout(function(){
                $location.url("/profile")
            }, 500)
            
        })
    }




})