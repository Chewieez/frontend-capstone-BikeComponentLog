angular.module("BikeLogApp").factory("ComponentFactory", function ($http) {
    // store firebase url for later user
    const firebaseURL = "https://bike-component-log.firebaseio.com/components"

    // create object with methods we'll use to manage user profiles in firebase
    return Object.create(null, {
        "componentsCache": {
            value: 0,
            writable: true,
            enumerable: true
        },
        "editCompMode": {
            value: false,
            writable: true,
            enumerable: true,
        },
        "currentComponent": {
            value: 0,
            writable: true,
            enumerable: true
        },
        "addComponent": {
            "value": function (newComponent) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "POST",
                        url: `${firebaseURL}.json?auth=${idToken}`,
                        data: newComponent
                    }).then(response => {
                        // add fbId from response
                        newComponent.fbId = response.data.name
                        // put the component back up to firebase, now with a fb id attached
                        return $http({
                            "method": "PUT",
                            "url": `${firebaseURL}/${newComponent.fbId}/.json?auth=${idToken}`,
                            "data": newComponent
                        })
                    })
                })
            }
        },
        "updateComponent": {
            "value": function (component) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "PUT",
                        url: `${firebaseURL}/${component.fbId}.json?auth=${idToken}`,
                        data: component
                    }).then(r => {
                        console.log("component uploaded")
                    })
                })
            }
        },
        "getUserComponents": {
            "value": function (UID) {
                return $http({
                    method: "GET",
                    url: `${firebaseURL}/.json?orderBy="userId"&equalTo="${UID}"`
                }).then(response => {
                    const components = response.data
                    if (components) {
                        this.componentsCache = Object.keys(components)
                            .map(key => {
                                // components[key].fbId = key
                                return components[key]
                            })
                        console.log("components cached", this.componentsCache)
                        return this.componentsCache
                    }
                })
            }
        },
        "deleteComponent": {
            "value": function (comp) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "DELETE",
                        url: `${firebaseURL}/${comp.fbId}/.json?auth=${idToken}`,
                    })
                })
            }
        },
        "addImage": {
            value: function(file) {
                // add a time stamp to make each image file unique on Firebase
                const stamp = Date.now()
                return firebase.storage().ref("/images/ComponentImages/").child(file.name + stamp).put(file).then(result => {
                    // get the url of the image you uploaded
                    return firebase.storage().ref("/images/ComponentImages/").child(file.name + stamp).getDownloadURL()
                })
            }
        },  
        "componentTypes": {
            // add more types
            value: [
                {
                    "name": "tires",
                    "tips": "https://www.parktool.com/blog/repair-help/tire-and-tube-removal-and-installation"
                },
                {
                    "name": "front wheel",
                    "tips": "https://www.parktool.com/blog/repair-help/wheel-removal-and-installation"
                },
                {
                    "name": "rear wheel",
                    "tips": "https://www.parktool.com/blog/repair-help/wheel-removal-and-installation"
                },
                {
                    "name": "pedals",
                    "tips": "https://www.parktool.com/blog/repair-help/pedal-installation-and-removal"
                },
                {
                    "name": "chain",
                    "tips": "https://www.parktool.com/blog/repair-help/chain-replacement-derailleur-bikes"
                },
                {
                    "name": "cassette",
                    "tips": "https://www.parktool.com/blog/repair-help/cassette-removal-and-installation"
                },
                {
                    "name": "crankset",
                    "tips": "https://www.parktool.com/blog/repair-help/how-to-remove-and-install-a-crank"
                },

            ],
            enumerable: true
        }

    })

})