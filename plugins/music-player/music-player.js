
function music_player() {
	var allTracks = [],		// An array for all the files loaded in the track
		playlist = [], 		// An array for the current playlist
		temporarySearchPlaylist = [],	// A helper array for when we are searching
		i = 0, 				// The number of the current track
		shuffle = false,	// Shuffle flag
		repeat = 0,			// Repeat flag
		lastPlayed = [],	// Array for last played (used when shuffling songs)
		timer = 0;			// An interval for the track's current time.


	startPlayerWhenReady();


	/*---------------------
		Dropping files
	----------------------*/

	var dropZone = $('#drop-zone'),
		searchInput = $('#searchBox');

	$(document).on('dragover', function(event) {
		event.stopPropagation();
		event.preventDefault();

		dropZone.removeClass('hidden');
	});

	dropZone.on('dragleave', function(event) {
		event.stopPropagation();
		event.preventDefault();

		dropZone.addClass('hidden');
	});

	dropZone.on('dragover', function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.originalEvent.dataTransfer.dropEffect = 'copy';
	});

	// Get file data on drop
	dropZone.on('drop', function(e) {
		e.stopPropagation();
		e.preventDefault();


		if(e.originalEvent.dataTransfer.items){
			// For chrome users folder upload is supported

			var items = e.originalEvent.dataTransfer.items;
			for(var j=0; j<items.length; j++){
				var item = items[j].webkitGetAsEntry();
				if(item){
					traverseFileTree(item);
				}
			}
		}
		else{
			// Other browser users have to upload files directly

			var files = e.originalEvent.dataTransfer.files;

			for(var j=0; j<files.length; j++){
				if(files[j].type.match(/audio\/(mp3|mpeg)/)){

					getID3Data(files[j], function (song) {
						allTracks.push(song);
						playlist.push(song);
						$('#list').append($(returnTrackHTML(song, playlist.length-1)));
					});
				}
			}
		}

		// If new files are added to existing playlist, cancel search.
		if(allTracks.length){
			searchInput.val('');
			searchInput.trigger('input');
			temporarySearchPlaylist = [];
		}

		dropZone.addClass('hidden');
	});

	// Recursively get files from folder (works only in chrome).
	function traverseFileTree(item,path) {
		path = path || "";
		if(item.isFile){
			item.file(function(file){
				if(file.type.match(/audio\/mp3/)){
					getID3Data(file, function (song) {
						allTracks.push(song);
						playlist.push(song);
						$('#list').append($(returnTrackHTML(song,playlist.length-1)));
					});
				}
			})
		}
		else if(item.isDirectory){
			var dirReader = item.createReader();
			dirReader.readEntries(function (entries) {
				for(var j=0; j<entries.length; j++){
					traverseFileTree(entries[j], path + item.name + "/");
				}
			})
		}
	}

	// Generate an object with all the needed information about a track.
	function getID3Data(file, done) {

		getTags(file,function(result){

			result.audioTrack = file;
			result.playing = false;
			done(result);

		});
	}

	// Get ID3 data tags from file.
	function getTags(file,done){

		var result = {};

		ID3.loadTags(file.name, function() {

			var tags = ID3.getAllTags(file.name);

			result.artist = tags.artist || "Unknown Artist";
			result.title = tags.title || "Unknown";
			result.album = tags.album || "";
			if(tags.picture && tags.picture.data && tags.picture.data.length) {
				result.picture = tags.picture;
				getImageSource(result.picture, function (imageSource) {
					result.picture = imageSource;
					done(result);
				});
			}
			else {
				result.picture = 'img/default.png';
				done(result);
			}


		}, {
			tags: ["artist", "title", "album", "picture"],
			dataReader: FileAPIReader(file)
		});

	}

	function getImageSource(image, done) {
		var base64String = "";
		for (var j = 0; j < image.data.length; j++) {
			base64String += String.fromCharCode(image.data[j]);
		}
		done("data:" + image.format + ";base64," + window.btoa(base64String));
	}


	function readFile(file,done) {

		var reader = new FileReader();

		reader.onload = function(data){
			done(data);
		};

		reader.readAsDataURL(file);
	}


	/*-------------------
		Audio player.
	 ------------------*/


	var wavesurfer = Object.create(WaveSurfer);

	wavesurfer.init({
		container: document.querySelector('#wave'),
		cursorColor: '#aaa',
		cursorWidth: 1,
		height: 80,
		waveColor: '#EEEEEE',
		progressColor: '#ffb74d'
	});


	// Read file and play it.
	// Takes one parameter - the index of the track we want to play.
	function playTrack(number){

		if(playlist[number] && playlist[i]) {

			lastPlayed.push(number);

			var file = playlist[i].audioTrack,
				result = {};


			readFile(file, function(result){
				result = file;
				wavesurfer.loadBlob(result);
			});

		}
		// If something went wrong stop playback.
		else{
			wavesurfer.stop();
		}

	}


	// An event handler for when a track is loaded and ready to play.
	wavesurfer.on('ready', function () {

		// Play the track.
		wavesurfer.play();

		var duration = wavesurfer.getDuration();

		if(playlist[i]){
			document.title = playlist[i].artist + ' - ' + playlist[i].title;

			// Set cover art.

			if(playlist[i].picture == 'img/default.png'){
				$('#cover-art-big').css("background", "");
			}
			else{
				$('#cover-art-big').css("background-image", "url("+ playlist[i].picture +")").css("background-repeat", "no-repeat").css("background-position", "center");
			}

			$('#cover-art-small').attr('src', playlist[i].picture);

			// Show the artist and title.
			$('#track-desc').html('<b>' + playlist[i].title + '</b> by ' + playlist[i].artist);

			// Show duration of track.
			$('#current').text('0:00');
			$('#total').text(formatTime(duration));

			// Show the progress of the track in time.
			clearInterval(timer);
			timer = setInterval(function() {
				$('#current').text(formatTime(wavesurfer.getCurrentTime()));
			}, 1000);

			// In the playlist array mark the track as currently playing
			allTracks.forEach(function (tr) {
				tr.playing = false;
			});
			playlist[i].playing = true;


			if(temporarySearchPlaylist.length){
				// If there is a search going on, trigger it again to highlight the right track
				renderTrackList(temporarySearchPlaylist);
			}
			else{
				// If there isn't a search simply highlight the according element from the .track array
				$('.track').removeClass('active').eq(i).addClass('active');
			}
		}

	});

	// Event handler when a track finishes playing
	wavesurfer.on('finish', function () {
		// In case shuffle is on.
		if (shuffle){
			if (repeat == 2) {
				if (playlist[i]) {
					playTrack(i);
				}
			}
			else if (playlist.length > 1) {
				var temp = i;
				while (i == temp) {
					i = Math.floor(Math.random() * playlist.length);
				}
				if(playlist[i]) {
					playTrack(i);
				}
			}
		}
		// In case shuffle is off.
		else {
			if (!repeat) {
				if (i >= playlist.length - 1) {
					wavesurfer.stop();
				}
				else {
					i++;
					playTrack(i);
				}
			}
			else if (repeat == 1) {
				if (i >= playlist.length - 1) {
					i = 0;
				}
				else {
					i++;
				}
				playTrack(i);
			}
			else if (repeat == 2) {
				if (playlist[i]) {
					playTrack(i);
				}
			}
		}

	});


	wavesurfer.on('seek', function () {
		$('#current').text(formatTime(wavesurfer.getCurrentTime()));
	});


	/*---------------------
		Player controls
	----------------------*/

	// Pressing the 'next' button
	// Plays next track in playlist, or if shuffle is on random track.
	$('#next-button').on('click', function () {

		if (!shuffle) {
			i++;
			if (i > playlist.length - 1) {
				i = 0;
			}
		}
		else {
			if (playlist.length > 1) {
				var temp = i;
				while (i == temp) {
					i = Math.floor(Math.random() * playlist.length);
				}
			}
		}

		if(playlist[i]) {
			playTrack(i);
		}

	});

	// Pressing the 'previous' button.
	// If shuffle is off plays previous song from playlist
	// If shuffle is on takes song from lastPlayed to keep order.
	$('#previous-button').on('click', function () {

		if(!shuffle){
			if(i==0){
				i=playlist.length-1;
			}
			else{
				i--;
			}
		}
		else{
			lastPlayed.pop();
			i = lastPlayed.pop();
		}

		if(i==undefined || i<0){
			i = 0;
		}

		playTrack(i);

	});

	$('#play-button').on('click', function(){
		wavesurfer.play();
	});

	$('#pause-button').on('click', function () {
		wavesurfer.playPause();
	});

	$('#stop-button').on('click', function(){
		wavesurfer.stop();
	});

	// Turn shuffle on and off.
	$('#shuffle-button').on('click', function(){
		var that = $(this);

		if(that.hasClass('active')){
			that.removeClass('active');
			that.attr('title', 'Shuffle Off');
			shuffle = false;
		}
		else{
			that.addClass('active');
			that.attr('title', 'Shuffle On');
			shuffle = true;
		}
	});

	// repeat = 0 Repeat is off - when the playlist reaches it's end it will stop
	// repeat = 1 Repeat all - when the playlist reaches it's end it will start from begining
	// repeat = 2 Repeat Current - repeat track
	$('#repeat-button').on('click', function(){

		var that = $(this);

		if(repeat==0){
			that.addClass('active');
			that.attr('title', 'Repeat All');
			repeat = 1;
		}

		else if(repeat==1){
			that.find('span').show();
			that.attr('title', 'Repeat Current');
			repeat = 2;
		}

		else if(repeat==2){
			that.find('span').hide();
			that.removeClass('active');
			that.attr('title', 'Repeat Off');
			repeat = 0;
		}

	});


	/*----------------------
		Playlist navigation
	----------------------*/

	// Opening and closing the playlist.
	$('#track-details').on('click', function () {
		var expandBar = $('#expand-bar');

		if(expandBar.hasClass('hidden')){
			expandBar.removeClass('hidden');
			$(this).attr('title', 'Hide Playlist');
		}
		else{
			expandBar.addClass('hidden');
			$(this).attr('title', 'Show Playlist');
		}
	});

	$('#playlist').on('click', function (e) {

		// Get the index of the clicked track.

		var target = $(e.target),
			index = target.closest('.track').data('index');

		if(index!=undefined){

			// Selecting Tracks
			if(!target.hasClass('remove-track')){


				// If there was a search made, create a new playlist from the search results.
				if(temporarySearchPlaylist.length){
					playlist = temporarySearchPlaylist.slice(0);
					temporarySearchPlaylist = [];
					lastPlayed = [];
				}

				// Play the newly selected track and set it as currently playing (i).
				i = index;

				playTrack(i);

			}
			// Deleting Tracks
			else{

				var position,
					track;

				// If a track is removed while searching.
				if(temporarySearchPlaylist.length) {
					track = temporarySearchPlaylist[index];
				}
				// If a track is removed from normal playback.
				else {
					track = playlist[index];
				}

				// Remove from allTracks
				position = allTracks.indexOf(track);

				if(position != -1) {
					allTracks.splice(position, 1);
				}

				// Remove from playlist.
				position = playlist.indexOf(track);

				if(position != -1) {
					playlist.splice(position, 1);
				}

				// If we have deleted the currently playing track play next / first
				if (track.playing) {
					if (i >= playlist.length) {
						i = 0;
					}

					playTrack(i);
				}

				// Trigger search to render the new playlist.
				searchInput.trigger('input');

				if(!playlist.length){
					// Playlist is empty - try to generate new playlist from the allTracks array.
					if(allTracks.length){
						playlist = allTracks.slice(0);
						renderTrackList(playlist);
						i = 0;
						playTrack(i);
					}
					// Playlist is empty, allTracks is empty - deactivate player.
					else{
						wavesurfer.empty();
						clearInterval(timer);
						$('#cover-art-big').css("background", "");
						$('#cover-art-small').attr('src', 'img/default.png');
						$('#expand-bar').addClass('hidden');
						$('#track-desc').html('There are no tracks loaded in the player.');
						$('#current').text('-');
						$('#total').text('-');
						$('#container').addClass('disabled');

						startPlayerWhenReady()
					}
				}

			}
		}

	});

	// Close playlist when clicked on cover art.
	$('#container').on('click', function (e) {
		if(e.target==this){
			$('#expand-bar').addClass('hidden');
		}
	});



	/*----------------------
		Search functionality
	-----------------------*/

	var clearSearchDelay;

	searchInput.on('keydown', function (e) {

		if(e.keyCode == 27){
			$(this).val('');
			$(this).trigger('input');
		}
		else if(e.keyCode == 13) {

			e.preventDefault();

			if ($(this).val().trim().length) {

				var searchString = $(this).val().trim();
				searchTracks(searchString);
				clearTimeout(clearSearchDelay);

			}
		}

	});

	searchInput.on('input', function(e){
		e.preventDefault();
		var searchStr = $(this).val().trim();

		clearTimeout(clearSearchDelay);

		if(!searchStr.length) {
			searchInput.val('');

			searchTracks();
		}
		else {

			clearSearchDelay = setTimeout(function() {
				if (searchStr.length) {
					searchTracks(searchStr);
				}
			},700);
		}
	});

	function searchTracks(query){

		query = query || "";
		query = query.toLowerCase();

		temporarySearchPlaylist = allTracks.slice(0);

		if(query.length){
			temporarySearchPlaylist = temporarySearchPlaylist.filter(function (tr) {
				if(tr.artist.toLowerCase().indexOf(query) != -1 || tr.title.toLowerCase().indexOf(query) != -1 || tr.album.toLowerCase().indexOf(query) != -1){
					return tr;
				}
			});
		}

		// Render the newly created search results list.
		renderTrackList(temporarySearchPlaylist);

	}


	/*-------------------
	 	Helper Functions
	--------------------*/

	//Automatically start playlist on file load.
	function startPlayerWhenReady(){


		var interval = setInterval(function () {
			if(playlist[0]){
				playTrack(0);
				$('#container').removeClass('disabled');
				clearInterval(interval);
			}
		},200);
	}


	// Creates html for a track in the playlist.
	function returnTrackHTML(song, index){

		var html = '<li class="track';

		if(song.playing){
			html+= ' active'
		}

		html+='" data-index="'+ index +'">' +
		'<div>' +
		'<span class="overlay"><i class="fa fa-play"></i></span>' +
		'<img src="' + song.picture + '"/>' +
		'</div>' +
		'<div>'	+
		'<p class="title">' + song.title + '</p>' +
		'<p class="artist">' + song.artist + '</p>' +
		'<span title="Remove Track From Player" class="remove-track">×</span>' +
		'</div>' +
		'</li>';

		return html;
	}


	// Write the contents of a playlist into the playlist tab in the html.
	function renderTrackList(list){
		$('.track').remove();

		var html = list.map(function (tr,index) {
			return returnTrackHTML(tr,index);
		}).join('');

		$('#list').append($(html));
	}


	// Format time in minutes:seconds
	function formatTime(time){
		time = Math.round(time);

		var minutes = Math.floor(time / 60),
			seconds = time - minutes * 60;

		seconds = seconds < 10 ? '0' + seconds : seconds;

		return minutes + ":" + seconds;
	}


	// Wavesurfer responsiveness
	$(window).on('resize', function(){
		if($('#wave').is(":visible")) {
			wavesurfer.drawer.containerWidth = wavesurfer.drawer.container.clientWidth;
			wavesurfer.drawBuffer();
		}
	});
}
