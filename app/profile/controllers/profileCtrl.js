angular.module("BikeLogApp").controller("profileCtrl", function ($scope, $routeParams, ProfileFactory, AuthFactory, StravaOAuthFactory) {

    $scope.currentUserProfile = {}

    // get profile of current user and store in $scope variable
    const currentUser = AuthFactory.getUser()
    
    ProfileFactory.getProfile(currentUser.uid).then(response=> {
        console.log(response)

        $scope.currentUserProfile = response
        // for (let key in response.data) {
        //     $scope.currentUserProfile = response.data[key]
        // }
    })

    $scope.link = function() {
        StravaOAuthFactory.getCode()
    }



    // create a function to handle the click on profile.html when a user wants to edit their profile
    // $scope.updateProfile = function() {
    //     $location.url("/updateProfile")
    //     ProfileFactory.editProfile($scope.currentUserProfile)
    // }

})