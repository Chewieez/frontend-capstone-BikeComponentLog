angular.module("BikeLogApp").controller("dashboardCtrl", function ($scope, AuthFactory, BikeFactory) {

    $scope.addBike = function() {
        const user = AuthFactory.getUser()
        
        let newBike = {
            brandName: $scope.newBikeBrand,
            modelName: $scope.newBikeModel,
            info: $scope.newBikeInfo,
            stravaId: 0,
            userId: user.uid
        } 

        BikeFactory.addBike(newBike)        
    }
})    