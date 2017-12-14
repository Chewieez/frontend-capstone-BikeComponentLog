angular.module("BikeLogApp").controller("profileCtrl", function ($scope, $route, $location, ProfileFactory, AuthFactory, StravaOAuthFactory) {
    // get current user 
    const currentUser = AuthFactory.getUser()
    
   
    // get current user profile
    ProfileFactory.getProfile(currentUser.uid).then(response=> {
        // assign the returned userProfile to the scope variable to display in partial
        if (response) {
            $scope.currentUserProfile = response
        }
    }).then(()=>{
        // variable to hold edit mode flag
        $scope.editMode = false
        // flag to check if there is a profile created yet or not, to control whether the user is able to create their profile or update the info after they have a profile
        $scope.profileFlag = false

        if (ProfileFactory.profileCache) {
            $scope.profileFlag = true
        }
        
    })
    
    // create a object to hold the profile info from the form
    $scope.currentUserProfile = {}

        
    // create function to handle the click on profile.html when a user wants to create a profile
    $scope.addProfile = function () {
        const userId = AuthFactory.getUser()
        
        const userProfile = {
            "firstName": $scope.currentUserProfile.firstName,
            "lastName": $scope.currentUserProfile.lastName,
            "photo": 0,
            "stravaId": 0,
            "userId": userId.uid
        }
    
        ProfileFactory.addProfile(userProfile, userId.uid).then(()=>{
            //reload view so user can get confirmation their profile was created
            $location.url("/dashboard")
        })
    }

    // function to edit profile
    $scope.editProfile = function () {
        $scope.editMode = true
    }

     
    $scope.updateProfile = function() {

        ProfileFactory.editProfile($scope.currentUserProfile).then(()=>{
            $scope.editMode = false
            // $route.reload()
            $location.url("/dashboard")
        })
    }

    $scope.cancelUpdate = function() {
        $scope.editMode = false
        $location.url("/dashboard")
    }

})