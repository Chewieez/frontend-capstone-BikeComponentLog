angular.module("BikeLogApp").controller("stravaResponseCtrl", function ($scope, $location, $timeout, StravaOAuthFactory, ProfileFactory, AuthFactory, $mdToast) {
    let stravaId = ""

    // parse the Auth code out of the returned URL
    const stravaAuthCode = window.location.href.split("code=")[1].split("&")[0]


    // get info needed for api to make link to Strava
    StravaOAuthFactory.getStravaCallData().then((response) => {
        if (response && response.data) {

            const code = response.data;
            
            // trade the code for a token from Strava
            StravaOAuthFactory.getActivityToken(stravaAuthCode, code).then(response => {
                if (response) {
                    StravaOAuthFactory.getStravaProfile(StravaOAuthFactory.stravaActivityToken).then(response => {
                        if (response?.data?.id) {
                            stravaId = response.data.id

                            // Save the strava info to the user's profile
                            addStravaToProfile();
                        }
                    });
                }
            });
        }
    });
    
    function addStravaToProfile() {
        // get current user
        const user = AuthFactory.getUser()
        
        // get current profile and add strava data to it and upload to firebase
        ProfileFactory.getProfile(user.uid).then(response => {
            
            const userProfile = response
            // add strava ID to the current user Profile
            userProfile.stravaId = stravaId;
            userProfile.stravaCode = stravaAuthCode;

            // store the updated user profile in Firebase
            ProfileFactory.editProfile(userProfile).then(r => {
                $mdToast.show(
                    $mdToast.simple()
                        .parent($("#toast-container"))
                        .textContent("Successfully linked your Strava account!")
                        .hideDelay(3000)
                );
            })

            $location.url("/profile");
        })
    }
})