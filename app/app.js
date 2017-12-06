const app = angular.module("BikeLogApp", ["ngRoute"]);

angular.module("BikeLogApp").run(function (FIREBASE_CONFIG) {
    firebase.initializeApp(FIREBASE_CONFIG)
})

const isAuth = AuthFactory => new Promise ((resolve, reject) => {
    if (AuthFactory.isAuthenticated()){
        console.log("User is authenticated, resolve route promise")
        resolve()
    } else {
        console.log("User is not authenticated, reject route promise")
        reject()
    }
})


angular.module("BikeLogApp").config(function ($routeProvider) {
    /**
     * Configure all Angular application routes here
     */
    $routeProvider
        .when("/profile", {
            templateUrl: "app/profile/partials/profile.html",
            controller: "profileCtrl",
            //resolve: { isAuth }
        })
        .when("/update-profile", {
            templateUrl: "app/profile/partials/updateProfile.html",
            controller: "updateProfileCtrl",
            //resolve: { isAuth }
        })
        .when("/auth", {
            templateUrl: "app/auth/partials/register.html",
            controller: "AuthCtrl"
        })
        .otherwise("/auth")
})




