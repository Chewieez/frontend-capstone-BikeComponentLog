angular.module("BikeLogApp").factory("BikeFactory", function ($http) {
    // store firebase url for later user
    const firebaseURL = "https://bike-component-log.firebaseio.com/bikes"

    // create object with methods we'll use to manage user profiles in firebase
    return Object.create(null, {
        "bikesCache": {
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
        },"getUserBikes": {
            "value": function (UID) {
                return $http({
                    method: "GET",
                    url: `${firebaseURL}/.json?orderBy="userId"&equalTo="${UID}"`
                }).then(response => {
                    if (response.data) {
                        const bikes = response.data
                        this.bikesCache = Object.keys(bikes)
                            .map(key => {
                                bikes[key].fbId = key
                                return bikes[key]
                            })
                        console.log("bikes cached")
                        return this.bikesCache
                    }
                })
            }
        },
        "editBikeMileage": {
            "value": function(bike) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "PUT",
                        url: `${firebaseURL}/${bike.fbId}.json?auth=${idToken}`,
                        data: bike
                    })
                })
            }
        }
        
    })
    
})