angular.module("BikeLogApp").controller("importStravaBikesCtrl", function ($scope, $location, $route, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {
    
    // code will run on page load only
    $scope.init = () => {

        // turn gear spinner progress meter on while page is loading
        $scope.progressFlag = true

        $scope.bikesToImport = []
        $scope.stravaReturnFlag = false
        
        let allBikesFromStrava = []
    
        // get the current user
        const user = AuthFactory.getUser()
    
        // get current user Profile to get their Strava Id 
        ProfileFactory.getProfile(user.uid).then(profile => {
            $scope.currentUserProfile = profile
    
            StravaOAuthFactory.getStravaProfile($scope.currentUserProfile.stravaToken).then(response => {
                // check if user has bikes stored in their Strava Account
                if (response.data.bikes) {
                    allBikesFromStrava = response.data.bikes
    
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
                    }).then(()=>{
                        if ($scope.bikesToImport.length === 0) {
                            $scope.stravaReturnFlag = true
                        } else {
                            $scope.stravaReturnFlag = false
                        }
                        // turn gear spinner progress meter off now that content is aquired
                        $scope.progressFlag = false
                    })
                }
               
            })
        })
    
    
        // function to import a bike into user's database
        $scope.importBike = function(bike) {
    
            const importedBike = {
                brandName: bike.name,
                mileage: Math.round(bike.distance * 0.00062137),
                stravaBikeId: bike.id,
                userId: user.uid,
            }
    
            BikeFactory.addBike(importedBike)
            

            if ($scope.bikesToImport.length === 1) {
                BikeFactory.currentBike = importedBike
                $location.url("/dashboard")
            } 
        }
    
        $scope.toDashboard = function() {
            $location.url("/dashboard")
        }
        
    }

})