angular.module("BikeLogApp").factory("BikeFactory", function ($http) {
    // store firebase url for later user
    const firebaseURL = "https://bike-component-log.firebaseio.com/bikes"

    // create object with methods we'll use to manage user profiles in firebase
    return Object.create(null, {
        "bikeCache": {
            value: 0,
            writable: true,
            enumerable: true
        },
        "addBike": {
            "value": function(newBike) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "POST",
                        url: `${firebaseURL}.json?auth=${idToken}`,
                        data: newBike
                    }).then(r =>{
                        console.log("bike uploaded")
                    })
                })
            }
        }
        
    })
    
})