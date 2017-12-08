angular.module("BikeLogApp").controller("updateProfileCtrl", function ($scope, $routeParams, ProfileFactory, AuthFactory, $location, StravaOAuthFactory) {

    // create variable to hold the strava id of user
    $scope.stravaId = ""

    
    // create function to handle the click on profile.html when a user wants to create a profile
    $scope.addProfile = function () {
        const fbUser = AuthFactory.getUser()

        const userProfile = {
            "firstName": $scope.user.firstName,
            "lastName": $scope.user.lastName,
        }
    }



})