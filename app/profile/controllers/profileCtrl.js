angular.module("BikeLogApp").controller("profileCtrl", function ($scope, $route, $timeout, $location, ProfileFactory, AuthFactory, StravaOAuthFactory, PhotoErrorPopupService) {
    // get current user 
    const currentUser = AuthFactory.getUser()
    
    // set flag to control photo upload progress meter
    $scope.photoUploadProgress = {}
    $scope.photoUploadProgress.flag = true

    $scope.currentUserProfile = {}
    $scope.currentUserProfile.image = null

    // get current user profile
    ProfileFactory.getProfile(currentUser.uid).then(response=> {
        // assign the returned userProfile to the scope variable to display in partial
        if (response) {
            $scope.currentUserProfile = response
        }
    }).then(()=>{
        // variable to hold edit mode flag
        $scope.editMode = false
        // flag to check if there is a profile created yet or not, to control whether the user is able to create their profile or update the info after they have a profile
        $scope.profileFlag = false

        if (ProfileFactory.profileCache) {
            $scope.profileFlag = true
        }
        
    })
    
    // create a object to hold the profile info from the form
    $scope.currentUserProfile = {}

        
    // create function to handle the click on profile.html when a user wants to create a profile
    $scope.addProfile = function () {
        const userId = AuthFactory.getUser()
        
        const userProfile = {
            "firstName": $scope.currentUserProfile.firstName,
            "lastName": $scope.currentUserProfile.lastName,
            "stravaId": 0,
            "userId": userId.uid
        }
    
        ProfileFactory.addProfile(userProfile, userId.uid).then(()=>{
            //reload view so user can get confirmation their profile was created
            $location.url("/dashboard")
        })
    }

    // function to edit profile
    $scope.editProfile = function () {
        $scope.editMode = true
    }

     
    $scope.updateProfile = function() {

        ProfileFactory.editProfile($scope.currentUserProfile).then(()=>{
            $scope.editMode = false

            $scope.$apply(() => {
                $location.url("/dashboard")
            })
        })
    }

    $scope.cancelUpdate = function() {
        $scope.editMode = false
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
        let filename = document.getElementById("addPhoto__imageBtn");
        let file = filename.files[0]

        //check file size, if too big, throw error and alert user, if not, save
        if (file.size > 1677721) {
            // hide the photo upload progress meter
            $scope.photoUploadProgress.flag = true
            
            // show error dialog popup, using custom service "PhotoErrorPopupService"
            PhotoErrorPopupService.showErrorDialog()

        } else {
            ProfileFactory.addImage(file).then(_url => {
            // hide the photo upload progress meter
                $scope.photoUploadProgress.flag = true
                // need to wrap this in a $apply to get the newBike.image to display in dom immediately upon successful upload
                $scope.$apply(function () {

                    $scope.currentUserProfile.image = _url
                })
            })
        }
    }

    // function to delete a photo
    $scope.deletePhoto = (photo) => {
        let fileName
        // parse out the filename from the url
        if (photo !== "" ) {

            fileName = photo.split("ProfileImages%2F")[1].split("?")[0]
            // delete the photo from firebase
            ProfileFactory.deleteImage(fileName)
        }
        $scope.currentUserProfile.image = null;
    }
})