angular.module('teamform-index-app', ['firebase'])
.controller('IndexCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function ($scope, $firebaseObject, $firebaseArray) {

    // TODO: implementation of MemberCtrl


    // Call Firebase initialization code defined in site.js
    initalizeFirebase();
    $scope.eventID = "";
    var user = firebase.auth().user;
    if (user) {
        // User is signed in.
        $scope.$apply($scope.logined = true);
        $scope.$apply($scope.username = user.displayName);
        if ($scope.username == null) { $scope.$apply($scope.fb = false); $scope.$apply($scope.username = user.email); } else { $scope.$apply($scope.fb = true); };
    } else {
        // No user is signed in.
    };
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            $scope.$apply($scope.logined = true);
            $scope.$apply($scope.username = user.displayName);
            if ($scope.username == null) { $scope.$apply($scope.fb = false); $scope.$apply($scope.username = user.email); } else { $scope.$apply($scope.fb = true); };
        } else {
            // No user is signed in.
        }
    });
    $scope.btn_fb = function () {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                // ...
                $scope.$apply($scope.username = result.user.displayName);
                $scope.$apply($scope.logined = true);
            // The signed-in user info.
                
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }

    $scope.btn_admin = function() {
        var val = $scope.eventID;
        if (val !== '') {
            var url = "admin.html?q=" + val;
            window.location.href = url;
            //return false;
        }
    }

    $scope.btn_logout = function () {
        if ($scope.logined) {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                $scope.$apply($scope.logined = false);
                $scope.$apply($scope.fb = false);
            }, function (error) {
                // An error happened.
            });
        }
    }

    $scope.btn_email = function () {
       window.location.href = "signin.html";
    }

    $scope.btn_leader = function() {
        var val = $scope.eventID;
        if (val !== '') {
            var url = "team.html?q=" + val;
            window.location.href = url;
            //return false;
        }
    }

    $scope.btn_list = function (eventId) {
        if (eventId !== '') {
            var url = "team.html?q=" + eventId;
            window.location.href = url;
            //return false;
        }
    }

    $scope.btn_member = function() {
        var val = $scope.eventID;
        if (val !== '') {
            var url = "member.html?q=" + val;
            window.location.href = url;
            //return false;
        }
    }

    $scope.refreshEvents = function () {
        var ref = firebase.database().ref("event/");

        // Link and sync a firebase object
       /* $scope.selection = [];
        $scope.toggleSelection = function (item) {
            var idx = $scope.selection.indexOf(item);
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            else {
                $scope.selection.push(item);
            }
        }*/


        $scope.events = $firebaseArray(ref);
        $scope.events.$loaded()
			.then(function (data) {



			})
			.catch(function (error) {
			    // Database connection error handling...
			    //console.error("Error:", error);
			});


    }


    $scope.refreshEvents(); // call to refresh teams...
}]);