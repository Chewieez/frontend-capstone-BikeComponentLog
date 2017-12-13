angular.module("BikeLogApp").controller("addComponentCtrl", function ($scope, $route, $location, AuthFactory, ComponentFactory, BikeFactory) {
    // get the user in case we need their UID
    const user = AuthFactory.getUser()

    // check if we are in Edit Component Mode
    if (!ComponentFactory.editCompMode) {

        // set local Edit mode variable to true to show user the correct button for submitting component, save new or save edits
        $scope.editMode = false

        // initalize the newComponent object to use in form
        $scope.newComponent = {}

        // set the starting value of mileage to 0
        $scope.newComponent.mileage = 0

        // create an array to hold images
        $scope.newComponent.images = []

        // sets the default date purchased to today's date. User can then change to which ever date they'd like. 
        if (!$scope.newComponent.purchaseDate) {
            $scope.newComponent.purchaseDate = new Date(new Date().toISOString().split("T")[0])
        }


        // store component types in an array to populate dropdown list
        $scope.componentTypes = ComponentFactory.componentTypes


        // get the current bike id and attach it to the new component object
        $scope.currentBike = BikeFactory.currentBike


    } else {
        // set local Edit mode variable to true to show user the correct button for submitting component, save new or save edits
        $scope.editMode = true

        // set the $scope new Bike variable to the current bike chosen to edit
        $scope.newComponent = ComponentFactory.currentComponent

        // check if an images array currently exists
        if (!$scope.newComponent.images) {
            // create an array for images
            $scope.newComponent.images = []
        }

        // populate the date window with the components original saved date
        if (ComponentFactory.currentComponent.purchaseDate) {
            $scope.newComponent.purchaseDate = new Date(ComponentFactory.currentComponent.purchaseDate)

        }
    }

    // function to send user back to dashboard if Cancel button is clicked
    $scope.cancelForm = () => {
        $location.url("/dashboard")
    }

    $scope.saveImage = () => {
        // get the name of the file to upload
        let filename = document.getElementById("addComponent__image");
        let file = filename.files[0]

        ComponentFactory.addImage(file).then(_url => {
            // need to wrap this in a $apply to get the newBike.image to display in dom immediately upon successful upload
            $scope.$apply(function () {

                $scope.newComponent.images.push(_url)
            })
        })
    }

    // function to delete a photo
    $scope.deletePhoto = (photo) => {
        debugger
        let imagesIndex = $scope.newComponent.images.indexOf(photo)
        $scope.newComponent.images.splice(0,1)
        
        let fileName = photo.split("ComponentImages%2F")[1].split("?")[0]
        debugger
        ComponentFactory.deleteImage(fileName)
        
    }



    // function to create a component object when the user clicks submit button on form, then store the new component in firebase
    $scope.addComponent = function () {
        // get current user data
        const user = AuthFactory.getUser()


        if (!$scope.newComponent.bikeFbId) {
            // attach the current Bikes firebase Id to the component
            $scope.newComponent.bikeFbId = BikeFactory.currentBike.fbId
        }

        // check if there is already a userId attached to the bike, if so, use the current one. If not, add it
        if (!$scope.newComponent.userId) {
            // add the userId to the new Component object
            $scope.newComponent.userId = user.uid
        }

        // active an active flag to component by default
        $scope.newComponent.active = true

        //convert time to milliseconds
        $scope.newComponent.purchaseDate = $scope.newComponent.purchaseDate.getTime()


        // check if edit mode is on to know whether to create a new bike or edit an existing one
        if (!$scope.editMode) {
            // Post this new component to firebase
            ComponentFactory.addComponent($scope.newComponent)
        } else {
            ComponentFactory.updateComponent($scope.newComponent).then(() => {

                $scope.editMode = false
                ComponentFactory.editCompMode = false

                // need to wrap this in $scope.apply to get it to work.
                $scope.$apply(() => {
                    $location.url("/dashboard")
                })
            })
        }

        // Reset the form after successful upload
        $scope.newComponent = {}
        // prepopulate the mileage box to 0
        $scope.newComponent.mileage = 0
        $scope.componentForm.$setPristine()


    }

})    