angular.module("BikeLogApp").controller("addComponentCtrl", function ($scope, AuthFactory, ComponentFactory, BikeFactory) {
    // initalize the newComponent object to use in form
    $scope.newComponent = {}

    // store component types in an array to populate dropdown list
    $scope.componentTypes = ComponentFactory.componentTypes
   
    // sets the default date purchased to today's date. User can then change to which ever date they'd like. 
    $scope.newComponent.purchaseDate = new Date(new Date().toISOString().split("T")[0])

    // get the current bike id and attach it to the new component object
    $scope.currentBike = BikeFactory.currentBike
    
    // set the starting value of mileage to 0
    $scope.newComponent.mileage = 0

    // function to create a component object when the user clicks submit button on form, then store the new component in firebase
    $scope.addComponent = function () {
        // get current user data
        const user = AuthFactory.getUser()
        
        // create object
        let newComponent = {
            bikeFbId: $scope.currentBike.fbId,
            type: $scope.newComponent.type,
            brandName: $scope.newComponent.brand,
            modelName: $scope.newComponent.model,
            mileage: $scope.newComponent.mileage,
            purchaseDate: $scope.newComponent.purchaseDate,
            serial: $scope.newComponent.serial,
            info: $scope.newComponent.info,
            userId: user.uid,
            photo: 0
        }
        
        // Post this new component to firebase
        ComponentFactory.addComponent(newComponent)
        
        // Reset the form after successful upload
        //document.forms["componentForm"].reset();
        $scope.newComponent = {}
        // prepopulate the mileage box to 0
        $scope.newComponent.mileage = 0
        $scope.componentForm.$setPristine();
        
    }
})    