angular.module("BikeLogApp").controller("addBikeCtrl", function ($scope, AuthFactory, BikeFactory) {

    //sets the default date purchased to today's date. User can then change to which ever date they'd like. 
    $scope.newBikePurchaseDate = new Date(new Date().toISOString().split("T")[0])

    $scope.addBike = function () {
        const user = AuthFactory.getUser()

        let newBike = {
            brandName: $scope.newBikeBrand,
            modelName: $scope.newBikeModel,
            mileage: $scope.newBikeMileage,
            purchaseDate: $scope.newBikePurchaseDate,
            info: $scope.newBikeInfo,
            stravaBikeId: 0,
            userId: user.uid,
            photo: 0
        }

        BikeFactory.addBike(newBike)
    }
})    