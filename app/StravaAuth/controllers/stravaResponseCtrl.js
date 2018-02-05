angular.module("BikeLogApp").controller("stravaResponseCtrl", function ($scope, $location, $timeout, StravaOAuthFactory, ProfileFactory, AuthFactory, $mdToast) {

    let stravaToken = ""
    let stravaId = ""

    // parse the Auth code out of the returned URL
    const stravaAuthCode = window.location.href.split("code=")[1].split("#")[0]


    // get info needed for api to make link to Strava
    StravaOAuthFactory.getStravaCallData().then((response) => {
        
        let code = response.data;
        
        // trade the code for a token from Strava
        StravaOAuthFactory.getToken(stravaAuthCode, code).then(response => {
            
            stravaToken = response.data.access_token
            StravaOAuthFactory.getStravaProfile(stravaToken).then(response => {
                stravaId = response.data.id
            })
        })
    })
    
 
    // function runs on OK button click
    $scope.addStraveToProfile = function() {
        // get current user
        let user = AuthFactory.getUser()
        
        // get current profile and add strava data to it and upload to firebase
        ProfileFactory.getProfile(user.uid).then(response => {
            
            let userProfile = response
            // add strava ID to the current user Profile
            userProfile.stravaId = stravaId
            userProfile.stravaToken = stravaToken
            // store the updated user profile in Firebase
            ProfileFactory.editProfile(userProfile).then( r => {
                $mdToast.show(
                    $mdToast.simple()
                        .parent($("#toast-container"))
                        .textContent("Successfully linked your Strava account!")
                        .hideDelay(3000)
                );
            })

            // after a little bit of time, redirect user to profile. Setting timeout to make sure that when the user lands back in Profile page, firebase has been updated with the strava Id and the Profile page will reflect that the user has already connected with Strava. I attempted putting this inside a .then() after the ProfileFactory.editProfile() promise, but it was not working. 
            $timeout(function(){
                $location.url("/dashboard")
            }, 500)
            
        })
    }
})