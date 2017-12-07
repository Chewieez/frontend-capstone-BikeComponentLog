angular.module("BikeLogApp").factory("bikeFactory", function ($scope, AuthFactory) {
    // store firebase url for later user
    const firebaseURL = "https://bike-component-log.firebaseio.com/bikes"

    // create object with methods we'll use to manage user profiles in firebase
    return Object.create(null, {
        "uploadBike"
    }
    
})