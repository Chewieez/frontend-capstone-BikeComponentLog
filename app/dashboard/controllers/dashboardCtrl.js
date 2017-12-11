angular.module("BikeLogApp").controller("dashboardCtrl", function ($scope, $location, $route, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {
    // get the current user
    const user = AuthFactory.getUser()
    $scope.currentUserProfile 

    // set the default value of edit mode to be false
    BikeFactory.editBikeMode = false;
    ComponentFactory.editCompMode = false;

    // set $scope.bikes to an array to hold bikes
    $scope.bikes = []

    // set a variable to hold an array of updated bikes with updated Strava details
    let updatedStravaBikes = []

    // get current user Profile to check for a link to Strava. Update the mileage of any bikes the user has stored in Strava and Bike Log
    ProfileFactory.getProfile(user.uid).then(profile=> {  
        $scope.currentUserProfile = profile

        // if the user has linked Strava, go and get their bike data and update the mileage on firebase to reflect their miles on Strava
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
                    
    
                    if (linkedBikes) {
                        let stravaId = ProfileFactory.profileCache.stravaId
                        
                        // iterate of the linkedBikes array and get mileage for each bike
                        linkedBikes.forEach(bike => {
                            // get the stravaBikeId & get the strava Token
                            let stravaBikeId = bike.stravaBikeId
                            let stravaToken = $scope.currentUserProfile.stravaToken

                            // reach out to Strava for updated mileage
                            StravaOAuthFactory.getBikeData(stravaBikeId, stravaToken).then(bikeData => {
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
                                
                                BikeFactory.editBike(bike).then(r=>{
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
    $scope.deleteBike = function(bike) {
        
        BikeFactory.deleteBike(bike).then(()=>{
            let userComponents

            // get user components
            ComponentFactory.getUserComponents(user.uid).then(components => {
                // filter out components that are attached to the bike the user is deleting
                let deletedBikeComp = components.filter(comp=>{
                    return comp.bikeFbId === bike.fbId
                })
                // loop through array of matching components and delete each one
                deletedBikeComp.forEach(comp => {
                    ComponentFactory.deleteComponent(comp)
                })
            })

            // empty the current bike variable
            $scope.currentBike = {}
            // reload the dashboard
            $route.reload()
        })
    }

    // function to refresh the page and run Strava sync 
    $scope.refresh = function() {
        $route.reload()
    }

    // function to send user to the Import Strava Bike page
    $scope.importBikes = function() {
        $location.url("importStravaBikes")
    }

    // function to start editing a bike, and send user to the AddBike controller
    $scope.sendToEditBike = function(bike) {
        // storing the current Bike in the Bike factory
        BikeFactory.currentBike = bike
        // set edit mode to true in the Bike Factory
        BikeFactory.editBikeMode = true
        // redirect user to the Add Bike form to enter edits
        $location.url("/addBike")
    }

    // function to start editing a component, and send user to the AddComponent controller
    $scope.sendToEditComponent = function(component) {
        // storing the current Bike in the Bike factory
        BikeFactory.currentBike = $scope.currentBike
        // storing the current component in the Component factory
        ComponentFactory.currentComponent = component
        // set edit mode to true in the Component Factory
        ComponentFactory.editCompMode = true
        // redirect user to the add component form to enter edits
        $location.url("/addComponent")
    }
})    