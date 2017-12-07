angular.module("BikeLogApp").controller("updateProfileCtrl", function ($scope, $routeParams, ProfileFactory, AuthFactory, $location, StravaOAuthFactory) {

    // $scope.linkStrava = function() {
    //     window.href = "https://www.strava.com/oauth/authorize?client_id=21849&response_type=code&redirect_uri=http://localhost:8080/#!/strava-response&approval_prompt=auto"
    // }

    $scope.stravaId = ""
    if (StravaOAuthFactory.stravaId) {
        $scope.stravaId = StravaOAuthFactory.stravaId
    }


    // create function to handle the click on profile.html when a user wants to create a profile
    $scope.addProfile = function () {
        const fbUser = AuthFactory.getUser()

        const userProfile = {
            "firstName": $scope.user.firstName,
            "lastName": $scope.user.lastName,
        }

        if ($scope.stravaId) {
            userProfile.stravaId = $scope.stravaId
        }
        ProfileFactory.addProfile(userProfile, fbUser.uid)
    }



})