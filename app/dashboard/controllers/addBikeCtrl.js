angular.module("BikeLogApp").controller("addBikeCtrl", function ($scope, $location, AuthFactory, BikeFactory) {


    // check if we are in Edit Bike Mode
    if (!BikeFactory.editBikeMode) {
        // set local Edit mode variable to true to show the user a Save Edits button and not a Add Bike Button
        $scope.editMode = false

        // initialize the newBike object to use in form
        $scope.newBike = {}
    
        // set the starting value of mileage to 0
        $scope.newBike.mileage = 0
    
        //sets the default date purchased to today's date. User can then change to which ever date they'd like. 
        $scope.newBike.purchaseDate = new Date(new Date().toISOString().split("T")[0])

    } else {
        // set local Edit mode variable to true to show the user a Save Edits button and not a Add Bike Button
        $scope.editMode = true
        // set the $scope new Bike variable to the current bike chosen to edit
        $scope.newBike = BikeFactory.currentBike 
        // if the bike currently has a date, populate the date window with that date info
        if (BikeFactory.currentBike.purchaseDate) {
            $scope.newBike.purchaseDate = new Date(BikeFactory.currentBike.purchaseDate.split("T")[0])
        }
    }


    $scope.addBike = function () {
        // get the current User data
        const user = AuthFactory.getUser()

        // create a new bike object
        // let newBike = {
        //     brandName: $scope.newBike.brandName,
        //     modelName: $scope.newBike.modelName,
        //     mileage: $scope.newBike.mileage,
        //     purchaseDate: $scope.newBike.purchaseDate,
        //     info: $scope.newBike.info,
        //     stravaBikeId: $scope.stravaBikeId || 0,
        //     userId: user.uid,
        //     serial: $scope.newBike.serial,
        //     photo: 0
        // }

        // check if there is already a userId attached to the bike, if so, use the current one. If not, add it
        if (!$scope.newBike.userId) {
            // add the userId to the new Bike object
            $scope.newBike.userId = user.uid
        }

        // check if there is already a stravaId on newBike object. Use it if there is, if there isn't create one and initialize with 0 so it will be stored in firebase.
        if (!$scope.newBike.stravaBikeId) {
            $scope.newBike.stravaBikeId = 0
        }


        // check if edit mode is on to know whether to create a new bike or edit an existing one
        if (!$scope.editMode) {
            // upload the new bike to Firebase
            BikeFactory.addBike($scope.newBike)
            // make sure edit mode on BikeFactory is and stays false, until a user clicks the Edit button
            BikeFactory.editMode = false
        } else {
            BikeFactory.editBike($scope.newBike)
            BikeFactory.editMode = false
            $scope.editMode = false
        }

        // Reset the form after successful upload
        $scope.newBike = {}
        // prepopulate the mileage box to 0
        $scope.newBike.mileage = 0
        $scope.bikeForm.$setPristine();
    }

    // // function to send user to the 
    // $scope.editBike = function(bikeToEdit) {
    //     $location.url("/addBike")
    //     $scope.newBike = bikeToEdit
    // }
})    