angular.module("BikeLogApp").controller("dashboardCtrl", function ($scope, $location, $timeout, $route, $mdDialog, $mdToast, $anchorScroll, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory) {
    // turn gear spinner progress meter on while page is loading
    $scope.progressFlag = true

    // set flag to view only Active items to true by default
    $scope.activeFlag = {}
    $scope.activeFlag.show = true

    // get current date to use to show how long a component has been installed
    $scope.todaysDate = Date.now()
    

    // This function is called when the user selects a bike from the dropdown list, and it retrieves the selected bike's components from Firebase
    // This function needs to live above the if statement below that check if there is a currentBike in cache. 
    $scope.getComponents = function() {
        // set the current Bike id to use later when adding components
        BikeFactory.currentBike = $scope.currentBike
        
        // get the users components from firebase
        ComponentFactory.getUserComponents(user.uid).then(response => {
            
            if ($scope.currentBike.fbId) {
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
                
                // Scrolls the currentBikeDetails DOM element to the top
                $timeout(()=>{
                    // set timeout to give the DOM time to finish populating all of the componenets
                    document.getElementById("currentBikeSelector").scrollIntoView({behavior: "smooth", block: "start"})
                },500)
            }
            

            // Old code to scroll bike details to top of page when a bike is selected
            // $scope.scrollUpBikeDetails = function() {
                
            //     let id = $location.hash();
            //     $location.hash("currentBikeDetails");
            //     $anchorScroll()
            //     $location.hash(id);
            // };

        })
    }


    // get the current user
    const user = AuthFactory.getUser()
    $scope.currentUserProfile 

    /* This works to set default bike in view, but doens't populate the dropdown list with the correct information. This also requires the $scope.getComponents() function to be moved up before this code runs */
    if (BikeFactory.currentBike) {
        // start progress meter to hide the dom elements that show briefly when the user returns to the dashboard, with a currentBike in cache. 
        // $scope.progressFlag = true;

        // retrieve the current Bike saved on the factory and place it in scope
        $scope.currentBike = BikeFactory.currentBike
        
        // try and see if you can use cache for this. 
        $scope.getComponents()
        
        
    }

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

                // check if the user has a Strava Id attached
                if ($scope.currentUserProfile && $scope.currentUserProfile.stravaId) {
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

                                    thisBikesComponents.forEach(comp => {

                                        // only update components that are marked as "Active"
                                        if (comp.active) {
                                            // add the updated mileage amount to all the components
                                            comp.mileage += mileageDifference
                                            
                                            // store the updated component data in firebase 
                                            ComponentFactory.updateComponent(comp)
                                        }
                                    })

                                    
                                    BikeFactory.editBike(bike).then(r=>{
                                        
                                        // get the freshed data from the users Bikes
                                        BikeFactory.getUserBikes(user.uid).then(response => {
                                            // store the updated bikes from firebase
                                            let allUpdatedBikes = response
    
                                            // set the $scope.bikes array to all the updated bikes
                                            $scope.bikes = allUpdatedBikes
                                            
                                            // hide progress meter and show page content
                                            $scope.progressFlag = false

                                            
                                        })
                                        // show toast stating your mileage is up to date
                                        $mdToast.show(
                                            $mdToast.simple()
                                                .parent($("#toast-container"))
                                                .textContent("Bike mileage synced with Strava!")
                                                .hideDelay(2000)
                                        );
                                    })
                                }  else{
                                    // hide progress meter and show page content
                                    $scope.progressFlag = false
                                    
                                }     
                                /* end of if/else statement to check if new mileage is greater */
                            })
                        })
                    }   
                /* end of IF statement to check if connected to Strava  */
                } 

                // get the freshed data from the users Bikes
                BikeFactory.getUserBikes(user.uid).then(response => {
                    // store the updated bikes from firebase
                    let allUpdatedBikes = response

                    // set the $scope.bikes array to all the updated bikes
                    $scope.bikes = allUpdatedBikes

                    // turn off the spinning progress meter
                    $scope.progressFlag = false
                    
                })
            })
        })

    })


   
    
    // function to send the user to the Add Bike page
    $scope.sendToAddBike = function() {
        $location.url("/addBike")
    }

    // function to send the user to the addComponent Page
    $scope.sendToAddComponent = function() {
        $location.url("/addComponent")
    }

    // delete confirmation prompt code for deleting a component
    $scope.showConfirmComp = function(ev, comp) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title("Are you sure you want to delete this component?")
            .textContent("This is permanent and cannot be undone.")
            .ariaLabel("Confirm delete wish list item")
            .targetEvent(ev)
            .ok("Yes, Delete")
            .cancel("Cancel")
    
        $mdDialog.show(confirm).then(function() {
            $scope.deleteComponent(comp)

            // show toast stating your component has been deleted
            $mdToast.show(
                $mdToast.simple()
                    .parent($("#toast-container"))
                    .textContent(`The ${comp.brandName} ${comp.modelName} has been deleted.`)
                    .hideDelay(2000)
            )
        })
    }



    // function to delete a component
    $scope.deleteComponent = function(comp) {
        
        ComponentFactory.deleteComponent(comp).then(()=>{
            // erase the component from the array of components being displayed in DOM. 
            //$scope.getComponents()
        })
        $scope.components.splice($scope.components.indexOf(comp), 1);
    }

    // delete confirmation prompt code for deleting a bike
    $scope.showConfirmBike = function(ev, bike) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title("Are you sure you want to delete this bike?")
            .textContent("This will also permanently delete all the components associated with this bike.")
            .ariaLabel("Confirm delete wish list item")
            .targetEvent(ev)
            .ok("Yes, Delete")
            .cancel("Cancel");
    
        $mdDialog.show(confirm).then(function() {
            $scope.deleteBike(bike)

            // show toast stating your bike and it's components has been deleted
            $mdToast.show(
                $mdToast.simple()
                    .parent($("#toast-container"))
                    .textContent(`The ${bike.brandName} ${bike.modelName} has been deleted, along with it's components`)
                    .hideDelay(2000)
            )
        })
    }



    // function to delete a bike
    $scope.deleteBike = function(bike) {
        // empty the current bike from the bike factory
        BikeFactory.currentBike = {}

        BikeFactory.deleteBike(bike).then(()=>{
            // let userComponents

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

                $route.reload()
            })
        })

        // empty the current bike variable for cache purposes
        $scope.currentBike = null
        // empty the currentBike cached in the factory
        BikeFactory.currentBike = null
        ComponentFactory.componentsCache = null
        // reload the dashboard
        //$route.reload
        
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

    // Modal to add Mileage to a bike
    $scope.addMileageModal = function(ev) {
        $mdDialog.show({
            controller: "addMileageCtrl",
            templateUrl: "./app/dashboard/partials/addMileage.html",
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                // $route.reload()
            }, function() {
                // $scope.status = 'You cancelled the dialog.';
            });
    };
    
    
    // Photo lightbox modal
    $scope.displayPhoto = function(event) {
        $mdDialog.show({
            controller: "displayPhotoCtrl",
            templateUrl: "./app/dashboard/partials/displayPhoto.html",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            // pass in the img src data from the click event, to know which image to display in the lightbox
            locals: { image: event.target.currentSrc },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            
    };
    
    
    
    // Code for sorting Comonents
    $scope.sortOrderArray = [
        {
            "title": "Mileage",
            "propName": "mileage"
        },
        {
            "title": "Installation Date",
            "propName": "purchaseDate"
        },
        {
            "title": "Brand Name",
            "propName": "brandName"
        },
        {
            "title": "Model Name",
            "propName": "modelName"
        },
        {
            "title": "Component Type",
            "propName": "type"
        }       
    ]

    // object to hold the reverse order setting. Checkbox on partial controls the .setting value
    $scope.sortReverse = {}
    $scope.sortReverse.setting = false


    // $scope.orderByFunction = function(sortSelector){
    //     if (sortSelector.propName === "installationDate") {
    //         return parseInt(sortSelector.propName);

    //     }
    // };
    
    // function to set the sort order of components section
    $scope.setSortOrder = (sortSelector) => {
        // if user is ordering by mileage, reverse the sort order by default to highest miles first
        if (sortSelector.propName === "mileage") {
            // sort mileage by largest amount of miles by default
            $scope.sortReverse.setting = true
            $scope.sortOrder = sortSelector.propName

        } else {
            $scope.sortReverse.setting = false
            $scope.sortOrder = sortSelector.propName
        }

    }

    // changes the active state of a component when the user checks or unchecks the Active box
    $scope.changeCompActiveState = (comp) => {
        comp.installationDate = Date.now()

        ComponentFactory.updateComponent(comp).then(r=> {
            console.log("component updated")
            $scope.getComponents()
        })
    }

    

})    