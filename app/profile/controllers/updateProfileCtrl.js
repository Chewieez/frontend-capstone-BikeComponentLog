angular.module("BikeLogApp").controller("updateProfileCtrl", function ($scope, $routeParams, ProfileFactory, AuthFactory, $location, StravaOAuthFactory, $scope.editMode) {

    // create variable to hold the strava id of user
    $scope.stravaId = ""

    // variable to hold edit mode flag
    $scope.editMode = false
    
    // create function to handle the click on profile.html when a user wants to create a profile
    $scope.addProfile = function () {
        const userId = AuthFactory.getUser()

        const userProfile = {
            "firstName": $scope.user.firstName,
            "lastName": $scope.user.lastName,
            "photo": 0,
            "stravaId": 0,
            "userId": userId.uid
        }

        ProfileFactory.addProfile(userProfile, userId.uid)
    }

    // create function to edit the current profile
    $scope.editProfile = function() {
        const userProfile = ProfileFactory.profileCache


        const updated

    }



})