angular.module("BikeLogApp").controller("navCtrl", function ($scope, $location, $rootScope, AuthFactory, ProfileFactory) {
    
    // passing through functions to the AuthFactory to authenticate user
    $scope.isAuthenticated = () => AuthFactory.isAuthenticated();

    $scope.currentUserProfile
    $rootScope.$on("authenticationSuccess", function () {
        $scope.currentUser = AuthFactory.getUser()

        ProfileFactory.getProfile($scope.currentUser.uid).then((user)=>{

            $scope.currentUserProfile = user
        })
    })


    // logout the user
    $scope.logout = () => AuthFactory.logout();


    // dropdown menu code
    $scope.open1 = false; //initial value
    $scope.open2 = false; //initial value
    $scope.open3 = false; //initial value
    $scope.open4 = false; //initial value
	
    $scope.toggle = function(itemPos) {
        if ($scope.menuIsOpen === itemPos) {
            $scope.menuIsOpen = 0;
            // $scope.class = "fa-chevron-down rotate180";
        }
        else {
            $scope.menuIsOpen = itemPos;
            // $scope.class = "fa-chevron-down";
        }
    }



})