angular.module("BikeLogApp").controller("addMileageCtrl", function ($scope, $location, $mdDialog, AuthFactory, BikeFactory, ComponentFactory) {

    $scope.currentBike = BikeFactory.currentBike

    $scope.hide = function() {
        $mdDialog.hide();
    };
  
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
  
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };



    $scope.saveMileage = () => {
        $scope.currentBike.mileage += $scope.additionalMileage

        // get all the components and find the ones attached to the current bike
        let thisBikesComponents = ComponentFactory.componentsCache.filter(comp => {
            return comp.bikeFbId === $scope.currentBike.fbId
        })

        // loop through components and add the miles to each component
        thisBikesComponents.forEach(comp => {

            // only update components that are marked as "Active"
            if (comp.active) {

                comp.mileage += $scope.additionalMileage

                // store the updated component data in firebase 
                ComponentFactory.updateComponent(comp)
            }

        })

        BikeFactory.editBike($scope.currentBike)
        // .then(() => {
        // // set the bike with the updated mileage on the BikeFactory so when user returns to dashboard, the mileage is reflected
        //     BikeFactory.currentBike = $scope.currentBike

        //     // loop through components and add the miles to each component
        //     thisBikesComponents.forEach(comp => {

        //     // only update components that are marked as "Active"
        //         if (comp.active) {

        //             comp.mileage += $scope.additionalMileage

        //             // store the updated component data in firebase 
        //             ComponentFactory.updateComponent(comp)
        //         }

        //     })
        //})  
            
        $scope.hide()

    }
})