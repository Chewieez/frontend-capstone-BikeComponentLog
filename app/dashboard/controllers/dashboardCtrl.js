angular.module("BikeLogApp").controller("dashboardCtrl", function ($scope, AuthFactory, BikeFactory, ComponentFactory) {
    
    
    // get the users components from firebase
    const user = AuthFactory.getUser()
    $scope.components
    ComponentFactory.getUserComponents(user.uid).then((response)=>{
        $scope.components = response
        console.log("$scope.components", $scope.components)
    })
    


})    