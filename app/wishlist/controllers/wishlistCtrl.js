angular.module("BikeLogApp").controller("wishlistCtrl", function ($scope, $location, $mdDialog, $route, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory, WishlistFactory, $mdToast) {

    // turn gear spinner progress meter on while page is loading
    $scope.progressFlag = true

    // initialize edit mode as false 
    $scope.editMode = false
    $scope.createMode = false
    $scope.newWish = {}


    // delete confirmation prompt code 
    $scope.showConfirm = function(ev, wish) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title("Want to permanently delete this wishlist item?")
            .textContent("This cannot be undone.")
            .ariaLabel("Confirm delete wish list item")
            .targetEvent(ev)
            .ok("Yes, Delete")
            .cancel("Cancel");
    
        $mdDialog.show(confirm).then(function() {
            $scope.deleteWish(wish)
        })
    }



    // get the current user
    const user = AuthFactory.getUser()
    
    WishlistFactory.getUserWishes(user.uid).then(wishes=> {
        $scope.wishes = wishes
        // turn off gear spinner and hide div
        $scope.progressFlag = false
    })


    $scope.createWish = function() {
        $scope.createMode = true
        
    }

    $scope.saveWish = function() {

        if (!$scope.editMode) {
            // attach the users uid
            $scope.newWish.userId = user.uid
            // add the date when created
            $scope.newWish.dateAdded = Date.now()
            
            // save wish to firebase
            WishlistFactory.saveWish($scope.newWish).then(()=> {
                $mdToast.show(
                    $mdToast.simple()
                        .parent($("#toast-container"))
                        .textContent("Wish saved!")
                        .hideDelay(3000)
                );
                WishlistFactory.getUserWishes(user.uid).then(wishes=>{
                    $scope.wishes = wishes
                    $scope.createMode = false
                    $scope.newWish = {}
                })
            })
            
        } else {
            
            WishlistFactory.editWish($scope.newWish).then(()=> {
                $mdToast.show(
                    $mdToast.simple()
                        .parent($("#toast-container"))
                        .textContent("Wish edited!")
                        .hideDelay(3000)
                );
                WishlistFactory.getUserWishes(user.uid).then(wishes=>{
                    $scope.wishes = wishes
                    $scope.editMode = false
                    $scope.newWish = {}
                })
            })
        }
    }

    $scope.editWish = function (wish) {
        $scope.editMode = true
        $scope.newWish = wish
    }

    $scope.deleteWish = function(wish) {
        WishlistFactory.deleteWish(wish).then(()=> {
            $mdToast.show(
                $mdToast.simple()
                    .parent($("#toast-container"))
                    .textContent("Wish deleted")
                    .hideDelay(3000)
            );
            WishlistFactory.getUserWishes(user.uid).then(wishes=>{
                $scope.wishes = wishes
            })
        })
    }

    $scope.cancelWish = function() {
        $scope.editMode = false
        $scope.createMode = false
        $scope.newWish = {}
    }


    // Code for sorting Wishes
    $scope.sortOrderArray = [
        {"title": "Title", "propName": "title"}, 
        {"title": "Date Added", "propName": "dateAdded"}
    ]

    // object to hold the reverse order setting. Checkbox on partial controls the .setting value
    $scope.sortReverse = {}
    $scope.sortReverse.setting = false

    
    // function to set the sort order of wishes section
    $scope.setSortOrder = (sortSelector) => {

        $scope.sortOrder = sortSelector.propName

    }


})