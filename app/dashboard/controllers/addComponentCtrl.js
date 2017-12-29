angular.module("BikeLogApp").controller("addComponentCtrl", function ($scope, $route, $timeout, $location, AuthFactory, ComponentFactory, BikeFactory) {
    // get the user in case we need their UID
    const user = AuthFactory.getUser()

    // set flag to control photo upload progress meter
    $scope.photoUploadProgress = {}
    $scope.photoUploadProgress.flag = true


    // set the max date allowed in the date picker to today's date.
    $scope.maxDate = new Date(new Date().toISOString())

    // check if we are in Edit Component Mode
    if (!ComponentFactory.editCompMode) {

        // set local Edit mode variable to true to show user the correct button for submitting component, save new or save edits
        $scope.editMode = false

        // initalize the newComponent object to use in form
        $scope.newComponent = {}

        $scope.newComponent.type = {}

        // set the starting value of mileage to 0
        // $scope.newComponent.mileage = 0
        

        // create an array to hold images
        $scope.newComponent.images = []

        // sets the default date purchased to today's date. User can then change to which ever date they'd like. 
        if (!$scope.newComponent.installationDate) {
            $scope.newComponent.installationDate = new Date($scope.maxDate)
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
        if (ComponentFactory.currentComponent.installationDate) {
            $scope.newComponent.installationDate = new Date(ComponentFactory.currentComponent.installationDate)

        }
    }

    // function to send user back to dashboard if Cancel button is clicked
    $scope.cancelForm = () => {
        $location.url("/dashboard")
    }

    // create a function to run when a user uploads a file. Inside that function call $scope.saveImage()
    $scope.uploadFile = function() {
        
        $scope.photoUploadProgress.flag = false
        $timeout( ()=>{
            $scope.saveImage()

        })
    }



    $scope.saveImage = () => {
        // get the name of the file to upload
        let filename = document.getElementById("addComponent__imageBtn");
        let file = filename.files[0]

        ComponentFactory.addImage(file).then(_url => {
            // hide the photo upload progress meter
            $scope.photoUploadProgress.flag = true
            // need to wrap this in a $apply to get the newBike.image to display in dom immediately upon successful upload
            $scope.$apply(function () {

                $scope.newComponent.images.push(_url)
            })
        })
    }

    // function to delete a photo
    $scope.deletePhoto = (photo) => {
        // find the index of the photo to delete
        let imagesIndex = $scope.newComponent.images.indexOf(photo)
        // remove the web url for the photo on the Bike table
        $scope.newComponent.images.splice(imagesIndex,1)
        
        let fileName
        // parse out the filename from the url
        if (photo !== "" ) {

            fileName = photo.split("ComponentImages%2F")[1].split("?")[0]
            // delete the photo from firebase
            ComponentFactory.deleteImage(fileName)
        }
    }



    // function to create a component object when the user clicks submit button on form, then store the new component in firebase
    $scope.addComponent = function () {
        // get current user data
        const user = AuthFactory.getUser()


        // if the user didn't enter a mileage amount, set the mileage amount to 0
        if (!$scope.newComponent.mileage) {
            $scope.newComponent.mileage = 0;
        }


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
        $scope.newComponent.installationDate = $scope.newComponent.installationDate.getTime()


        // check if edit mode is on to know whether to create a new bike or edit an existing one
        if (!$scope.editMode) {
            
            // Post this new component to firebase
            ComponentFactory.addComponent($scope.newComponent).then(()=>{

                // need to wrap this in $scope.apply to get it to work inside the .then().
                $scope.$apply(function() {
                    $location.url("/dashboard")
                })
            })

        } else {
            ComponentFactory.updateComponent($scope.newComponent).then(() => {

                $scope.editMode = false
                ComponentFactory.editCompMode = false

                // need to wrap this in $scope.apply to get it to work inside the .then().
                $scope.$apply(function() {
                    $location.url("/dashboard")
                })
            })
        }

        // Reset the form after successful upload
        $scope.newComponent = {}
        // prepopulate the mileage box to 0
        // $scope.newComponent.mileage = 0
        $scope.componentForm.$setPristine()


    }

})    