angular.module("BikeLogApp").factory("ProfileFactory", function ($http, $location, $route) {
    // store firebase url for later user
    const firebaseURL = "https://bike-component-log.firebaseio.com/users"

    // create object with methods we'll use to manage user profiles in firebase
    return Object.create(null, {
        "profileCache": {
            "value": "",
            "writable": true
        },
        "addProfile": {
            value: (userProfile, fbUID) => {
                // get token for current user, then post profile data to db
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "POST",
                            url: `${firebaseURL}.json?auth=${idToken}`,
                            data: {
                                "firstName": userProfile.firstName,
                                "lastName": userProfile.lastName,
                                "photo": 0,
                                "stravaId": userProfile.stravaId || 0,
                                "fbUID": fbUID
                            }
                        })
                    }).then(
                        function() {
                            console.log("profile stored")
                        }
                    )
            }
        },
        "editProfile": {
            value: function (userProfile) {
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            "method": "PUT",
                            "url": `${firebaseURL}/${userProfile.fbId}/.json?auth=${idToken}`,
                            "data": userProfile
                        })
                    }).then(function(){
                        console.log("profile updated")
                    })

                
            }
        },
        "getProfile": {
            value: function (UID) {
                let currentUserProfile = {}
                return $http({
                    "method": "GET",
                    "url": `${firebaseURL}/.json?orderBy="fbUID"&equalTo="${UID}"`
                }).then(response => {
                    for (let key in response.data) {
                        currentUserProfile = response.data[key]
                        currentUserProfile.fbId = key
                    }
                    debugger
                    this.profileCache = currentUserProfile
                    return currentUserProfile
                })
            }
        }
    })
})