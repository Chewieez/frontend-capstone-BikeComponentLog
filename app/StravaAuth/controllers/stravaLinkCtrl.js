angular.module("BikeLogApp").controller("stravaLinkCtrl", function ($scope, ProfileFactory, StravaOAuthFactory, $location) {

    $scope.linkStrava = function () {
        StravaOAuthFactory.link()
    }
})