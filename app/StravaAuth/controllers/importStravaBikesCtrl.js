angular.module("BikeLogApp").controller("importStravaBikesCtrl", function ($scope, $location, $route, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {

    $scope.bikesToImport = []
    let allBikesFromStrava = []

    // get the current user
    const user = AuthFactory.getUser()

    $scope.currentUserProfile

    // get current user Profile to get their Strava Id 
    ProfileFactory.getProfile(user.uid).then(profile => {
        $scope.currentUserProfile = profile

        StravaOAuthFactory.getStravaProfile($scope.currentUserProfile.stravaToken).then(response => {
            // check if user has bikes stored in their Strava Account
            if (response.data.bikes) {
                allBikesFromStrava = response.data.bikes
                console.log("allBikesFromStrava: ", allBikesFromStrava)

                // get the users currently tracked bikes
                BikeFactory.getUserBikes(user.uid).then(userBikes => {

                    // check if each bike in Strava has already been imported or not. If it hasn't, place it in an array of bikes that are available to import. Disregard it if it is already imported. 
                    allBikesFromStrava.forEach(stravaBike => {
                        
                        if (userBikes.every(match, stravaBike)) {
                            $scope.bikesToImport.push(stravaBike)
                        }

                        // function to use to in the .every() function above to check if there is a matched bike
                        function match(userBike) {
                            if (userBike.stravaBikeId !== this.id) {
                                return true
                            } else {
                                return false
                            }
                        }

                    })
                    console.log("$scope.bikesToImport", $scope.bikesToImport)
                })
            }
        })
    })


})