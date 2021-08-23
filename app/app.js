const app = angular.module("BikeLogApp", ["ngRoute", "ngAnimate", "ngMaterial", "ngMessages", "vAccordion", "photoErrorPopupService"]);

require("./app.Config.js");
require("./auth/factories/AuthFactory.js");
require("./auth/controllers/AuthCtrl.js");
require("./navigation/controllers/navCtrl.js");
require("./profile/controllers/profileCtrl.js");
require("./profile/factories/ProfileFactory.js");
require("./dashboard/factories/BikeFactory.js");
require("./StravaAuth/factories/StravaOAuthFactory.js");
require("./dashboard/factories/ComponentFactory.js");
require("./wishlist/factories/WishlistFactory.js");
require("./StravaAuth/controllers/stravaResponseCtrl.js");
require("./dashboard/controllers/dashboardCtrl.js");
require("./dashboard/controllers/addBikeCtrl.js");
require("./dashboard/controllers/addComponentCtrl.js");
require("./StravaAuth/controllers/importStravaBikesCtrl.js");
require("./dashboard/controllers/addMileageCtrl.js");
require("./wishlist/controllers/wishlistCtrl.js");
require("./dashboard/controllers/displayPhotoCtrl.js");
require("./photoErrorPopupService.js");

angular.module("BikeLogApp").run(function (FIREBASE_CONFIG) {
    firebase.initializeApp(FIREBASE_CONFIG)
})

angular.module("BikeLogApp")
    .config(function($mdThemingProvider) {
        
        var newOrangeMap = $mdThemingProvider.extendPalette("deep-orange", {
            "contrastDefaultColor": "light",
            "contrastLightColors": [
                "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "A100", "A200", "A400", "A700"
            ],
            "contrastDarkColors": undefined
            
        });
            
        // Register the new color palette map with the name 
        $mdThemingProvider.definePalette("newOrange", newOrangeMap);
        
        $mdThemingProvider.theme("default")
            .primaryPalette("indigo")
            .accentPalette("newOrange")

                    
    });

const isAuth = AuthFactory => new Promise ((resolve, reject) => {
    if (AuthFactory.isAuthenticated()){
        console.log("User is authenticated, resolve route promise")
        resolve()
    } else {
        console.log("User is not authenticated, reject route promise")
        reject()
    }
})

// directive to upload a photo automatically when a user chooses a file, does not require two buttons to upload file
app.directive("customOnChange", function() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind("change", onChangeFunc);
        }
    };
});


angular.module("BikeLogApp").config(function ($routeProvider, $locationProvider) {
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

    $locationProvider.html5Mode(true).hashPrefix("!");
})
    
// require("./app.Config.js");
// require("./auth/factories/AuthFactory.js");
// require("./auth/controllers/AuthCtrl.js");
// require("./navigation/controllers/navCtrl.js");
// require("./profile/controllers/profileCtrl.js");
// require("./profile/factories/ProfileFactory.js");
// require("./dashboard/factories/BikeFactory.js");
// require("./StravaAuth/factories/StravaOAuthFactory.js");
// require("./dashboard/factories/ComponentFactory.js");
// require("./wishlist/factories/WishlistFactory.js");
// require("./StravaAuth/controllers/stravaResponseCtrl.js");
// require("./dashboard/controllers/dashboardCtrl.js");
// require("./dashboard/controllers/addBikeCtrl.js");
// require("./dashboard/controllers/addComponentCtrl.js");
// require("./StravaAuth/controllers/importStravaBikesCtrl.js");
// require("./dashboard/controllers/addMileageCtrl.js");
// require("./wishlist/controllers/wishlistCtrl.js");
// require("./dashboard/controllers/displayPhotoCtrl.js");
// require("./photoErrorPopupService.js");
