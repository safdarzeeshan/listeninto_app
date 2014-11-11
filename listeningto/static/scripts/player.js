var currentPlaying = {
  type : '',
  trackName:'',
  duration:'',
  songId:''
};

var progresspercentage = 0;

var recommend = {receipient : '',
 description:'',
 trackInfo: {
    track_type: '',
    track_url: '',
    track_name: '',
    track_id: '',
    stream_url: '',
    track_artwork_url: '',
 }
}


$(document).ready(function(){
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var yt_player_1;

    $('.recommend-to').hide();

    // empty error div
    $('.error').html('');

    var player = $('#jplayer_sc').jPlayer({
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
    if(currentPlaying.trackName === '') {

      $('#playlist li:first a').trigger('click');
    }

		if(currentPlaying.type === 'youtube') {
      yt_player_1.playVideo();
      $('.pause').show();
      $('.play').hide();
    }
    else { $("#jplayer_sc").jPlayer("play"); }
	})

	$('.stop').click(function(){
    $('.play').show();
    $('.pause').hide();

    stopAllPlayers();
	})

  $('.pause').click(function() {

    if(currentPlaying.type === 'youtube') {
      yt_player_1.pauseVideo();
    }
    else {
      $("#jplayer_sc").jPlayer("pause");
    }
    $('.pause').hide();
    $('.play').show();
  });

  //autopplay for next song - soundcloud song ended event
  $("#jplayer_sc").bind($.jPlayer.event.ended, function(event) {
    nextSong();
  });


  var progress = {
    soundcloud: '',
    youtube: ''
  };

  //progress bar
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

          if(currentPlaying.type && (progress.youtube > 0 || progress.soundcloud > 0)) {
            setProgress(currentPlaying.type, progress, ui);
          }
          else {
            // Create a timeout to reset this slider to zero.
            setTimeout(function() {
               $( ".progress" ).slider("value", 0);
              }, 0);
          }
        }
    });

  $('.play-song').click(function(event) {
    event.stopPropagation();
    console.log('loading...');
    var type = $(this).attr('song-type');
    var id = $(this).attr('song-id');
    loadItem(type, id);
  });

});

function setProgress(type, progress, ui) {
  if(type === 'soundcloud') {
    $('#jplayer_sc').jPlayer("playHead", ui.value * (100 / progress.soundcloud));
  }

  if(type === 'youtube') {
    yt_player_1.seekTo(progress.youtube,true);
  }type
};

function bullshit() {
  console.log('such BS');
}

function loadItem(type, id) {
  // stop currently playing songs
  stopAllPlayers();

  // load new song
  currentPlaying.trackName = $('#song_' + id)[0].children[0].textContent;
  currentPlaying.type = type;
  currentPlaying.songId = id;

  //set track name
  $( ".song-name" ).text(currentPlaying.trackName);

  if(currentPlaying.type === 'youtube') {
    loadYoutube(id);

  }

  if(currentPlaying.type === 'soundcloud') {
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

        case 0: //ended

          nextSong();
        case 1: // playing
          currentPlaying.duration = convertTime(yt_player_1.getDuration());
          $( ".endTime" ).text(currentPlaying.duration);
          setInterval("progressBar()",100);
          setInterval("songTimeYT()",1000);

        break;

        default:
          // do nothing
    }

}

function progressBar(){
  if(currentPlaying.type === 'youtube') {
    $( ".progress-bar" ).slider("value" ,yt_player_1.getCurrentTime()/yt_player_1.getDuration()*100);
  }
}

function songTimeYT(){
  if(currentPlaying.type === 'youtube') {
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

function deleteSong(id) {

  console.log('in delete')

  $.ajax({url: "/deletesong?trackid=" + id, async:true}).done(function(response){

      console.log("deleted" + id)
      $('#song_' + id).remove();
  });
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
    currentPlaying.duration = convertTime(event.jPlayer.status.duration);

    $( ".endTime" ).text(currentPlaying.duration);
  });
}

function nextSong() {
  console.log('in next song' + currentPlaying.songId);
  var currentId = '#song_' + currentPlaying.songId;
  $(currentId + ' + li > a').trigger('click');
}

function saveSong() {


  $('.error').html('');
  var song_url = document.getElementById("song_url").value;

  if (song_url.toLowerCase().indexOf("youtube") >= 0) {
    getSongInfo(song_url, 'youtube', false);
  }

  else if (song_url.toLowerCase().indexOf("soundcloud") >= 0) {
    getSongInfo(song_url, 'soundcloud', false);
  }

  // else {
  //   $('.error').text('Please enter a valid YouTube or SoundCloud song link.');
  //   $('#song_url').val('');
  // }
  else {
    console.log('searching')
    //search for song name
    search(song_url);
  }
}

function getSongInfo(song_url, type, save){
    var url = String(song_url);
    console.log('getting info...', song_url);
    var trackInfo = {};

    //identify if youtube or soundcloud
    if(song_url.toLowerCase().indexOf("youtube")>=0){

      var id = getURLParameter(url, 'v' )

      $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+id+'?v=2&alt=jsonc',function(data,status,xhr){

        trackInfo = {
          track_type: 'youtube',
          track_url: url,
          track_name: data.data.title,
          track_id: id,
          track_artwork_url: data.data.thumbnail.sqDefault,
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        };

        if (save) {
                  saveSongToDb(trackInfo);
           }

        else{
              console.log('here for youtube')
              displayInsertedUrl(trackInfo);

        }
        // return trackInfo;
      });


   }

    if(song_url.toLowerCase().indexOf("soundcloud")>=0){
      //get soundcloud song info and add to db

      console.log("saving as soundcloud")

      SC.get('/resolve', {url: song_url}, function(track) {

        trackInfo = {
          track_type: 'soundcloud',
          track_url: track.permalink_url,
          track_name: track.title,
          track_id: track.id,
          stream_url: track.stream_url,
          track_artwork_url: track.artwork_url,
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        };

        if (save) { saveSongToDb(trackInfo); }


        else{
              console.log('here for sc')
              displayInsertedUrl(trackInfo);

        }

        // return trackInfo;

      });

    }
}

function saveSongToDb(trackInfo) {
  console.log('saving...', trackInfo);
  $('#song_url').val('');

  var savingSong = $.post('addsong/', trackInfo);

  savingSong.done(function(data) {
    // domEl = "<li id='song_" + trackInfo.track_id+ "'><a href='#' onClick=loadItem('" + trackInfo.track_type + "','" + trackInfo.track_id + "')>" + trackInfo.track_name + "</a></li>";
    console.log('saved song');
    // $('#playlist').append(domEl);
  });
}

function displayInsertedUrl(trackInfo){

  console.log(trackInfo)

  $('#playlist').empty();

  if(trackInfo.track_type === 'youtube'){

    console.log('type is youtube')

    domEl = "<li id='song_" + trackInfo.track_id + "'><div class='song_name'><a href='#' onClick=loadItem('youtube','" + trackInfo.track_id +
        "')>" + trackInfo.track_name + "</a></div>" +
        "<div class = 'song_options'>" +
        "<a href='#' id='add-song' title = 'Add Song' onClick=getSongInfo('https://www.youtube.com/watch?v=" + trackInfo.track_id +
        "','youtube','true')>" +
        "<i class='fa fa-plus'></i></a>" +
        "<a href='#' href='#' id='play-song' title = 'Play Song' onClick=loadItem('youtube','" + trackInfo.track_id +"')>" +
        "<i class='fa fa-play'></i></a>" +
        "<a href='#' id='recommend-song' title = 'Recommend Song' onClick=saveAndRecommend('youtube'" + ","+"'https://www.youtube.com/watch?v="+ trackInfo.track_id +"','"+trackInfo.track_id+"','" + encodeURIComponent(trackInfo.track_title) + "','null','" +trackInfo.track_artwork_url  +"')>" +
        "<i class='fa fa-share'></i></a></div></li>";

    $('#playlist').append(domEl);
  }

  if(trackInfo.track_type === 'soundcloud'){
    console.log('type is soundcloud')

    domEl = "<li id='song_"+trackInfo.track_id+"'><div class='song_name'><a href='#' onClick=loadItem('soundcloud','" +
          trackInfo.track_id+  "')>" + trackInfo.track_name + "</a></div>" +
          "<div class = 'song_options'>" +
          "<a href='#' id='add-song' title = 'Add Song' onClick=getSongInfo('" + trackInfo.track_url +"','soundcloud','true')>" +
          "<i class='fa fa-plus'></i></a>" +
          "<a href='#' href='#' id='play-song' title = 'Play Song' onClick=loadItem('soundcloud','" + trackInfo.track_id+  "')>" +
          "<i class='fa fa-play'></i></a>" +
          "<a href='#' id='recommend-song' title = 'Recommend Song'  onClick=saveAndRecommend('soundcloud'" + ",'"+ trackInfo.track_url +
          "','"+trackInfo.track_id+"','"+ encodeURIComponent(trackInfo.track_name)+ "','"+ trackInfo.track_url +"','" + trackInfo.track_artwork_url +"')>" +
          "<i class='fa fa-share'></i></a></div></li>";

    $('#playlist').append(domEl);
  }
}

function recommendSong(track_type, track_id, track_name){

    console.log('recommending')

     $.ajax({url: "/getusers", async:true}).done(function(response){

            var users = response.split(',');
            $('#receipient_username').autocomplete({source:users,autoFocus:true});
    });

    $("#overlay").css('visibility', 'visible');

    recommend.trackInfo.track_type = track_type;
    recommend.trackInfo.track_id = track_id;
    $("#recommended_song").text(decodeURIComponent(track_name))

}

function recommendTo(){

    recommend.receipient =  $('#receipient_username').val();
    recommend.description = $('#recomendation_description').val();

    console.log(recommend.receipient);

    var recommendation = {
      receipient_username: recommend.receipient,
      track_type: recommend.trackInfo.track_type,
      track_id: recommend.trackInfo.track_id,
      track_url: recommend.trackInfo.track_url,
      track_name: recommend.trackInfo.track_name,
      stream_url: recommend.trackInfo.stream_url,
      track_artwork_url: recommend.trackInfo.track_artwork_url,
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
    };

    $.post('/recommendsong/', recommendation)
      .done(
        function(response) {
          $("#overlay").css('visibility', 'hidden');
          $('#receipient_username').val('');
        }
      );
}

function saveAndRecommend(type, url,id,title,stream_url,artwork_url) {

  console.log('here', decodeURIComponent(title));

  recommend.trackInfo.track_type = type;
  recommend.trackInfo.track_url =  url;
  recommend.trackInfo.track_name =  decodeURIComponent(title);
  recommend.trackInfo.track_id = id;
  recommend.trackInfo.stream_url = stream_url;
  recommend.trackInfo.track_artwork_url = artwork_url;

  $.ajax({url: "/getusers", async:true}).done(function(response){

      var users = response.split(',');
      $('#receipient_username').autocomplete({source:users,autoFocus:true});
  });

  $("#overlay").css('visibility', 'visible');
  $("#recommended_song").text(recommend.trackInfo.track_name)

}

function recommendationPage(){
  //Ajax call to recommend page
  console.log('reco page')
  $.ajax({url: "/getrecommendations/" , async:true}).done(function(response){
    console.log('test');
    $('#playlist').html(response);

  });

  console.log('here')
}

function getUserSongs() {
  $.ajax({url: "/", async: true}).done(function(response) {
    $('#playlist').html(response);
  });
}

function userPlaylist(user){

  console.log('here')

  console.log("user is " + user)

  $.ajax({url: "/user/?user=" + user, async: true}).done(function(response) {
    $('#playlist').html(response);
  })
}

function getURLParameter(url,name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null
}

