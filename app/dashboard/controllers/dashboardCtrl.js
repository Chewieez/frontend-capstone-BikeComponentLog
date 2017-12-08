angular.module("BikeLogApp").controller("dashboardCtrl", function ($scope, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {
    // get the current user
    const user = AuthFactory.getUser()
    let currentUserProfile 

    // get current user Profile to check for a link to Strava
    ProfileFactory.getProfile(user.uid).then(profile=> {  
        currentUserProfile = profile

        // if the user can linked Strava, go and get their bike data and update the mileage on firebase to reflect their miles on Strava
        if (currentUserProfile.stravaId) {
            BikeFactory.getUserBikes(user.uid).then(response => {
                let allBikes = response
                
                
                // check if the user has bikes linked to Strava
                let linkedBikes = []
                
                // filter out the bikes that have a stravaId property
                linkedBikes = allBikes.filter(bike=> bike.stravaBikeId !== 0)
                console.log("linkedBikes: ", linkedBikes)
                
                debugger

                if (linkedBikes) {
                    let stravaId = ProfileFactory.profileCache.stravaId
                    
                    // iterate of the linkedBikes array and get mileage for each bike
                    linkedBikes.forEach(bike => {
                        // get the stravaBikeId    
                        let stravaBikeId = bike.stravaBikeId
                        // get the strava Token
                        let stravaToken = currentUserProfile.stravaToken
                        // reach out to Strava for updated mileage
                        StravaOAuthFactory.getBikeData(stravaBikeId, stravaToken).then(bikeData => {
                            console.log(" strava bike details ", bikeData)
                            let updatedMiles = bikeData.data.distance * 0.00062137
                            bike.mileage = updatedMiles.toFixed()

                            BikeFactory.editBikeMileage(bike).then(r=>{
                                console.log("response from bike mileage update: ", r)
                            })

                        })
                    })
                }
            })


        }


    })

    // get the users components from firebase
    ComponentFactory.getUserComponents(user.uid).then((response)=>{
        $scope.components = response
        // console.log("$scope.components", $scope.components)
    })
    

})    