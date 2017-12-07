angular.module("BikeLogApp").controller("stravaResponseCtrl", function ($scope, StravaOAuthFactory) {
    
    $scope.getToken = function() {
        // parse the Auth code out of the returned URL
        const StravaAuthCode = window.location.href.split("code=")[1].split("#")[0]
        console.log("StravaAuthCode: ", StravaAuthCode)
    }

})