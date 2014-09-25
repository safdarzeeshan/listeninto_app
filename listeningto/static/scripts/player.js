var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var currentPlaying = '';
var progresspercentage = 0

$(document).ready(function(){

   var player = $("#jplayer_sc").jPlayer({
        swfPath: "/static/jQuery.jPlayer.2.7.0/Jplayer.swf",
        supplied: "mp3",
        timeupdate: function(event) {
          $( ".progress-bar" ).slider("value", event.jPlayer.status.currentPercentAbsolute);
        },
        playing: function(event) {
          $('.pause').show();
          $('.play').hide();
        }
    });


    // Initialize SoundCloud API

    SC.initialize({
        client_id: 'ad504f994ee6c4b53cfb47aec786f595'
      });

  $('.pause').hide();

	//play 
	$('.play').click(function(){
    // if no object loaded, load first file
    if(jQuery.isEmptyObject(currentPlaying)) {
      $('#playlist li:first a').trigger('click');
    }

		if(currentPlaying === 'youtube') {
      yt_player_1.playVideo();
      $('.pause').show();
      $('.play').hide();
    }
    else { $("#jplayer_sc").jPlayer("play"); }
	})

	$('.stop').click(function(){
    $('.play').show();
    $('.pause').hide();

    if(currentPlaying === 'youtube') {
      yt_player_1.stopVideo();
    }
    else {
      $("#jplayer_sc").jPlayer("stop");
    }
	})

  $('.pause').click(function() {

    if(currentPlaying === 'youtube') {
      yt_player_1.pauseVideo();
    }
    else {
      $("#jplayer_sc").jPlayer("pause");
    }
    $('.pause').hide();
    $('.play').show();
  });

  var seekProgressYT = 0;
  var seekProgressSC = 0;

  //progress bar youtube  
  $('.progress-bar').slider({
      animate: 'fast',
      max: 100,
      range: 'min',
      step: 0.1,
      value : 0,
      slide: function(event, ui) {

          seekProgressYT = (ui.value/100) * yt_player_1.getDuration();
          yt_player_1.seekTo(seekProgressYT,true);

          $("#jplayer_sc").bind($.jPlayer.event.timeupdate, function(event) {
          seekProgressSC = (event.jPlayer.status.seekPercent);
          })

          if((seekProgressSC >0) || (seekProgressYT > 0)) {
            // Move the play-head to the value and factor in the seek percent.
            $('#jplayer_sc').jPlayer("playHead", ui.value * (100 / seekProgressSC));
            yt_player_1.seekTo(seekProgressYT,true);
          } 
          else {
            // Create a timeout to reset this slider to zero.
            setTimeout(function() { 
               $( ".progress" ).slider("value", 0);
              }, 0);
          }

        }
    });
})  

function loadItem(type, id) {
  // stop currently playing songs
  stopAllPlayers();

  // load new song

  currentPlaying = type;

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

  $( ".duration" ).html(0)
  $( ".time" ).html(0)


  $('.pause').hide();
  $('.play').show();

}

function onYouTubeIframeAPIReady(){
    yt_player_1 = new YT.Player('yt_player_1', {
    height: '0',
    width: '960',
    events:{
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(state){
    switch(state.data){
        case 1: // playing
         $( ".durationYT" ).html(yt_player_1.getDuration())
         setInterval("progressBar()",100);
         setInterval("songTimeYT()",1000);

        break;

        default:
        // do nothing
    }

}

function progressBar(){

  $( ".progress-bar" ).slider("value" ,yt_player_1.getCurrentTime()/yt_player_1.getDuration()*100);

}

function songTimeYT(){

  $( ".timeYT" ).text(yt_player_1.getCurrentTime())
}

function loadYoutube(id) {
  console.log('Youtube loading video...', id);

  yt_player_1.loadVideoById(id);
  // $( ".duration" ).html(yt_player_1.getDuration())
  $('.pause').show();
  $('.play').hide();
}

function loadSoundcloud(id){

  console.log('Sound cloud setting up');
  $("#jplayer_sc").jPlayer("setMedia", {mp3: "http://api.soundcloud.com/tracks/" +  id + "/stream?client_id=ad504f994ee6c4b53cfb47aec786f595"});
  $("#jplayer_sc").jPlayer('play');

  $("#jplayer_sc").bind($.jPlayer.event.timeupdate, function(event) {
  duration = (event.jPlayer.status.duration);
  $( ".durationSC" ).html(duration)
  })

  setInterval("songTimeSC()",1000);
}

function songTimeSC(){

  $("#jplayer_sc").bind($.jPlayer.event.timeupdate, function(event) {
      currentTime = (event.jPlayer.status.currentTime);
      $( ".timeSC" ).html(currentTime)
  })
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

