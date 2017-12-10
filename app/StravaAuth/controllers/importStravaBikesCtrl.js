angular.module("BikeLogApp").controller("importStravaBikesCtrl", function ($scope, $location, $route, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {

    $scope.bikesToImport = []
    let allBikesFromStrava = []

    // get the current user
    const user = AuthFactory.getUser()

    $scope.currentUserProfile 

    // get current user Profile to get their Strava Id 
    ProfileFactory.getProfile(user.uid).then(profile=> {  
        $scope.currentUserProfile = profile

        StravaOAuthFactory.getStravaProfile($scope.currentUserProfile.stravaToken).then(response => {
            // check if user has bikes stored in their Strava Account
            if (response.data.bikes) {
                allBikesFromStrava = response.data.bikes
                console.log("allBikesFromStrava: ", allBikesFromStrava)

                // get the users currently tracked bikes
                BikeFactory.getUserBikes(user.uid).then (userBikes => {
                    
                    // filter out the bikes from strava that have not already been imported
                    // $scope.bikesToImport = allBikesFromStrava.filter(stravaBike => {
                      
                    //     let filteredBikes = userBikes.forEach(userBike => {
                    //         if (stravaBike.id !== userBike.stravaBikeId)
                    //         {}
                    //     })
                        
                    //     console.log("filteredBikes", filteredBikes)
                    //     return filteredBikes
    
                    // })

                    // allBikesFromStrava.forEach()

                    // function myFilter(stravaBike) {
                    //     return stravaBike.id !== userBikes.stravaBikeId 
                    // }


                    // allBikesFromStrava.every(myFilter
                })

                
            }

        })
    

    })



})