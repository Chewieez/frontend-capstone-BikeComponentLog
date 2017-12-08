angular.module("BikeLogApp")
    .controller("AuthCtrl", function ($scope, $location, AuthFactory, ProfileFactory) {
        $scope.auth = {}

        $scope.logoutUser = function () {
            AuthFactory.logout()
            $location.url("/auth")
        }

        $scope.logMeIn = function () {
            AuthFactory.authenticate($scope.auth).then(function (didLogin) {
                $scope.login = {}
                ProfileFactory.getProfile(AuthFactory.getUser().uid).then((response)=>{
                    if (response) {
                        $location.url("/")
                    } else {
                        $location.url("/profile")
                    }
                })
            })
        }

        $scope.registerUser = function (registerNewUser) {
            AuthFactory.registerWithEmail(registerNewUser).then(function (didRegister) {
                $scope.logMeIn(registerNewUser)
            })
        }
    })