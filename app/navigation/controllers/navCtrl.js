angular.module("BikeLogApp").controller("navCtrl", function ($scope, $location, AuthFactory) {
    
    // passing through functions to the AuthFactory to authenticate user
    $scope.isAuthenticated = () => AuthFactory.isAuthenticated();

    // logout the user
    $scope.logout = () => AuthFactory.logout();

})