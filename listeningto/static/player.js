var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var currentPlaying = {};

$(document).ready(function(){
  var player = $("#jplayer_sc").jPlayer({
        swfPath: "/static/jQuery.jPlayer.2.7.0/Jplayer.swf",
        supplied: "mp3"
    });

  $("#jplayer_sc").bind($.jPlayer.event.play, function(event) {
    console.log('status: ' + event.jPlayer.status);
  });

  // Initialize SoundCloud API

  SC.initialize({
  client_id: 'ad504f994ee6c4b53cfb47aec786f595'
  });

	//play youtube
	$('.play').click(function(){

    // if no object loaded, load first file
    // if(jQuery.isEmptyObject(currentPlaying)) {
    //   loadItem(media[0].id);
    // }

    console.log('playing', currentPlaying);

    // handle appropriate player

		if(currentPlaying === 'youtube') { yt_player_1.playVideo(); }
    else { $("#jplayer_sc").jPlayer("play"); }
	})

	$('.stop').click(function(){
		console.log('stopping', currentPlaying);

    if(currentPlaying === 'youtube') { yt_player_1.stopVideo(); }
    else { $("#jplayer_sc").jPlayer("pause"); }

	})
});


function loadItem(type, id) {
  // stop currently playing songs
  console.log(type)
  stopAllPlayers();

  // load new song

  currentPlaying = type;
  // console.log(currentPlaying);

  if(type === 'youtube') {
    loadYoutube(id);
  }

  if(type === 'soundcloud') {
    loadSoundcloud(id);
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

function loadYoutube(id) {
  console.log('Youtube loading video...', id);

  yt_player_1.loadVideoById(id);
}

function loadSoundcloud(id){
  console.log('Sound cloud setting up');
  $("#jplayer_sc").jPlayer("setMedia", {mp3: "http://api.soundcloud.com/tracks/" +  id + "/stream?client_id=ad504f994ee6c4b53cfb47aec786f595"});
  $("#jplayer_sc").jPlayer('play');
}

function saveSong() {
  console.log('trying to add song...');
  var song_url = document.getElementById("song_url").value;
  getSongInfo(song_url);
}

function getSongInfo(song_url){
    var url = String(song_url);
    console.log('getting info...', song_url);

    //identify if youtube or soundcloud
    if(song_url.toLowerCase().indexOf("youtube")>=0){

      var id = getURLParameter(url, 'v' )

      $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+id+'?v=2&alt=jsonc',function(data,status,xhr){

        domEl = "<li ><a href='#' onClick=loadItem('youtube','" + id + "')>" + data.data.title + "</a></li>"
        $('#playlist').append(domEl);
        var track_info = "track_type=youtube" + "&track_url="  + url + "&track_name=" +data.data.title + "&track_id=" +id+ "&track_artwork_url="+ data.data.thumbnail.sqDefault + "&stream_url=''";
        console.log(track_info)
        saveToDB(track_info);
      });

   }

    if(song_url.toLowerCase().indexOf("soundcloud")>=0){
      //get soundcloud song info and add to db

      console.log("saving as soundcloud")

      SC.get('/resolve', {url: song_url}, function(track) {

      domEl = "<li ><a href='#' onClick=loadItem('soundcloud','" + track.id + "')>" + track.title + "</a></li>"
      $('#playlist').append(domEl);

      var track_info = "track_type=soundcloud" + "&track_url=" + track.permalink_url+ "&track_name=" +track.title + "&track_id=" +track.id+ "&stream_url=" + track.stream_url + "&track_artwork_url="+track.artwork_url ;
      console.log(track_info)
      saveToDB(track_info);
      });
    }
}

function saveToDB(track_info) {
    console.log('saving...', track_info);

    $('#song_url').val('');

    $.ajax({url: "/listeningto/addsong?" + track_info ,async:true}).done(function(response){
        console.log('new songs: ', response);
    });
}

function getURLParameter(url,name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null
}
