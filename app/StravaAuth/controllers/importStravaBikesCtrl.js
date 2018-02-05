angular.module("BikeLogApp").controller("importStravaBikesCtrl", function ($scope, $location, $route, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {
    
    // code will run on page load only
    $scope.init = () => {

        // turn gear spinner progress meter on while page is loading
        $scope.progressFlag = true

        // array to hold bikes imported from user's strava account
        $scope.bikesToImport = []

        // flag to hold a boolean of whether the user has bikes from Strava to import
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
                        // if the user has some bikes from their strava account to import, make flag True, else False.
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
            
            // create a new bike in database using the info imported from the users Strava account, including mileage, name and Strava Id
            const importedBike = {
                brandName: bike.name,
                mileage: Math.round(bike.distance * 0.00062137),
                stravaBikeId: bike.id,
                userId: user.uid,
            }
            
            // add bike to users Database
            BikeFactory.addBike(importedBike)
            
            // place this imported bike into the cache so it is immediately displayed when the user goes to the dashboard
            BikeFactory.currentBike = importedBike

            // if the user has no more bikes to import, send them to the Dashboard, if they have another bike, leave them on the import page and let them choose to leave by clicking Finished button.
            if ($scope.bikesToImport.length === 1) {
                $location.url("/dashboard")
            } else {
                // get the index of the bike chosen
                let bikeIndex = $scope.bikesToImport.indexOf(bike)
                
                // remove the imported bike from the list of bike available to import
                $scope.bikesToImport.splice(bikeIndex,1)
            }
        }
        
        // function to send user to dashboard when they click the finished button
        $scope.toDashboard = function() {
            $location.url("/dashboard")
        }
    }
})