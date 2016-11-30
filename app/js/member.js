$(document).ready(function(){

	$('#member_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		$('#member_page_controller').show();
	}

});

angular.module('teamform-member-app', ['firebase'])
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	
	// TODO: implementation of MemberCtrl
	
	
	// Call Firebase initialization code defined in site.js
	initializeFirebase();
	
	$scope.userID = "";
	$scope.userName = "";	
	$scope.teams = {};
	
	firebase.auth().onAuthStateChanged(function (user) {
	    if (user) {
	        // User is signed in.
	        $scope.userName = user.displayName;
	        $scope.userID = user.uid;
	        $scope.logined = true;
	        if ( $scope.userName == null ){
	        	$scope.fb = false
	        }else {
	        	$scope.fb = true
	        }

	        var refPath = "info/" + user.uid;
            retrieveOnceFirebase(firebase, refPath, function (data) {
                if (data.child("major").val() != null) {

                    $scope.info.major = data.child("major").val();


                }

                if (data.child("native").val() != null) {

                    $scope.info.native = data.child("native").val();



                }
                if (data.child("hall").val() != null) {

                    $scope.info.hall = data.child("hall").val();



                }
                if (data.child("aim").val() != null) {

                    $scope.info.aim = data.child("aim").val();



                }
                if (data.child("intro").val() != null) {

                    $scope.info.intro = data.child("intro").val();



                }
                if (data.child("name").val() != null) {

                    $scope.info.name = data.child("name").val();



                }
                if (data.child("psy1").val() != null) {

                    $scope.info.psy1 = data.child("psy1").val();



                }
                else { $scope.info.psy1 = false; }
                if (data.child("psy2").val() != null) {

                    $scope.info.psy2 = data.child("psy2").val();



                }
                else { $scope.info.psy2 = false; }
                if (data.child("psy3").val() != null) {

                    $scope.info.psy3 = data.child("psy3").val();



                }
                else { $scope.info.psy3 = false; }

                $scope.$apply($scope.loaded = true); // force to refresh
            });
	    } else {
	        // No user is signed in.
	    }
	});

	
	$scope.loadFunc = function() {
		var userID = $scope.userID;
		if ( userID !== '' ) {
			
		    var refPath = "event/" + getURLParameter("q") + "/member/" + userID;
			retrieveOnceFirebase(firebase, refPath, function(data) {
								
				if ( data.child("name").val() != null ) {
					$scope.userName = data.child("name").val();
				} else {
					$scope.userName = "";
				}
				
				
				if (data.child("selection").val() != null ) {
					$scope.selection = data.child("selection").val();
				}
				else {
					$scope.selection = [];
				}
				$scope.$apply();
			});
		}
	}
	
	$scope.saveFunc = function() {
		
		
		var userID = $.trim( $scope.userID );
		var userName = $.trim( $scope.userName );
		
		if ( userID !== '' && userName !== '' ) {
									
			var newData = {				
				'name': userName,
				'selection': $scope.selection,
				'uid': userID,
			};
			
			var refPath = "event/" + getURLParameter("q") + "/member/" + userID;
			var ref = firebase.database().ref(refPath);
			
			ref.set(newData, function(){
				// complete call back
				//alert("data pushed...");
				
				// Finally, go back to the front-end
				window.location.href= "index.html";
			});
			
			
		
					
		}
	}
	
	$scope.refreshTeams = function() {
	    var refPath = "event/" + getURLParameter("q") + "/team";
		var ref = firebase.database().ref(refPath);
		
		// Link and sync a firebase object
		$scope.selection = [];		
		$scope.toggleSelection = function (item) {
			var idx = $scope.selection.indexOf(item);    
			if (idx > -1) {
			//	$scope.selection.splice(idx, 1);
			}
			else {
				$scope.selection.push(item);
			}
		}
	
	
		$scope.teams = $firebaseArray(ref);
		$scope.teams.$loaded()
			.then( function(data) {
								
							
							
			}) 
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});
		$.each($scope.teams, function (i, obj) {
		    //$scope.test += i + " " + val;
		    //$scope.test += obj.$id + " " ;
		    t
		    var refPath = "info/" + user.uid;
            retrieveOnceFirebase(firebase, refPath, function (data) {
            	$scope.team[obj.id].same=0;
                if (data.child("major").val() != null) {

                    $scope.teams[obj.id].major = data.child("major").val();


                }
                if($scope.teams[obj.id].major==$scope.info.major) $scope.teams[obj.id].same++;
                if (data.child("native").val() != null) {

                    $scope.teams[obj.id].native = data.child("native").val();



                }
                if($scope.teams[obj.id].native==$scope.info.native) $scope.teams[obj.id].same++;
                if (data.child("hall").val() != null) {

                    $scope.teams[obj.id].hall = data.child("hall").val();



                }
                if($scope.teams[obj.id].hall==$scope.info.hall) $scope.teams[obj.id].same++;
                if (data.child("aim").val() != null) {

                    $scope.teams[obj.id].aim = data.child("aim").val();



                }
                if($scope.teams[obj.id].aim==$scope.info.aim) $scope.teams[obj.id].same++;
                if (data.child("intro").val() != null) {

                    $scope.teams[obj.id].intro = data.child("intro").val();



                }
                if (data.child("name").val() != null) {

                    $scope.teams[obj.id].name = data.child("name").val();



                }
                $scope.teams[obj.id].psy=0;
                if (data.child("psy1").val() != null) {

                    $scope.teams[obj.id].psy1 = data.child("psy1").val();



                }
                else { $scope.teams[obj.id].psy1 = false; }
                if($scope.teams[obj.id].psy1==$scope.info.psy1) $scope.teams[obj.id].psy++;
                if (data.child("psy2").val() != null) {

                    $scope.teams[obj.id].psy2 = data.child("psy2").val();



                }
                else { $scope.teams[obj.id].psy2 = false; }
                if($scope.teams[obj.id].psy2==$scope.info.psy2) $scope.teams[obj.id].psy++;
                if (data.child("psy3").val() != null) {

                    $scope.teams[obj.id].psy3 = data.child("psy3").val();



                }
                else { $scope.teams[obj.id].psy3 = false; }
                if($scope.teams[obj.id].psy3==$scope.info.psy3) $scope.teams[obj.id].psy++;

            });
		});	
		
	}
	
	
	$scope.refreshTeams(); // call to refresh teams...
		
}]);