angular.module("BikeLogApp")
    .controller("AuthCtrl", function ($scope, $location, $anchorScroll, $timeout, AuthFactory, ProfileFactory) {
        $scope.auth = {}

        $scope.hasStarted = false

        $scope.logoutUser = function () {
            AuthFactory.logout()
            $location.url("/auth")
        }

        $scope.logMeIn = function () {
            AuthFactory.authenticate($scope.auth).then(function (didLogin) {
                $scope.login = {}
                
                ProfileFactory.getProfile(firebase.auth().currentUser.uid).then((response)=>{
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

        $scope.startLogin = () => {
            $scope.hasStarted = true;
            
            // $scope.$apply(()=>{
            //     $anchorScroll.yOffset = 200;
            //     $location.hash("loginUser");
                
            //     // call $anchorScroll()
            //     $anchorScroll();
            //     $scope.hasStarted = true;
                

            // })

        }

        $scope.cancel = () => {
            $scope.hasStarted = false;
        }
    })