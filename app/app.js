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
        // .when("/", {
        //     templateUrl: "app/employees/partials/list.html",
        //     controller: "EmployeeListCtrl",
        //     resolve: { isAuth }
        // })
        .when('/auth', {
            templateUrl: 'app/auth/partials/register.html',
            controller: 'AuthCtrl'
        })
        .otherwise('/auth')
})




