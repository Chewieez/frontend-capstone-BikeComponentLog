angular.module("BikeLogApp").controller("dashboardCtrl", function ($scope, $location, $route, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {
    // get the current user
    const user = AuthFactory.getUser()
    $scope.currentUserProfile 

    // set the $scope.currentBike to the currently selected bike in the Dashboard dropdown list
    $scope.currentBike  

    // variable to hold the currently selected bike (to use to pass into the Add Component function to tie the component to the bike)
    let currentBike = $scope.currentBike

    // set $scope.bikes to an array to hold bikes
    $scope.bikes = []
    // set a variable to hold an array of updated bikes with updated Strava details
    let updatedStravaBikes = []

    // get current user Profile to check for a link to Strava. Update the mileage of any bikes the user has stored in Strava and Bike Log
    ProfileFactory.getProfile(user.uid).then(profile=> {  
        $scope.currentUserProfile = profile

        // if the user can linked Strava, go and get their bike data and update the mileage on firebase to reflect their miles on Strava
        BikeFactory.getUserBikes(user.uid).then(response => {
            let allBikes = response
            
            // get the users tracked components
            ComponentFactory.getUserComponents(user.uid).then(r=>{
                console.log("components loaded: ", r)

                // check if the user has a Strava Id attached
                if ($scope.currentUserProfile.stravaId) {
                    // check if the user has bikes linked to Strava
                    let linkedBikes = []
                    
                    // filter out the bikes that have a stravaId property
                    linkedBikes = allBikes.filter(bike=> bike.stravaBikeId !== 0)
                    console.log("linkedBikes: ", linkedBikes)
                    
    
                    if (linkedBikes) {
                        let stravaId = ProfileFactory.profileCache.stravaId
                        
                        // iterate of the linkedBikes array and get mileage for each bike
                        linkedBikes.forEach(bike => {
                            // get the stravaBikeId & get the strava Token
                            let stravaBikeId = bike.stravaBikeId
                            let stravaToken = $scope.currentUserProfile.stravaToken

                            // reach out to Strava for updated mileage
                            StravaOAuthFactory.getBikeData(stravaBikeId, stravaToken).then(bikeData => {
                                console.log(" strava bike details ", bikeData)

                                // convert meters from strava to miles
                                const newMileage = Math.round(bikeData.data.distance * 0.00062137)
                                // check if mileage is greater than current saved miles. 
                                if (bike.mileage < newMileage ) {

                                    // get the difference in mileage and add it to all of the tracked components
                                    let mileageDifference = newMileage - bike.mileage

                                    // assign the new mileage amount to the bike object
                                    bike.mileage = newMileage
    
                                    let thisBikesComponents = ComponentFactory.componentsCache.filter(comp => {
                                        return comp.bikeFbId === bike.fbId
                                    })

                                    thisBikesComponents.forEach(comp =>{
                                        // add the updated mileage amount to all the components
                                        comp.mileage += mileageDifference
                                        
                                        // store the updated component data in firebase 
                                        ComponentFactory.updateComponent(comp)
                                    })

                                    // I'm not sure if I need to use a separate loop for this.
                                    // thisBikesComponents.forEach(comp => {
                                    //     ComponentFactory.updateComponent(comp)
                                    // })
                                }       /* end of IF statement to check if new mileage is greater */
                                
                                BikeFactory.editBikeMileage(bike).then(r=>{
                                    console.log("response from bike mileage update: ", r)

                                    // get the freshed data from the users Bikes
                                    BikeFactory.getUserBikes(user.uid).then(response => {
                                        // store the updated bikes from firebase
                                        let allUpdatedBikes = response

                                        // set the $scope.bikes array to all the updated bikes
                                        $scope.bikes = allUpdatedBikes

                                    })
                                })
    
                            })
                        })
                    }   
                /* end of IF statement to check if connected to Strava  */
                } 

                // get the freshed data from the users Bikes and get linked components again
                BikeFactory.getUserBikes(user.uid).then(response => {
                    // store the updated bikes from firebase
                    let allUpdatedBikes = response

                    // set the $scope.bikes array to all the updated bikes
                    $scope.bikes = allUpdatedBikes

                })
            })
        })

    })


    // put this call inside a function that is called when the user selects a bike from the dropdown list    
    $scope.getComponents = function() {
        // set the current Bike id to use later when adding components
        BikeFactory.currentBike = $scope.currentBike

        // get the users components from firebase
        ComponentFactory.getUserComponents(user.uid).then(response => {
            
            // filter through components and get the ones attached to the current Bike
            let thisBikesComponents = response.filter(comp => {
                return comp.bikeFbId === $scope.currentBike.fbId
            })
            // setup $scope.components to hold an array of components
            $scope.components = []

            // loop over the matching components and push them to the $scope.components array
            thisBikesComponents.forEach(comp =>{
                $scope.components.push(comp)
            })
        })
    }
    
    // function to send the user to the Add Bike page
    $scope.sendToAddBike = function() {
        $location.url("/addBike")
    }

    // function to send the user to the addComponent Page
    $scope.sendToAddComponent = function() {
        $location.url("/addComponent")
    }

    // function to delete a component
    $scope.deleteComponent = function(fbId) {
        
        ComponentFactory.deleteComponent(fbId).then(()=>{
            $scope.getComponents()
        })
    }

    // function to delete a bike
    $scope.deleteBike = function(fbId) {
        
        BikeFactory.deleteBike(fbId).then(()=>{
            $scope.currentBike = {}
            $route.reload()
        })
    }

    // function to refresh the page and run Strava sync 
    $scope.refresh = function() {
        $route.reload()
    }

})    