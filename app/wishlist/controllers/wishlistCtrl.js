angular.module("BikeLogApp").controller("wishlistCtrl", function ($scope, $location, $route, AuthFactory, BikeFactory, ComponentFactory, StravaOAuthFactory, ProfileFactory, WishlistFactory) {

    // initialize edit mode as falst 
    $scope.editMode = false
    $scope.createMode = false
    $scope.newWish = {}

    // get the current user
    const user = AuthFactory.getUser()
    
    WishlistFactory.getUserWishes(user.uid).then(wishes=> {
        $scope.wishes = wishes
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
                console.log("saved wish")
                WishlistFactory.getUserWishes(user.uid).then(wishes=>{
                    $scope.wishes = wishes
                    $scope.createMode = false
                    $scope.newWish = {}
                })
            })

        } else {

            WishlistFactory.editWish($scope.newWish).then(()=> {
                console.log("updated wish")
                WishlistFactory.getUserWishes(user.uid).then(wishes=>{
                    $scope.wishes = wishes
                    $scope.editMode = false
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
            console.log("deleted wish")
            WishlistFactory.getUserWishes(user.uid).then(wishes=>{
                $scope.wishes = wishes
            })
        })
    }

})