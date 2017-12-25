angular.module("BikeLogApp").controller("displayPhotoCtrl", function ($scope, image, $mdDialog, $timeout, AuthFactory, BikeFactory, ComponentFactory) { 

    $scope.image = image

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

})

