angular.module("BikeLogApp").controller("addComponentCtrl", function ($scope, AuthFactory, ComponentFactory, BikeFactory) {

    // check if we are in Edit Component Mode
    if (!ComponentFactory.editCompMode) {

        // set local Edit mode variable to true to show user the correct button for submitting component, save new or save edits
        $scope.editMode = false

        // initalize the newComponent object to use in form
        $scope.newComponent = {}
    
        // store component types in an array to populate dropdown list
        $scope.componentTypes = ComponentFactory.componentTypes
       
        // sets the default date purchased to today's date. User can then change to which ever date they'd like. 
        if (!$scope.newComponent.purchaseDate) {
            $scope.newComponent.purchaseDate = new Date(new Date().toISOString().split("T")[0])
        }
    
        // get the current bike id and attach it to the new component object
        $scope.currentBike = BikeFactory.currentBike
        
        // set the starting value of mileage to 0
        $scope.newComponent.mileage = 0

    } else {
        // set local Edit mode variable to true to show user the correct button for submitting component, save new or save edits
        $scope.editMode = true

        // set the $scope new Bike variable to the current bike chosen to edit
        $scope.newComponent = ComponentFactory.currentComponent 
        // populate the date window with the components original saved date
        $scope.newComponent.purchaseDate = new Date(ComponentFactory.currentComponent.purchaseDate.split("T")[0])
    }

    // function to create a component object when the user clicks submit button on form, then store the new component in firebase
    $scope.addComponent = function () {
        // get current user data
        const user = AuthFactory.getUser()
        
        // create object
        // let newComponent = {
        //     bikeFbId: $scope.currentBike.fbId,
        //     type: $scope.newComponent.type,
        //     brandName: $scope.newComponent.brandName,
        //     modelName: $scope.newComponent.modelName,
        //     mileage: $scope.newComponent.mileage,
        //     purchaseDate: $scope.newComponent.purchaseDate,
        //     serial: $scope.newComponent.serial,
        //     info: $scope.newComponent.info,
        //     userId: user.uid,
        //     photo: 0
        // }
        
        if (!$scope.newComponent.bikeFbId) {
            // attach the current Bikes firebase Id to the component
            $scope.newComponent.bikeFbId = BikeFactory.currentBike.fbId
        }

        
        // check if there is already a userId attached to the bike, if so, use the current one. If not, add it
        if (!$scope.newComponent.userId) {
            // add the userId to the new Component object
            $scope.newComponent.userId = user.uid
        }


        // check if edit mode is on to know whether to create a new bike or edit an existing one
        if (!$scope.editMode) {
            // Post this new component to firebase
            ComponentFactory.addComponent($scope.newComponent)
        } else {
            ComponentFactory.updateComponent($scope.newComponent)
        }
        
        // Reset the form after successful upload
        $scope.newComponent = {}
        // prepopulate the mileage box to 0
        $scope.newComponent.mileage = 0
        $scope.componentForm.$setPristine();
    }

})    