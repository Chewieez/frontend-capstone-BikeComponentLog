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
        "currentBike": {
            value: 0,
            writable: true,
            enumerable: true
        },
        "editBikeMode": {
            value: false,
            writable: true,
            enumerable: true,
        },
        "addBike": {
            "value": function(newBike) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "POST",
                        url: `${firebaseURL}.json?auth=${idToken}`,
                        data: newBike
                    }).then(response => {
                        // add fbId from response
                        newBike.fbId = response.data.name
                        // put the newBike back up to firebase, now with a fb id attached
                        return $http({
                            "method": "PUT",
                            "url": `${firebaseURL}/${newBike.fbId}/.json?auth=${idToken}`,
                            "data": newBike
                        })
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
                                // bikes[key].fbId = key
                                return bikes[key]
                            })
                        console.log("bikes cached: ",this.bikesCache)
                        return this.bikesCache
                    }
                })
            }
        },
        "editBike": {
            "value": function(bike) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "PUT",
                        url: `${firebaseURL}/${bike.fbId}.json?auth=${idToken}`,
                        data: bike
                    })
                })
            }
        },
        "deleteBike": {
            "value": function (bike) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "DELETE",
                        url: `${firebaseURL}/${bike.fbId}/.json?auth=${idToken}`,
                    })
                })
            }
        },
        "addImage": {
            value: function(file) {
                // add a time stamp to make each image file unique on Firebase
                const stamp = Date.now()
                return firebase.storage().ref("/images/BikeImages").child(file.name + stamp).put(file).then(result => {
                    // get the url of the image you uploaded
                    return firebase.storage().ref("/images/BikeImages").child(file.name + stamp).getDownloadURL()
                })
            }
        }, 
        "deleteImage": {    
            value: function(file) {
                return firebase.storage().ref("/images/BikeImages/").child(file).delete().then(function () {
                    console.log("File deleted")
                }).catch(function (error) {
                    console.log("Uh-oh, an error occurred deleting!")
                });
            }
        }, 
    })
    
})