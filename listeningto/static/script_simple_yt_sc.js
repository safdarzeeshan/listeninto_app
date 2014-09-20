var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var currentPlaying = {};

var media = [
  {
    id: 1,
    url: 'http://api.soundcloud.com/tracks/72186759/stream?client_id=4ead13387d69695b62b1168c307f222d',
    type: 'soundcloud',
    name: 'Zeeshan Dev Demo'
  },
  {
    id: 2,
    url: 'i4VeO9PGppA',
    type: 'youtube',
    name: 'Night Terrors of 1927 - No One to Complain'
  },
  {
    id: 3,
    url: 'https://api.soundcloud.com/tracks/166038167/stream?client_id=4ead13387d69695b62b1168c307f222d',
    type: 'soundcloud',
    name: 'jamie xx - All Under One Roof Raving'
  },
  {
    id: 4,
    url: 'r0bS-YnLf4s',
    type: 'youtube',
    name: 'Flight Facilities - Crave You'
  },
  {
    id: 5,
    url: 'https://api.soundcloud.com/tracks/148655100/stream?client_id=4ead13387d69695b62b1168c307f222d',
    type: 'soundcloud',
    name: 'Fink - Looking too Closely'
  }
];

$(document).ready(function(){
  var player = $("#jplayer_sc").jPlayer({
        swfPath: "/static/jQuery.jPlayer.2.7.0/Jplayer.swf",
        supplied: "mp3"
    });


	//play youtube
	$('.play').click(function(){

    // if no object loaded, load first file
    if(jQuery.isEmptyObject(currentPlaying)) {
      loadItem(media[0].id);
    }

    console.log('playing', currentPlaying);

    // handle appropriate player

		if(currentPlaying.type === 'youtube') { yt_player_1.playVideo(); }
    else { $("#jplayer_sc").jPlayer("play"); }
	})

	$('.stop').click(function(){
		console.log('stopping', currentPlaying);

    if(currentPlaying.type === 'youtube') { yt_player_1.stopVideo(); }
    else { $("#jplayer_sc").jPlayer("pause"); }

	})

  $.each(media, function(index, item) {
    $('.media-list').append('<li><a onClick=loadItem(' + item.id + ')>' + item.name + ' (' + item.type + ') </a></li>');
  });

});

function loadItem(id) {
  // stop currently playing songs
  stopAllPlayers();

  // load new song

  var song = $.grep(media, function(item, index) {
    return (item.id === parseInt(id));
  })[0];

  currentPlaying = song;
  console.log(currentPlaying);

  if(currentPlaying.type === 'youtube') {
    loadVideo(currentPlaying.url);
  }
  else {
    loadSound(currentPlaying.url);
  }
}

function stopAllPlayers() {
  $("#jplayer_sc").jPlayer('stop');
  yt_player_1.stopVideo();
}

function onYouTubeIframeAPIReady(){
  yt_player_1 = new YT.Player('yt_player_1', {
    height: '0',
    width: '960',
  });
}

function loadVideo(id) {
  console.log('Youtube loading video...', id);
  yt_player_1.loadVideoById(id);
}

function loadSound(url){
  console.log('Sound cloud setting up');
  $("#jplayer_sc").jPlayer("setFile", url);
  $("#jplayer_sc").jPlayer('play');

  // var player = $("#jplayer_sc").jPlayer({
  //   ready: function() {
  //     this.element.jPlayer("setMedia", { mp3: url}).jPlayer("play");
  //   }
  // });
}