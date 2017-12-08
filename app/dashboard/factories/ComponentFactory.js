angular.module("BikeLogApp").factory("ComponentFactory", function ($http) {
    // store firebase url for later user
    const firebaseURL = "https://bike-component-log.firebaseio.com/components"

    // create object with methods we'll use to manage user profiles in firebase
    return Object.create(null, {
        "componentCache": {
            value: 0,
            writable: true,
            enumerable: true
        },
        "componentTypes": {
            value: [
                "tires",
                "front wheel",
                "rear wheel",
                "pedals",
                "chain",
            ],
            enumerable: true
        },
        "addComponent": {
            "value": function (newComponent) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "POST",
                        url: `${firebaseURL}.json?auth=${idToken}`,
                        data: newComponent
                    }).then(r => {
                        console.log("component uploaded")
                    })
                })
            }
        },
        "getUserComponents": {
            "value": function (UID) {
                console.log("UID", UID)
                return $http({
                    method: "GET",
                    url: `${firebaseURL}/.json?orderBy="userId"&equalTo="${UID}"`
                }).then(response => {
                    const components = response.data
                    if (components) {
                        this.componentCache = Object.keys(components)
                            .map(key => {
                                components[key].fbId = key
                                return components[key]
                            })
                        console.log("componentCache: ", this.componentCache)
                        return this.componentCache
                    }
                })
            }
        }

    })

})