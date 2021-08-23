angular.module("BikeLogApp").factory("WishlistFactory", function ($http) {

    // store firebase url for later user
    const firebaseURL = "https://bike-component-log.firebaseio.com/wishes"
 
    // create object with methods we'll use to manage user profiles in firebase
    return Object.create(null, {
        "wishCache": {
            value: 0,
            writable: true,
            enumerable: true
        },
        "saveWish": {
            "value": function(newWish) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "POST",
                        url: `${firebaseURL}.json?auth=${idToken}`,
                        data: newWish
                    }).then(response => {
                        // add fbId from response
                        newWish.fbId = response.data.name
                        // put the newBike back up to firebase, now with a fb id attached
                        return $http({
                            "method": "PUT",
                            "url": `${firebaseURL}/${newWish.fbId}/.json?auth=${idToken}`,
                            "data": newWish
                        })
                    })
                })
            }
        },
        "getUserWishes": {
            "value": function (UID) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "GET",
                        url: `${firebaseURL}/.json?orderBy="userId"&equalTo="${UID}"&auth=${idToken}`
                    }).then(response => {
                        if (response.data) {
                            const wishes = response.data
                            this.wishCache = Object.keys(wishes)
                                .map(key => {
                                    return wishes[key]
                                })
                            return this.wishCache
                        }
                    })
                });
            }
        },
        "editWish": {
            "value": function(wish) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "PUT",
                        url: `${firebaseURL}/${wish.fbId}.json?auth=${idToken}`,
                        data: wish
                    })
                })
            }
        },
        "deleteWish": {
            "value": function (wish) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "DELETE",
                        url: `${firebaseURL}/${wish.fbId}/.json?auth=${idToken}`,
                    })
                })
            }
        },
    })
})