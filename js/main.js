var trackQueryData;
var currentPreview;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&limit=10&market=US&query=';
var myApp = angular.module('myApp', []);

var mainCtrl = myApp.controller('mainCtrl', function ($scope, $http) {
	$scope.audioObject = {}
	
	//Get Tracks From Query
	$scope.searchTracks = function () {
		$http.get(baseUrl + $scope.track).success(function (response) {
			trackQueryData = $scope.queryTracks = response.tracks.items

		})
	}
	
	//Play Track
	$scope.play = function (song, id) {
		if ($scope.currentSong == song) {
			$scope.audioObject.pause()
			
			$("#" + id).html('<i class="fa fa-play-circle"></i>')
			
			$scope.currentSong = false
			return
		}
		else {
			if($scope.audioObject.pause != undefined) $scope.audioObject.pause()

			if(currentPreview != id) {
				$("#" + currentPreview).html('<i class="fa fa-play-circle"></i>')
			}

			$("#" + id).html('<i class="fa fa-stop"></i>')
			
			currentPreview = id
			
			$scope.audioObject = new Audio(song);
			$scope.audioObject.play()
			$scope.currentSong = song
		}
	}

});

$('body').tooltip({
	selector: '[title]'
});

//OLDER

/*

$("#queryButton").on('click', function (e) {
	e.preventDefault();

	getResults();
});

var getResults = function () {
	var data;

	var query = $("#queryInput").val();
	$.ajax({
		url: 'https://api.spotify.com/v1/search',
		type: "GET",
		dataType: "json",
		data: {
			q: query,
			type: 'track',
			market: 'US',
			limit: '10'
		},
		success: function (data1) {
			data = data1;
			loadResults(data);
		}
	});
};

var loadResults = function (data) {
	console.log(data);

	var result = JSON.parse(data);

	var tracks = result.tracks;
	var items = tracks.items;

	$.each(items, function (key, value) {
		console.log(value.name);
	});

};

*/