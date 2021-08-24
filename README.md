# Trackd Me     - The Bicycle Component Tracker

Web Application to individually track each component on your bike and quickly discover the amount of miles accrued on the component and how long it's been installed on your bike. 

## Site Demo
<img src="https://drive.google.com/uc?id=19kVOp_Po43iSSsgzTfb7X8r9HOWA45c2"  alt="TrackdMe Demo gif" width="800" height="auto">

## Initial Account Setup
<img src="https://drive.google.com/uc?id=1qqE-uX62ct5svzUPipP2qMAZ4XZaZIFI"  alt="TrackdMe Setup New Account gif" width="800" height="auto">

### Built with:
AngularJS and AngularJS-Material UI Component framework 

HTML, CSS, Javascript

Grunt, ESLint

Firebase



### To Install
1. Clone repo
1. In terminal, run `npm install` from the lib directory
1. Rename file `strava.example.Client` to `strava.Client.js` and put in placeholder values for ClientID & secret.
1. Run `grunt` from the lib directory to build the bundle and turn on file watching
1. If needed, install HTTP-Server. (npm http-server) from the root directory
1. Run HTTP-Server
1. Point your browser to localhost:XXXX (XXXX = whichever port you chose for your HTTP server)

### Deploying to Firebase
1. Run Grunt Clean and Grunt Deploy to copy the files
1. We use the Firebase cli for this
1. To be safe, log out and then back in again. `firebase logout` `firebase login`
1. Check your projects with: `firebase projects:list`
1. Confirm the current is correct and then run `firebase deploy` or `firebase deploy --except functions`

### Limitations
1. Linking your account with Strava will not work because the Strava secret token is not included in this repo
