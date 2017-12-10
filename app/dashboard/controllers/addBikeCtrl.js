angular.module("BikeLogApp").controller("addBikeCtrl", function ($scope, AuthFactory, BikeFactory) {

    // initialize the newBike object to use in form
    $scope.newBike = {}

    // set the starting value of mileage to 0
    $scope.newBike.mileage = 0

    //sets the default date purchased to today's date. User can then change to which ever date they'd like. 
    $scope.newBike.purchaseDate = new Date(new Date().toISOString().split("T")[0])

    $scope.addBike = function () {
        // get the current User data
        const user = AuthFactory.getUser()

        // create a new bike object
        let newBike = {
            brandName: $scope.newBike.brand,
            modelName: $scope.newBike.model,
            mileage: $scope.newBike.mileage,
            purchaseDate: $scope.newBike.purchaseDate,
            info: $scope.newBike.info,
            stravaBikeId: 0,
            userId: user.uid,
            photo: 0
        }

        // upload the new bike to Firebase
        BikeFactory.addBike(newBike)

        // Reset the form after successful upload
        $scope.newBike = {}
        // prepopulate the mileage box to 0
        $scope.newBike.mileage = 0
        $scope.bikeForm.$setPristine();
    }
})    