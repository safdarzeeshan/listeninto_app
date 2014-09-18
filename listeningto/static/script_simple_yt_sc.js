var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$(document).ready(function(){

	//play youtube
	$('.play').click(function(){
		console.log('playing for youtube');

		yt_player_1.playVideo();		
	})

	//pause youtube
	$('.stop').click(function(){
		console.log('stopping for youtube');

		yt_player_1.stopVideo();
	
	})

})

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

function loadSound(){
  console.log('Sound cloud setting up');
  var player = $("#jplayer_sc").jPlayer({
    ready: function() {
      this.element.jPlayer("setFile", "http://api.soundcloud.com/tracks/72186759/stream?client_id=4ead13387d69695b62b1168c307f222d").jPlayer("play");
    }
  });
}