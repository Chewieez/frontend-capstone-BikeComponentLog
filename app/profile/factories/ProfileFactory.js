angular.module("BikeLogApp").factory("ProfileFactory", function ($http, $mdToast) {
    // store firebase url for later user
    const firebaseURL = "https://bike-component-log.firebaseio.com/users"

    // let profileCache = null

    // create object with methods we'll use to manage user profiles in firebase
    return Object.create(null, {
        "profileCache": {
            value: null,
            writable: true,
            enumerable: true 
        },
        "addProfile": {
            value: (userProfile, userId) => {
                // get token for current user, then post profile data to db
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "POST",
                            url: `${firebaseURL}.json?auth=${idToken}`,
                            data: userProfile
                        }).then(response => {
                            // add fbId from response
                            userProfile.fbId = response.data.name
                            // put the userProfile back up to firebase, now with a fb id attached
                            return $http({
                                "method": "PUT",
                                "url": `${firebaseURL}/${userProfile.fbId}/.json?auth=${idToken}`,
                                "data": userProfile
                            })
                        })
                    })
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
                    })
            }
        },
        "getProfile": {
            value: function (UID) {
                // let currentUserProfile = {}
                return $http({
                    "method": "GET",
                    "url": `${firebaseURL}/.json?orderBy="userId"&equalTo="${UID}"`
                }).then(response => {
                    // cache user profile
                    for (let key in response.data) {
                        this.profileCache = response.data[key]
                    }
                    return this.profileCache
                })
            }
        },
        "addImage": {
            value: function(file) {
                // add a time stamp to make each image file unique on Firebase
                const stamp = Date.now()
                return firebase.storage().ref("/images/ProfileImages/").child(file.name + stamp).put(file).then(result => {
                    // get the url of the image you uploaded
                    return firebase.storage().ref("/images/ProfileImages/").child(file.name + stamp).getDownloadURL()
                })
            }
        },
        "deleteImage": {    
            value: function(file) {
                return firebase.storage().ref("/images/ProfileImages/").child(file).delete().then(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .parent($("#toast-container"))
                            .textContent("Photo deleted")
                            .hideDelay(3000)
                    );
                }).catch(function (error) {
                    $mdToast.show(
                        $mdToast.simple()
                            .parent($("#toast-container"))
                            .textContent("Uh oh, error deleting photo.")
                            .hideDelay(3000)
                    );
                });
            }
        }
    })
})