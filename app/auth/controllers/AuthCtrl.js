angular.module("BikeLogApp")
    .controller("AuthCtrl", function ($scope, $location, $anchorScroll, $timeout, AuthFactory, $mdToast, ProfileFactory) {
        $scope.auth = {}

        $scope.hasStarted = false

        $scope.logoutUser = function () {
            AuthFactory.logout()
            $location.url("/auth")
        }

        $scope.logMeIn = function () {
            try {
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
            } catch (error) {
                console.log(error)
                $mdToast.show(
                    $mdToast.simple()
                        .parent($("#toast-container"))
                        .textContent("There is a problem with your email or password.")
                        .hideDelay(2000)
                )
            }
        }

        $scope.registerUser = function (registerNewUser) {
            try {
                AuthFactory.registerWithEmail(registerNewUser).then(function (didRegister) {
                    $scope.logMeIn(registerNewUser)
                })
            } catch (error) {
                console.log(error)
                $mdToast.show(
                    $mdToast.simple()
                        .parent($("#toast-container"))
                        .textContent("There is a problem with your email or password.")
                        .hideDelay(2000)
                )
            }
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