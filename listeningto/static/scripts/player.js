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
          $('.startTime').text(convertTime((event.jPlayer.status.currentTime)));
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

  var progress = {
    soundcloud: '',
    youtube: ''
  };

  //progress bar youtube
  $('.progress-bar').slider({
      animate: 'fast',
      max: 100,
      range: 'min',
      step: 0.1,
      value : 0,
      slide: function(event, ui) {

          progress.youtube = (ui.value/100) * yt_player_1.getDuration();
          yt_player_1.seekTo(progress.youtube, true);

          $("#jplayer_sc").bind($.jPlayer.event.timeupdate, function(event) {
            progress.soundcloud = (event.jPlayer.status.seekPercent);
          });

          if(currentPlaying && (progress.youtube > 0 || progress.soundcloud > 0)) {
            setProgress(currentPlaying, progress, ui);
          }
          else {
            // Create a timeout to reset this slider to zero.
            setTimeout(function() {
               $( ".progress" ).slider("value", 0);
              }, 0);
          }
        }
    });
});

function setProgress(type, progress, ui) {
  if(type === 'soundcloud') {
    $('#jplayer_sc').jPlayer("playHead", ui.value * (100 / progress.soundcloud));
  }

  if(type === 'youtube') {
    yt_player_1.seekTo(progress.youtube,true);
  }
};

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
          $( ".endTime" ).text(convertTime(yt_player_1.getDuration()));
          setInterval("progressBar()",100);
          setInterval("songTimeYT()",1000);

        break;

        default:
          // do nothing
    }

}

function progressBar(){
  if(currentPlaying === 'youtube') {
    $( ".progress-bar" ).slider("value" ,yt_player_1.getCurrentTime()/yt_player_1.getDuration()*100);
  }
}

function songTimeYT(){
  if(currentPlaying === 'youtube') {
    $( ".startTime" ).text(convertTime(yt_player_1.getCurrentTime()));
  }
}

function convertTime(seconds) {
  var timeString = '';
  var hours = 0;
  var mins = Math.round(seconds / 60);
  var secs = Math.round((seconds / 60 % 1) * 60);

  if (mins > 60) {
    hours = mins / 60;
    mins = (hours / 60 % 1) * 60;
    secs = (mins / 60 % 1) * 60;
    return Math.round(hours) + ':' + Math.round(mins) + ':' + Math.round(secs);
  }

  if (hours > 0 && hours < 10) { timeString += "0" + hours + ':'; }
  if (hours >= 10) { timeString += hours + ':'; }

  timeString += (mins < 10) ? '0' + mins + ':' : mins + ':'
  timeString += (secs < 10) ? '0' + secs : secs

  return timeString
}

function loadYoutube(id) {
  console.log('Youtube loading video...', id);

  yt_player_1.loadVideoById(id);

  $('.pause').show();
  $('.play').hide();
}

function loadSoundcloud(id){

  console.log('Sound cloud setting up');
  $("#jplayer_sc").jPlayer("setMedia", {mp3: "http://api.soundcloud.com/tracks/" +  id + "/stream?client_id=ad504f994ee6c4b53cfb47aec786f595"});
  $("#jplayer_sc").jPlayer('play');

  $("#jplayer_sc").bind($.jPlayer.event.timeupdate, function(event) {
    duration = convertTime(event.jPlayer.status.duration);

    $( ".endTime" ).text(duration);
  });
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

