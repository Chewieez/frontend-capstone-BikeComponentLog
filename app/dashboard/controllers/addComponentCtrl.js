angular.module("BikeLogApp").controller("addComponentCtrl", function ($scope, AuthFactory, ComponentFactory, BikeFactory) {
    
    // store component types in an array to populate dropdown list
    $scope.componentTypes = ComponentFactory.componentTypes
   
    // sets the default date purchased to today's date. User can then change to which ever date they'd like. 
    $scope.newComponentPurchaseDate = new Date(new Date().toISOString().split("T")[0])

    // get the current bike id and attach it to the new component object

    
    $scope.addComponent = function () {
        const user = AuthFactory.getUser()
        
        let newComponent = {
            bikeFbId: BikeFactory.currentBikeId,
            type: $scope.newComponentType,
            brandName: $scope.newComponentBrand,
            modelName: $scope.newComponentModel,
            mileage: $scope.newComponentMileage,
            purchaseDate: $scope.newComponentPurchaseDate,
            info: $scope.newComponentInfo,
            userId: user.uid,
            photo: 0
        }
        
        
        
        
        // Post this new component to firebase
        ComponentFactory.addComponent(newComponent)
    }
})    