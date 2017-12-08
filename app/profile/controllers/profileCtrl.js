angular.module("BikeLogApp").controller("profileCtrl", function ($scope, $routeParams, ProfileFactory, AuthFactory, StravaOAuthFactory) {
    // create variable to hold the user profile
    $scope.currentUserProfile = {}

    // get current user 
    const currentUser = AuthFactory.getUser()
    
    ProfileFactory.getProfile(currentUser.uid).then(response=> {
        // assign the returned userProfile to the scope variable to display in partial
        $scope.currentUserProfile = response
    })

    

})