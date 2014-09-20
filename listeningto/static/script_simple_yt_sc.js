var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var media = [
  {
    id: 1,
    url: 'http://api.soundcloud.com/tracks/72186759/stream?client_id=4ead13387d69695b62b1168c307f222d',
    type: 'soundcloud'
  },
  {
    id: 2,
    url: 'i4VeO9PGppA',
    type: 'youtube'
  },
  {
    id: 3,
    url: 'https://api.soundcloud.com/tracks/166038167/stream?client_id=4ead13387d69695b62b1168c307f222d',
    type: 'soundcloud'
  },
  {
    id: 4,
    url: 'r0bS-YnLf4s',
    type: 'youtube'
  },
  {
    id: 5,
    url: 'https://api.soundcloud.com/tracks/148655100/stream?client_id=4ead13387d69695b62b1168c307f222d',
    type: 'soundcloud'
  }
];

$(document).ready(function(){
  var player = $("#jplayer_sc").jPlayer({
        swfPath: "/static/jQuery.jPlayer.2.7.0/Jplayer.swf",
        supplied: "mp3"
    });


	//play youtube
	$('.play').click(function(){
		console.log('playing', currentPlaying);

		if(currentPlaying.type === 'youtube') { yt_player_1.playVideo(); }
    else { $("#jplayer_sc").jPlayer("play"); }
	})

	//pause youtube
	$('.stop').click(function(){
		console.log('stopping', currentPlaying);

    if(currentPlaying.type === 'youtube') { yt_player_1.stopVideo(); }
    else { $("#jplayer_sc").jPlayer("pause"); }

	})

  $.each(media, function(index, item) {
    $('.media-list').append('<li><a onClick=loadItem(' + item.id + ')>' + item.url + ' (' + item.type + ') </a></li>');
  });

});

function loadItem(id) {
  // stop currently playing songs
  $("#jplayer_sc").jPlayer('stop');
  yt_player_1.stopVideo();

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