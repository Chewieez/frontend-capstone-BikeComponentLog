angular.module("BikeLogApp").controller("dashboardCtrl", function ($scope, $location, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {
    // get the current user
    const user = AuthFactory.getUser()
    let currentUserProfile 

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
        currentUserProfile = profile

        // if the user can linked Strava, go and get their bike data and update the mileage on firebase to reflect their miles on Strava
        BikeFactory.getUserBikes(user.uid).then(response => {
            let allBikes = response
            
            // get the users tracked components
            ComponentFactory.getUserComponents(user.uid).then(r=>{
                console.log("components loaded: ", r)

                // check if the user has a Strava Id attached
                if (currentUserProfile.stravaId) {
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
                            let stravaToken = currentUserProfile.stravaToken

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
                                
                                console.log("bike.mileage: ", bike.mileage)
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

    // ProfileFactory.getProfile(user.uid).then(profile=> {  
    //     currentUserProfile = profile
        
    //     BikeFactory.getUserBikes(user.uid).then(response => {
    //         let allBikes = response

    //         ComponentFactory.getUserComponents(user.uid).then(r=>{
    //             console.log("components loaded: ", r)
            
    //         })
    //     })
    // })


    // put this call inside a function that is called when the user selects a bike from the dropdown list    

    // get the users components from firebase
    ComponentFactory.getUserComponents(user.uid).then((response)=>{
        $scope.components = response
        // console.log("$scope.components", $scope.components)
    })
    
    // function to send the user to the Add Bike page
    $scope.sendToAddBike = function() {
        $location.url("/addBike")
    }


    /* NEED TO FIND A WAY TO PASS IN THE CURRENT BIKE TO KNOW WHAT BIKE TO ADD THE COMPONENT TO */

    // function to send the user to the addComponent Page
    $scope.sendToAddComponent = function(currentBike) {
        //BikeFactory.currentBikeId = currentBike.fbId
        $location.url("/addComponent")
    }

})    