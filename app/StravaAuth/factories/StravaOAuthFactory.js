angular.module("BikeLogApp").factory("StravaOAuthFactory", function ($http) {

    return Object.create(null, {
        "stravaId": {
            value: null,
            writable: true,
            enumerable: true
        },
        "stravaToken": {
            value: null,
            writable: true,
            enumerable: true     
        },
        "stravaActivityToken": {
            value: null,
            writable: true,
            enumerable: true
        },
        "stravaActivityTokenExpirationDate": {
            value: null,
            writable: true,
            enumerable: true
        },
        "stravaRefreshToken": {
            value: null,
            writable: true,
            enumerable: true
        },
        "getStravaCallData": {
            value: function() {
                return $http({
                    "url": "https://us-central1-bike-component-log.cloudfunctions.net/stravaInfo/"
                });
            }
        },
        "refreshActivityToken": {
            value: function(refreshToken, clientS) {
                return $http({
                    "method": "POST",
                    "url": "https://www.strava.com/api/v3/oauth/token",
                    data: {
                        client_id: 21849,
                        client_secret: clientS,
                        grant_type: "refresh_token",
                        refresh_token: refreshToken 
                    }
                }).then(response => {
                    if (response) {
                        this.stravaActivityToken = response.data.access_token;
                        this.stravaActivityTokenExpirationDate = response.data.expires_at;
                        this.stravaRefreshToken = response.data.refresh_token;
                    }
                    return response;
                });
            }
        },
        "getActivityToken": {
            value: function(stravaCode, clientS) {
                return $http({
                    "method": "POST",
                    "url": "https://www.strava.com/oauth/token",
                    "data": {
                        client_id: 21849,
                        client_secret: clientS,
                        code: stravaCode
                    }
                }).then(response => {
                    this.stravaActivityToken = response.data.access_token;
                    this.stravaActivityTokenExpirationDate = response.data.expires_at;
                    this.stravaRefreshToken = response.data.refresh_token;

                    return true;
                });
            }
        },
        "getToken": {
            value: function(stravaCode, code) {
                return $http({
                    "method": "POST",
                    "url": "https://www.strava.com/oauth/token",
                    "data": {
                        client_id: 21849,
                        client_secret: code,
                        code: stravaCode
                    }
                })
            }
        },
        "getStravaProfile": {
            value: function() {
                // is strava token still active? 
                if (this.stravaActivityTokenExpirationDate && (this.stravaActivityTokenExpirationDate < Date.now())) {
                    return $http({
                        "method": "GET",
                        "url": `https://www.strava.com/api/v3/athlete?access_token=${this.stravaActivityToken}`,
                    })
                } else if (this.stravaRefreshToken) {
                    // refresh the activity token first, then make the call for profile
                    return this.getStravaCallData().then(response => {
                        if (response && response.data) {
                            return this.refreshActivityToken(this.stravaRefreshToken, response.data).then(response => {
                                return $http({
                                    "method": "GET",
                                    "url": `https://www.strava.com/api/v3/athlete?access_token=${this.stravaActivityToken}`,
                                })
                            })
                        }
                    })
                } else {
                    // get an the activity token first, then make the call for profile
                    return this.getStravaCallData().then(response => {
                        if (response && response.data) {
                            return this.getActivityToken(this.stravaCode, response.data).then(response => {
                                return $http({
                                    "method": "GET",
                                    "url": `https://www.strava.com/api/v3/athlete?access_token=${this.stravaActivityToken}`,
                                })
                            })
                        }
                    })
                }
            }
        },
        "getBikeData": {
            value: function(bikeId) {
                // is strava token still active? 
                if (this.stravaActivityTokenExpirationDate && this.stravaActivityTokenExpirationDate < Date.now()) {
                    return $http({
                        "method": "GET",
                        "url": `https://www.strava.com/api/v3/gear/${bikeId}?access_token=${this.stravaActivityToken}`
                    });
                } else if (this.stravaRefreshToken) {
                    // refresh the activity token first, then make the call for bike data
                    return this.getStravaCallData().then(response => {
                        if (response && response.data) {
                            return this.refreshActivityToken(this.stravaRefreshToken, response.data).then(response => {
                                return $http({
                                    "method": "GET",
                                    "url": `https://www.strava.com/api/v3/gear/${bikeId}?access_token=${this.stravaActivityToken}`
                                });
                            })
                        }
                    })
                } else {
                    // get an the activity token first, then make the call for profile
                    return this.getStravaCallData().then(response => {
                        if (response) {
                            return this.getActivityToken(this.stravaCode, response.data).then(isSuccessful => {
                                return $http({
                                    "method": "GET",
                                    "url": `https://www.strava.com/api/v3/gear/${bikeId}?access_token=${this.stravaActivityToken}`
                                })
                            })
                        }
                    })
                }
            }
        }
    })
})    