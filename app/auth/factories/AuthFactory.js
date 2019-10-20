angular.module("BikeLogApp").factory("AuthFactory", function ($http, $timeout, $mdToast, $rootScope, $location, $route) {
    let currentUserData = null;
    let stravaUserDetail = {};

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUserData = user;

            if ($location.url() === "/strava-response") {
                $route.reload()
            }
            // else if ($location.url() !== "/dashboard") {
            //     $timeout(function () {
            //         $location.url("/dashboard")
            //     }, 500)
            // } 
            else {
                $route.reload()
            }

            $rootScope.$broadcast("authenticationSuccess")

        } else {
            currentUserData = null
            console.log("User is not authenticated")
            $timeout(function () {
                $location.url("/auth")
            }, 500)
        }
    })

    return Object.create(null, {
        isAuthenticated: {
            value: () => {
                const user = currentUserData
                return user ? true : false
            }
        },
        getUser: {
            value: () => currentUserData
            // value: () => firebase.auth().currentUser
        },
        logout: {
            value: () => firebase.auth().signOut().then(() => {
                $mdToast.show(
                    $mdToast.simple()
                        .parent($("#toast-container"))
                        .textContent("You've successfully logged out")
                        .hideDelay(2000)
                )
            })
        },
        authenticate: {
            value: credentials =>
                firebase.auth()
                    .signInWithEmailAndPassword(credentials.email, credentials.password)
                    .catch(function(error) {
                        console.log(error.code)
                        if (error.code === "auth/wrong-password") {
                            $mdToast.show(
                                $mdToast.simple()
                                    .parent($("#toast-container"))
                                    .textContent("There is a problem with your password")
                                    .hideDelay(2000)
                            )
                        } else if (error.code === "auth/user-not-found") {
                            $mdToast.show(
                                $mdToast.simple()
                                    .parent($("#toast-container"))
                                    .textContent("User not found, there maybe a problem with your email")
                                    .hideDelay(2000)
                            )
                        }
                    })
        },
        registerWithEmail: {
            value: user =>
                firebase.auth()
                    .createUserWithEmailAndPassword(user.email,user.password)
                    .catch(function(error) {
                        console.log(error)
                        $mdToast.show(
                            $mdToast.simple()
                                .parent($("#toast-container"))
                                .textContent("Error with sign in credentials.")
                                .hideDelay(2000)
                        )
                    })
        }
    })
})