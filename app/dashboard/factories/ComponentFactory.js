angular.module("BikeLogApp").factory("ComponentFactory", function ($http, $mdToast) {
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
                    })
                })
            }
        },
        "getUserComponents": {
            "value": function (UID) {
                return firebase.auth().currentUser.getIdToken(true).then(idToken => {
                    return $http({
                        method: "GET",
                        url: `${firebaseURL}/.json?orderBy="userId"&equalTo="${UID}"&auth=${idToken}`
                    }).then(response => {
                        const components = response.data
                        if (components) {
                            this.componentsCache = Object.keys(components)
                            .map(key => {
                                return components[key]
                            })
                            return this.componentsCache
                        }
                    })
                });
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
        "deleteImage": {    
            value: function(file) {
                return firebase.storage().ref("/images/ComponentImages/").child(file).delete().then(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .parent($("#toast-container"))
                            .textContent("Photo deleted.")
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
        }, 
        "componentTypes": {
            value: [
                {
                    "name": "bottom bracket",
                    "tips": "https://www.parktool.com/blog/repair-help?query=&sort=postDate+desc&area%5B%5D=47",
                    "icon": "./images/component-icons/noun_117974_cc-bot-bracket.svg"
                },
                {
                    "name": "brake - front",
                    "tips": "https://www.parktool.com/blog/repair-help?query=&sort=featured+desc%2C+postDate+desc&area%5B%5D=48",
                    "icon": "./images/component-icons/noun_894083_cc-brake-lever.svg"
                },
                {
                    "name": "brake - rear",
                    "tips": "https://www.parktool.com/blog/repair-help?query=&sort=featured+desc%2C+postDate+desc&area%5B%5D=48",
                    "icon": "./images/component-icons/noun_894083_cc-brake-lever.svg"
                },
                {
                    "name": "cassette",
                    "tips": "https://www.parktool.com/blog/repair-help/cassette-removal-and-installation",
                    "icon": "./images/component-icons/noun_894039_cc-cassette.svg"
                },
                {
                    "name": "chain",
                    "tips": "https://www.parktool.com/blog/repair-help/chain-replacement-derailleur-bikes",
                    "icon": "./images/component-icons/noun_894088_cc-chain-link.svg"
                },
                {
                    "name": "crankset",
                    "tips": "https://www.parktool.com/blog/repair-help/how-to-remove-and-install-a-crank",
                    "icon": "./images/noun_168563_cc-crankset.svg"
                },
                {
                    "name": "derailleur - front",
                    "tips": "https://www.parktool.com/blog/repair-help?query=&sort=featured+desc%2C+postDate+desc&area%5B%5D=52",
                    "icon": "./images/component-icons/noun_784211_cc-front-der.svg"
                },
                {
                    "name": "derailleur - rear",
                    "tips": "https://www.parktool.com/blog/repair-help?query=&sort=featured+desc%2C+postDate+desc&area%5B%5D=52",
                    "icon": "./images/component-icons/noun_168574_cc-rear-der.svg"
                },
                {
                    "name": "handlebar",
                    "tips": "https://www.parktool.com/blog/repair-help?query=&sort=featured+desc%2C+postDate+desc&area%5B%5D=54",
                    "icon": "./images/component-icons/noun_355669_cc-handlebar.svg"
                },
                {
                    "name": "pedals",
                    "tips": "https://www.parktool.com/blog/repair-help/pedal-installation-and-removal",
                    "icon": "./images/component-icons/noun_117972_cc-single-pedal.svg"
                },
                {
                    "name": "rear shock",
                    "tips": "https://www.google.com/search?q=mountain+bike+rear+shock+maintenance+tips",
                    "icon": "./images/component-icons/noun_894107_cc__rear-shock.svg"
                },
                {
                    "name": "saddle",
                    "tips": "https://www.google.com/search?q=bike+saddle+maintenance+tips",
                    "icon": "./images/component-icons/noun_894071_cc-saddle2.svg"
                },
                {
                    "name": "seat post",
                    "tips": "https://www.google.com/search?q=bike+seat+post+repair+tips&oq=bike+seat+post+repair+tips",
                    "icon": "./images/component-icons/noun_1337274_cc-seatpost.svg"
                },
                {
                    "name": "stem",
                    "tips": "https://www.parktool.com/blog/repair-help?query=&sort=featured+desc%2C+postDate+desc&area%5B%5D=54",
                    "icon": "./images/component-icons/noun_108878_cc-stem.svg"
                },
                {
                    "name": "shifter - front",
                    "tips": "https://www.google.com/search?q=bicycle+front+shifter+maintenance+tips",
                    "icon": "./images/component-icons/noun_894091_cc-shifter.svg"           
                },
                {
                    "name": "shifter - rear",
                    "tips": "https://www.google.com/search?q=bicycle+front+shifter+maintenance+tips",
                    "icon": "./images/component-icons/noun_894091_cc-shifter.svg"       
                },
                {
                    "name": "suspension fork",
                    "tips": "https://www.google.com/search?q=mountain+bike+suspension+fork+maintenance+tips",
                    "icon": "./images/component-icons/noun_1034214_cc-sus-fork.svg"
                },
                {
                    "name": "tire - front",
                    "tips": "https://www.parktool.com/blog/repair-help/tire-and-tube-removal-and-installation",
                    "icon": "./images/component-icons/noun_549552_cc-tire-frontside.svg"
                },
                {
                    "name": "tire - rear",
                    "tips": "https://www.parktool.com/blog/repair-help/tire-and-tube-removal-and-installation",
                    "icon": "./images/component-icons/noun_549552_cc-tire-frontside.svg"
                },
                {
                    "name": "wheel - front",
                    "tips": "https://www.parktool.com/blog/repair-help/wheel-removal-and-installation",
                    "icon": "./images/component-icons/noun_894117_cc-wheel.svg"
                },
                {
                    "name": "wheel - rear",
                    "tips": "https://www.parktool.com/blog/repair-help/wheel-removal-and-installation",
                    "icon": "./images/component-icons/noun_894117_cc-wheel.svg"
                },
            ],
            enumerable: true
        }
    })
})