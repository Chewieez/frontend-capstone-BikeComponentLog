const app = angular.module("BikeLogApp", ["ngRoute", "ngAnimate", "ngMaterial", "ngMessages", "vAccordion"]);

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

app.directive("customOnChange", function() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind("change", onChangeFunc);
        }
    };
});



angular.module("BikeLogApp").config(function ($routeProvider) {
    /**
     * Configure all Angular application routes here
     */
    $routeProvider
        .when("/auth", {
            templateUrl: "app/auth/partials/register.html",
            controller: "AuthCtrl"
        })
        .when("/profile", {
            templateUrl: "app/profile/partials/profile.html",
            controller: "profileCtrl",
            resolve: { isAuth }
        })
        .when("/", {
            templateUrl: "app/dashboard/partials/dashboard.html",
            controller: "dashboardCtrl",
            resolve: { isAuth }
        })
        .when("/dashboard", {
            templateUrl: "app/dashboard/partials/dashboard.html",
            controller: "dashboardCtrl",
            resolve: { isAuth }
        })
        .when("/addBike", {
            templateUrl: "app/dashboard/partials/addBike.html",
            controller: "addBikeCtrl",
            resolve: { isAuth }
        })
        .when("/addComponent", {
            templateUrl: "app/dashboard/partials/addComponent.html",
            controller: "addComponentCtrl",
            resolve: { isAuth }
        })
        .when("/addMileage", {
            templateUrl: "app/dashboard/partials/addMileage.html",
            controller: "addMileageCtrl",
            resolve: { isAuth }
        })
        .when("/wishlist", {
            templateUrl: "app/wishlist/partials/wishlist.html",
            controller: "wishlistCtrl",
            resolve: { isAuth }
        })
        .when("/strava-link", {
            templateUrl: "app/StravaAuth/partials/stravaLink.html",
            controller: "stravaLinkCtrl",
            resolve: { isAuth }
        })
        .when("/strava-response", {
            templateUrl: "app/StravaAuth/partials/stravaResponse.html",
            controller: "stravaResponseCtrl",
            resolve: { isAuth }
        })
        .when("/importStravaBikes", {
            templateUrl: "app/StravaAuth/partials/importStravaBikes.html",
            controller: "importStravaBikesCtrl",
            resolve: { isAuth }
        })
        .otherwise("/strava-response")
})




