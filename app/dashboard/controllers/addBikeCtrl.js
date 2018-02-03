angular.module("BikeLogApp").controller("addBikeCtrl", function ($scope, $location, $timeout, AuthFactory, BikeFactory, ComponentFactory, $mdDialog, $mdToast) {

    // set flag to control photo upload progress meter
    $scope.photoUploadProgress = {}
    $scope.photoUploadProgress.flag = true

    // set the max date allowed in the date picker to today's date.
    $scope.maxDate = new Date(new Date().toISOString())

    // check if we are in Edit Bike Mode
    if (!BikeFactory.editBikeMode) {
        // set local Edit mode variable to true to show the user a Save Edits button and not a Add Bike Button
        $scope.editMode = false

        // initialize the newBike object to use in form
        $scope.newBike = {}
        $scope.newBike.images = []

        // // set the starting value of mileage to 0
        // $scope.newBike.mileage = 0

        //sets the default date purchased to today's date. User can then change to which ever date they'd like. 
        // $scope.newBike.purchaseDate = new Date(new Date().toISOString().split("T")[0])
        if (!$scope.newBike.purchaseDate) {
            $scope.newBike.purchaseDate = new Date($scope.maxDate)
        }

    } else {
        // set local Edit mode variable to true to show the user a Save Edits button and not a Add Bike Button
        $scope.editMode = true
        // set the $scope new Bike variable to the current bike chosen to edit
        $scope.newBike = BikeFactory.currentBike

        // check if an images array currently exists
        if (!$scope.newBike.images) {
            // create an array for images
            $scope.newBike.images = []
        }

        // if the bike currently has a date, populate the date window with that date info, if not, populate date window with the current days date. 
        if (BikeFactory.currentBike.purchaseDate) {
            $scope.newBike.purchaseDate = new Date(BikeFactory.currentBike.purchaseDate)
        } else {
            $scope.newBike.purchaseDate = new Date($scope.maxDate)
        }
    }

   

    // function to run when a user clicks the Upload photo button. 
    $scope.uploadFile = function() {
        
        // turn on the progress meter to show file is uploading
        $scope.photoUploadProgress.flag = false
        // run function to save the image to Firebase storage
        $timeout( ()=>{
            $scope.saveImage()
        })
    }

    // error dialog popup to show when user tried to upload a photo that exceedes maximum file size set
    $scope.showErrorDialog = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector("#popupContainer")))
                .clickOutsideToClose(true)
                .title("Photo Upload Error")
                .textContent("Photo File Size must not exceed 1.6mb.")
                .ariaLabel("Photo Upload Error, Photo File Size must not exceed 1.6mb.")
                .ok("OK")
                .targetEvent(ev)
        );
    };

    // function to save the users photos of their bike
    $scope.saveImage = () => {
        
        // get the name of the file to upload
        let filename = document.getElementById("addPhoto__imageBtn");
        let file = filename.files[0]

        //check file size, if too big, throw error and alert user, if not, save
        if (file.size > 212500) {
            // hide the photo upload progress meter
            $scope.photoUploadProgress.flag = true
            
            // show error dialog popup
            $scope.showErrorDialog()
            
        } else {
            // Save photo to firebase
            BikeFactory.addImage(file).then(_url => {
                // hide the photo upload progress meter
                $scope.photoUploadProgress.flag = true
                // need to wrap this in a $apply to get the newBike.image to display in dom immediately upon successful upload
                $scope.$apply(function () {
    
                    $scope.newBike.images.push(_url)
                })
            })
        }
    }

    // function to delete a photo
    $scope.deletePhoto = (photo) => {
        // find the index of the photo to delete
        let imagesIndex = $scope.newBike.images.indexOf(photo)
        // remove the web url for the photo on the Bike table
        $scope.newBike.images.splice(imagesIndex, 1)

        let fileName
        // parse out the filename from the url
        if (photo !== "" ) {
            fileName = photo.split("BikeImages%2F")[1].split("?")[0]
            // delete the photo from firebase
            BikeFactory.deleteImage(fileName)
        }
        

    }



    $scope.cancelForm = () => {
        $location.url("/dashboard")
    }

    $scope.addBike = function () {
        // get the current User data
        const user = AuthFactory.getUser()

        // if the user didn't enter a starting mileage, create the bike with mileage set to 0
        if (!$scope.newBike.mileage) {
            $scope.newBike.mileage = 0 
        }

        // check if there is already a userId attached to the bike, if so, use the current one. If not, add it
        if (!$scope.newBike.userId) {
            // add the userId to the new Bike object
            $scope.newBike.userId = user.uid
        }

        // check if there is already a stravaId on newBike object. Use it if there is, if there isn't create one and initialize with 0 so it will be stored in firebase.
        if (!$scope.newBike.stravaBikeId) {
            $scope.newBike.stravaBikeId = 0
        }

        //convert time to milliseconds
        $scope.newBike.purchaseDate = $scope.newBike.purchaseDate.getTime()


        // save the newly created by as the Current Bike in Bike Factory, so when the user is sent back to the dashboard, this new bike is automatically set as the current bike to display
        BikeFactory.currentBike = $scope.newBike
        // clear out any remnants in ComponentFactory.componentsCache
        ComponentFactory.componentsCache = {}

        // check if edit mode is on to know whether to create a new bike or edit an existing one
        if (!$scope.editMode) {

            // upload the new bike to Firebase
            BikeFactory.addBike($scope.newBike).then(() => {

                // make sure edit mode on BikeFactory is and stays false, until a user clicks the Edit button
                BikeFactory.editMode = false

                // need to wrap this in $scope.apply to get it to work.
                $scope.$apply(() => {
                    $location.url("/dashboard")
                })
            })

        } else {

            // store the newly edited bike back into Firebase
            BikeFactory.editBike($scope.newBike).then((response) => {
                BikeFactory.editMode = false
                $scope.editMode = false

                // need to wrap this in $scope.apply to get it to work.
                $scope.$apply(() => {
                    $location.url("/dashboard")
                })
            })
        }


        // Reset the form after successful upload
        $scope.newBike = {}
        // prepopulate the mileage box to 0
        $scope.newBike.mileage = 0
        $scope.bikeForm.$setPristine();


    }

})    