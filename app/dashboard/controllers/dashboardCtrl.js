angular.module("BikeLogApp").controller("dashboardCtrl", function ($scope, AuthFactory) {

    $scope.addBike = function() {
        const user = AuthFactory.getUser()
        
        let newBike = {
            brandName: $scope.newBikeBrand,
            modelName: $scope.newBikeModel,
            info: $scope.newBikeInfo,
            stravaId: 0
        } 
    }
})    