$(document).ready(function(){

	$('#team_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		
	}

});

angular.module('teamform-team-app', ['firebase'])
.controller('TeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 
    function($scope, $firebaseObject, $firebaseArray) {
		
	// Call Firebase initialization code defined in site.js
	initializeFirebase();

	var refPath = "";
	var eventName = getURLParameter("q");	
	firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
			$scope.$apply($scope.param.leaderID = user.uid);
        } else {
            // No user is signed in.
        }
    });
	// TODO: implementation of MemberCtrl	
	$scope.param = {
		"teamName" : '',
		"currentTeamSize" : 0,
		"teamMembers" : [],
		"likes": 0,
		"total": 0,
		"desc": '',
		"leaderID": ''
	};
		

	refPath = "event/" + eventName + "/admin";
	retrieveOnceFirebase(firebase, refPath, function(data) {	

		if ( data.child("param").val() != null ) {
			$scope.range = data.child("param").val();
			$scope.param.currentTeamSize = parseInt(($scope.range.minTeamSize + $scope.range.maxTeamSize)/2);
			$scope.$apply(); // force to refresh
			$('#team_page_controller').show(); // show UI
			
		} 
	});
	
	
	refPath = "event/" + eventName + "/member";
	$scope.member = [];
	$scope.member = $firebaseArray(firebase.database().ref(refPath));
	
	
	refPath = "event/" + eventName + "/team";
	$scope.team = [];
	$scope.team = $firebaseArray(firebase.database().ref(refPath));
	
	$scope.requests = [];
	$scope.refreshViewRequestsReceived = function() {
		
		//$scope.test = "";		
		$scope.requests = [];
		var teamID = $.trim( $scope.param.teamName );	
				
		$.each($scope.member, function(i,obj) {			
			//$scope.test += i + " " + val;
			//$scope.test += obj.$id + " " ;
			
			var userID = obj.$id;
			if ( typeof obj.selection != "undefined"  && obj.selection.indexOf(teamID) > -1 ) {
				//$scope.test += userID + " " ;
				
			    $scope.requests.push({ "id": userID, "uid": obj.uid, "name": obj.name});
			}
		});
		
		$scope.$apply();
		
	}
	
	
	
	
	
	

	$scope.saveFunc = function() {
		
		
		var teamID = $.trim( $scope.param.teamName );
		if (($scope.param.currentTeamSize >= $scope.range.minTeamSize) && ($scope.param.currentTeamSize <= $scope.range.maxTeamSize)) {
		    if (teamID !== '') {

		        var newData = {
		        	'leaderID': $scope.param.leaderID,
		            'size': $scope.param.currentTeamSize,
		            'likes': $scope.param.likes,
		            'total': $scope.param.total,
		            'desc': $scope.param.desc,
		            'teamMembers': {}
		        };
		        $.each($scope.param.teamMembers, function (i, obj) {
		            //$scope.test += i + " " + val;
		            //$scope.test += obj.$id + " " ;
		            newData.teamMembers[i]={ "id": obj.id, "uid": obj.uid, "name": obj.name };
		        });
		        var refPath = "event/" + getURLParameter("q") + "/team/" + teamID;
		        var ref = firebase.database().ref(refPath);

		        // for each team members, clear the selection in /[eventName]/team/

		        $.each($scope.param.teamMembers, function (i, obj) {


		            //$scope.test += obj;
		            var rec = $scope.member.$getRecord(obj.id);
		            rec.selection = [];
		            $scope.member.$save(rec);



		        });

		        var leader = true;
		        retrieveOnceFirebase(firebase, refPath, function(data) {	
					if ( data.child("leaderID") != $scope.param.leaderID ){
						$scope.$apply(leader = false); // force to refresh
					}


				});

		        if ( leader ){
			        ref.set(newData, function () {

			            // console.log("Success..");

			            // Finally, go back to the front-end
			            // window.location.href= "index.html";
			        });
		        }
		    }
		}
		
		
	}
	
	$scope.loadFunc = function() {
		
		var teamID = $.trim( $scope.param.teamName );		
		var eventName = "event/" + getURLParameter("q");
		var refPath = eventName + "/team/" + teamID ;
		retrieveOnceFirebase(firebase, refPath, function(data) {	
			if ( data.child("leaderID") == $scope.param.leaderID ){
				if ( data.child("size").val() != null ) {
					
					$scope.param.currentTeamSize = data.child("size").val();
					
					$scope.refreshViewRequestsReceived();
									
					
				} 
				
				if ( data.child("teamMembers").val() != null ) {
					
					$scope.param.teamMembers = data.child("teamMembers").val();
					
				}
				
				if ( data.child("likes").val() != null ) {
					
					$scope.param.likes = data.child("likes").val();
					
				}

				if ( data.child("total").val() != null ) {
					
					$scope.param.total = data.child("total").val();
					
				}	

				if ( data.child("desc").val() != null ) {
					
					$scope.param.desc = data.child("desc").val();
					
				}				
				$scope.$apply(); // force to refresh
			}

		});

	}
	
	$scope.processRequest = function(r) {
		//$scope.test = "processRequest: " + r;
		
		if ( 
		    $scope.param.teamMembers.indexOf(r) < 0 && 
			$scope.param.teamMembers.length < $scope.param.currentTeamSize  ) {
				
			// Not exists, and the current number of team member is less than the preferred team size
		    $scope.param.teamMembers.push(r);
			$scope.param.total++;
			$scope.saveFunc();
		}
	}
	
	$scope.removeMember = function(member) {
		
		var index = $scope.param.teamMembers.indexOf(member);
		if ( index > -1 ) {
			$scope.param.teamMembers.splice(index, 1); // remove that item
			$scope.param.total--;
			$scope.saveFunc();
		}
		
	}
	
	
	
	
	
	
		
}]);
