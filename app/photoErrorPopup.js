angular.module("BikeLogApp").service("photoErrorPopup", function($mdDialog){
    return {
        showErrorDialog: function(ev){
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector("#popupContainer")))
                    .clickOutsideToClose(true)
                    .title("Photo Upload Error")
                    .textContent("Photo File Size must not exceed 1.6mb.")
                    .ariaLabel("Photo Upload Error, Photo File Size must not exceed 1.6mb.")
                    .ok("OK")
                    .targetEvent(ev)
            );
        
        }
    }
});