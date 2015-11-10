var trackQueryData;
var currentPreview;

var baseUrl = 'https://api.spotify.com/v1/search?type=track&limit=10&market=US&query=';
var myApp = angular.module('myApp', ["firebase"]);

var mainCtrl = myApp.controller('mainCtrl', function ($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth) {

	var ref = new Firebase('https://spotifydj.firebaseio.com/');

	var tracksRef = ref.child('tracks');
	var usersRef = ref.child('users');

	$scope.users = $firebaseObject(usersRef);
	$scope.authObj = $firebaseAuth(ref);

	$scope.authData = $scope.authObj.$getAuth();

	/*
	$scope.authObj.$onAuth(function (authDataOriginal) {
		$scope.authData = authDataOriginal;
	});

	*/
	if ($scope.authData) {
		$scope.userId = $scope.authData.uid;

		$("#loginButton").css('display', 'none');
		$("#logoutButton").css('display', 'inline');
		$("#signupButton").css('display', 'none');
	}
	else {
		$("#loginButton").css('display', 'inline');
		$("#logoutButton").css('display', 'none');
	}

	$scope.playlist = $firebaseArray(tracksRef);

	$scope.audioObject = {}
	$scope.currentTrackAudio = {}
	
	//Sign In
	$scope.signUp = function () {

		$scope.authObj.$createUser({
			email: $scope.email,
			password: $scope.password,
		})
			.then($scope.logIn)

			.then(function (authData) {
				$scope.userId = authData.uid;
				$scope.users.$save()
			})

			.then($("#signupModal").modal('hide'))

			.catch(function (error) {
				console.error("Error: ", error);
			});
	}
	
	//Sign In
	$scope.signIn = function () {
		$scope.logIn().then(function (authData) {
			$scope.userId = authData.uid;
		})
	}
	
	//Log In
	$scope.logIn = function () {
		return $scope.authObj.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		})
	}
	
	//Log Out
	$scope.logOut = function () {
		$scope.authObj.$unauth()
		$scope.userId = false
	}
	
	//Get Tracks From Query
	$scope.searchTracks = function () {
		$http.get(baseUrl + $scope.track).success(function (response) {
			trackQueryData = $scope.queryTracks = response.tracks.items

		})
	}
	
	//Play Track
	$scope.preview = function (song, id) {
		if ($scope.currentSong == song) {
			$scope.audioObject.pause()

			$("#" + id).html('<i class="fa fa-play-circle"></i>')

			$scope.currentSong = false
			return
		}
		else {
			if ($scope.audioObject.pause != undefined) $scope.audioObject.pause()

			if (currentPreview != id) {
				$("#" + currentPreview).html('<i class="fa fa-play-circle"></i>')
			}

			$("#" + id).html('<i class="fa fa-stop"></i>')

			currentPreview = id

			$scope.audioObject = new Audio(song);
			$scope.audioObject.play()
			$scope.currentSong = song
		}
	}
	
	//Add Track To Playlist
	$scope.addTrack = function (id, name, artist, duration, preview_url) {
		$scope.playlist.$add({
			id: id,
			name: name,
			artist: artist,
			duration: duration,
			preview_url: preview_url,
			upvotes: 0
		})

			.then(function () {
				console.log("Added " + name + " by " + artist);
			})
	}

	$scope.previewPlaylistTrack = function (id) {
		var previewURL = 'https://embed.spotify.com/?uri=spotify:track:' + id;

		var iFrame = $("<iframe width='300' height='300' frameborder='0' allowtransparency='true'></iframe>");

		iFrame.attr('src', previewURL);

		$('#previewPlaylistWrapper').html(iFrame);
	}
	
	//Play Track From Playlist
	$scope.playTrack = function (id, name, artist, image_url, preview_url) {
		if ($scope.currentTrackPlaying == song) {
			$scope.currentTrackAudio.pause()

		}
		else {
			if ($scope.audioObject.pause != undefined) $scope.audioObject.pause()
			$("#" + currentPreview).html('<i class="fa fa-play-circle"></i>')

			$scope.currentTrackAudio = new Audio(preview_url);
			$scope.currentTrackAudio.play();
			$scope.currentTrackPlaying = preview_url;
		}
	}
	
	//Upvote A Track
	$scope.upvote = function (id) {
		var tempTrackRef = tracksRef.child(id);
		var queryRef = tempTrackRef.child('upvotes');

		if (queryRef != null) {
			queryRef.transaction(function (upvoteNumber) {
				return upvoteNumber + 1;
			},
				function (error, committed, snapshot) {
					if (error) {
						alert("Upvote transaction failed abnormally!");
					}
					else if (!committed) {
						alert("Upvote transaction aborted!");
					}
					else {
						console.log("Upvote transaction committed");
					}
				}
				);
		}
		else {
			alert("Accessing Upvote Ref Failed!");
		}
	}

});

$('body').tooltip({
	selector: '[title]'
});