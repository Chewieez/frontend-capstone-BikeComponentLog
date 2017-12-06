angular.module("BikeLogApp").controller("updateProfileCtrl", function ($scope, $routeParams, ProfileFactory, AuthFactory, $location) {


    // create function to handle the click on profile.html when a user wants to create a profile
    $scope.addProfile = function () {
        const fbUser = AuthFactory.getUser()

        const userProfile = {
            "firstName": $scope.user.firstName,
            "lastName": $scope.user.lastName,
        }

        ProfileFactory.addProfile(userProfile, fbUser.uid)

    }

})