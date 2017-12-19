angular.module("BikeLogApp").factory("AuthFactory", function ($http, $timeout, $rootScope, $location, $route) {
    let currentUserData = null

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUserData = user
            console.log("User is authenticated")
            if ($location.url() !== "/dashboard") {
                $timeout(function () {
                    $location.url("/dashboard")
                }, 500)
            } else {
                $route.reload()
            }
            // $route.reload()

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
            value: () => firebase.auth().signOut()
        },
        authenticate: {
            value: credentials =>
                firebase.auth()
                    .signInWithEmailAndPassword(
                        credentials.email,
                        credentials.password
                    )
        },
        registerWithEmail: {
            value: user =>
                firebase.auth()
                    .createUserWithEmailAndPassword(
                        user.email,
                        user.password
                    )
        }
    })
})