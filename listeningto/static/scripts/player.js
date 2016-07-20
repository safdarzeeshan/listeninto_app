currentPlaying = {
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

  //causing issues with play and pause in player
  // var yt_player_1;

    checkIfNewRecosExist();

    $('#button-playlist').addClass('active');

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

      $('#playlist li:first span:first a:first') .trigger('click');
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
               $( ".progress").slider("value", 0);
              }, 0);
          }
        }
    });

  $(document).on('click', '.play-song',  function(event) {
    $('.audio-player').addClass('active');

    event.stopPropagation();
    var type = $(this).attr('song-type');
    var id = $(this).attr('song-id');
    var art = $(this).attr('song-art');
    var recommendationBoolean = $(this).attr('recommendation');
    var name = $(this).attr('song-name');

    $('.song-img').attr('src', art);
    currentPlaying.trackName = unescape(name);


    if (recommendationBoolean === 'False'){
      loadItem(type, id);
    }

    if (recommendationBoolean === 'True'){
      var senderUsername = $(this).attr('sender');
      loadItemAndCheckIfPlayed(type, id, senderUsername);
    }

  });

  $(document).on('click', '.song_name',  function(event) {
    event.stopPropagation();
    var type = $(this).attr('song-type');
    var id = $(this).attr('song-id');
    var art = $(this).attr('song-art');
    var recommendationBoolean = $(this).attr('recommendation');
    var name = $(this).attr('song-name');

    $('.song-img').attr('src', art);
    currentPlaying.trackName = unescape(name);


    if (recommendationBoolean === 'False'){
      loadItem(type, id);
    }

    if (recommendationBoolean === 'True'){
      var senderUsername = $(this).attr('sender');
      loadItemAndCheckIfPlayed(type, id, senderUsername);
    }

  });

  $(document).on('click', '.recommend-song', function(event) {
    event.stopPropagation();
    var type = $(this).attr('song-type');
    var id = $(this).attr('song-id');
    var name = $(this).attr('song-name');
    recommendSong(type, id, name);
  });

  $(document).on('click', '.delete-song', function(event) {
    event.stopPropagation();
    var id = $(this).attr('song-id');
    deleteSong(id);
  });

  $(document).on('click', '#search', function(event) {

    saveSong();
  });


  $(document).on('submit', '#search-form', function(event) {

    event.preventDefault();
  });

  //add onclick for add song and saveAndRecommend
  refreshFeed();

});

function setProgress(type, progress, ui) {
  if(type === 'soundcloud') {
    $('#jplayer_sc').jPlayer("playHead", ui.value * (100 / progress.soundcloud));
  }

  if(type === 'youtube') {
    yt_player_1.seekTo(progress.youtube,true);
  }type
};

function loadItem(type, id) {
  // stop currently playing songs
  stopAllPlayers();

  // load new song
  //currentPlaying.trackName = $('#song_' + id).find('.song_name')[0].children[0].textContent;
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

function convertTime(totalSec) {

  var timeString = '';

  var hours = parseInt( totalSec / 3600 ) % 24;
  var minutes = parseInt( totalSec / 60 ) % 60;
  var seconds = Math.round(totalSec % 60);

  if (hours > 0 && hours < 10) { timeString += hours + ':'; }
  if (hours >= 10) { timeString += "0" + hours + ':'; }

  timeString += (minutes < 10) ? '0' + minutes + ':' : minutes + ':'
  timeString += (seconds < 10) ? '0' + seconds : seconds

  return timeString
}

function loadYoutube(id) {

  yt_player_1.loadVideoById(id);

  $('.pause').show();
  $('.play').hide();
}

function loadSoundcloud(id){

  $("#jplayer_sc").jPlayer("setMedia", {mp3: "http://api.soundcloud.com/tracks/" +  id + "/stream?client_id=ad504f994ee6c4b53cfb47aec786f595"});
  $("#jplayer_sc").jPlayer('play');

  $("#jplayer_sc").bind($.jPlayer.event.timeupdate, function(event) {
    currentPlaying.duration = convertTime(event.jPlayer.status.duration);

    $( ".endTime" ).text(currentPlaying.duration);
  });
}

function nextSong() {

  var nextSong = $('#song_' + currentPlaying.songId).next();

  if (nextSong.length === 0)  {
      $('#playlist li:first span:first a:first') .trigger('click');
  }

  else  {
      nextSong.find('.song_name').trigger('click');
  }
}

function saveSong() {

  $('#button-playlist').removeClass('active');
  $('#button-recommendations').removeClass('active');


  $('.error').html('');
  var song_url = document.getElementById("song_url").value;

  if (song_url.toLowerCase().indexOf("youtube") >= 0) {
    getSongInfo(song_url, 'youtube', false);
  }

  else if (song_url.toLowerCase().indexOf("soundcloud") >= 0) {
    getSongInfo(song_url, 'soundcloud', false);
  }

  else {
    //search for song name
    search(song_url);
  }
}

function getSongInfo(song_url, type, save){
    var url = String(song_url);
    var trackInfo = {};

    //identify if youtube or soundcloud
    if(song_url.toLowerCase().indexOf("youtube")>=0){

      var id = getURLParameter(url, 'v' )

      $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + id + '&key=AIzaSyCIAcOpmbnCDpnmcm8Y3WnJs788bflySOQ',function(data,status,xhr){
        trackInfo = {
          track_type: 'youtube',
          track_url: url,
          track_name: data.items[0].snippet.title,
          track_id: id,
          track_artwork_url: data.items[0].snippet.thumbnails.high.url,
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        };

        if (save) {
                  saveSongToDb(trackInfo);
           }
        else{
              displayInsertedUrl(trackInfo);
        }
      });


   }

    if(song_url.toLowerCase().indexOf("soundcloud")>=0){
      //get soundcloud song info and add to db

      SC.get('/resolve', {url: song_url}, function(track) {


        if (track.artwork_url !== null){

            default_artwork_url = track.artwork_url
            // //300 x 300 px art
            artwork_url = default_artwork_url.replace("large","t300x300");
        }

        else{
            //default image
            artwork_url = 'https://i.ytimg.com/vi/GtBaB85VQEw/hqdefault.jpg'
        }

        trackInfo = {
          track_type: 'soundcloud',
          track_url: track.permalink_url,
          track_name: track.title,
          track_id: track.id,
          stream_url: track.stream_url,
          track_artwork_url: artwork_url,
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        };

        if (save) { saveSongToDb(trackInfo); }


        else {
              displayInsertedUrl(trackInfo);

        }

        // return trackInfo;

      });

    }
}

function saveSongToDb(trackInfo) {
  $('#song_url').val('')
  $('#song_' + trackInfo.track_id).children('.song_options').children('#add-song').html("<i class='fa fa-check'></i>");

  // var savingSong = $.post('addsong/', trackInfo);

  // savingSong.done(function(data) {
  //   $('#song_' + trackInfo.track_id).children('.song_options').('#add-song').html("<i class='fa fa-check'></i>");
  // });

  // savingSong.fail(function(){
  //   $('#song_' + trackInfo.track_id).children('.song_name').html("<p class='error-playlistmax'>Error: Your playlist is full. Please delete a song first</p>");
  // });
}

function displayInsertedUrl(trackInfo){
  $('#playlist').empty();

  if(trackInfo.track_type === 'youtube'){

    domEl = "<li id='song_" + trackInfo.track_id + "'>" +
        "<span class = 'song_options'>" +
        "<a href='#' href='#' class='play-song' title = 'Play Song' song-type='youtube' song-id='" + trackInfo.track_id +"' song-art = '" + trackInfo.track_artwork_url + "' recommendation = 'False'>" +
        "<i class='fa fa-play'></i></a>" +
        "<a href='#' class='recommend-song' title = 'Recommend Song' onClick=saveAndRecommend('youtube'" + ","+"'https://www.youtube.com/watch?v="+ trackInfo.track_id +"','"+trackInfo.track_id+"','" + encodeURIComponent(trackInfo.track_title) + "','null','" +trackInfo.track_artwork_url  +"')>" +
        "<i class='fa fa-share'></i></a>" +
        "<a href='#' class='add-song' title = 'Add Song' onClick=getSongInfo('https://www.youtube.com/watch?v=" + trackInfo.track_id +
        "','youtube','true')>" +
        "<i class='fa fa-plus'></i></a></span>" +
        "<span class='song_name' song-type='youtube' song-id='" + trackInfo.track_id + "' song-art = '" + trackInfo.track_artwork_url + "' recommendation = 'False'><p>" + trackInfo.track_name + "</p></span></li>";

    $('#playlist').append(domEl);
  }

  if(trackInfo.track_type === 'soundcloud'){

    domEl = "<li id='song_"+trackInfo.track_id+"'>" +
          "<span class = 'song_options'>" +
          "<a href='#' href='#' class='play-song' title = 'Play Song' song-type='soundcloud' song-id='" + trackInfo.track_id + "' song-art = '" + trackInfo.track_artwork_url + "' recommendation = 'False'>" +
          "<i class='fa fa-play'></i></a>" +
          "<a href='#' class='recommend-song' title = 'Recommend Song'  onClick=saveAndRecommend('soundcloud'" + ",'"+ trackInfo.track_url +
          "','"+trackInfo.track_id+"','"+ encodeURIComponent(trackInfo.track_name)+ "','"+ trackInfo.track_url +"','" + trackInfo.track_artwork_url +"')>" +
          "<i class='fa fa-share'></i></a>" +
          "<a href='#' class='add-song' title = 'Add Song' onClick=getSongInfo('" + trackInfo.track_url +"','soundcloud','true')>" +
          "<i class='fa fa-plus'></i></a></span>" +
          "<span class='song_name'  song-type='soundcloud' song-id='" + trackInfo.track_id + "' song-art = '" + trackInfo.track_artwork_url + "'  recommendation = 'False'><p>" + trackInfo.track_name + "</p></span></li>";

    $('#playlist').append(domEl);
  }
}

function recommendSong(track_type, track_id, track_name){

     $.ajax({url: "/getusers", async:true}).done(function(response){

      //this change was made to incorporate first name and last name instead of username
          var users = [];
          var usersJSON = JSON.parse(response).users;

          _.each(_.map(usersJSON, function(user) {

              return user

          }), function(user_info) {
                  users.push(user_info)
              }
          )

          $('.receipient_username').autocomplete({
            source:users,
            autoFocus:true,
          });

          $('.receipient_username').autocomplete( "option", "appendTo", "#reco-modal" );
    });

    $("html,body").css("overflow","hidden");
    // $("#overlay").css('visibility', 'visible');addClass('active');
    $("#overlay").addClass('active');

    recommend.trackInfo.track_type = track_type;
    recommend.trackInfo.track_id = track_id;
    $("#recommended_song").text(decodeURIComponent(track_name))

}

function recommendTo(){

    recommend.receipient =  $('.receipient_username').val();
    recommend.description = $('#recomendation_description').val();

    var recommendation = {
      receipient_username: recommend.receipient,
      track_type: recommend.trackInfo.track_type,
      track_id: recommend.trackInfo.track_id,
      track_url: recommend.trackInfo.track_url,
      track_name: recommend.trackInfo.track_name,
      stream_url: recommend.trackInfo.stream_url,
      track_artwork_url: recommend.trackInfo.track_artwork_url,
      description: recommend.description,
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
    };

    $.post('/recommendsong/', recommendation)
      .done(
        function(response) {
          // $("#overlay").css('visibility', 'hidden');
          $("#overlay").removeClass('active');
          $('.receipient_username').val('');
          $('#recomendation_description').val('');
          $("html,body").css("overflow","auto");
          refreshFeed();
        }
      );
}

function saveAndRecommend(type, url,id,title,stream_url,artwork_url) {

  recommend.trackInfo.track_type = type;
  recommend.trackInfo.track_url =  url;
  recommend.trackInfo.track_name =  unescape(title);
  recommend.trackInfo.track_id = id;
  recommend.trackInfo.stream_url = stream_url;
  recommend.trackInfo.track_artwork_url = artwork_url;

  $.ajax({url: "/getusers", async:true}).done(function(response){

          var users = [];
          var usersJSON = JSON.parse(response).users;

          _.each(_.map(usersJSON, function(user) {

              return user

          }), function(user_info) {
                  users.push(user_info)
              }
          )

          $('.receipient_username').autocomplete({
            source:users,
            autoFocus:true,
          });

          $('.receipient_username').autocomplete( "option", "appendTo", "#reco-modal" );
  });

 // $("#overlay").css('visibility', 'visible');
 $("#overlay").addClass('active');
 $("html,body").css("overflow","hidden");

  $("#recommended_song").text(recommend.trackInfo.track_name)

}

function recommendationPage(){
  $.ajax({url: "/getrecommendations/" , async:true}).done(function(response){
    $('#playlist').html(response);
    // this is an awful way to do this...
    $('#button-playlist').removeClass('active');
    $('#button-recommendations').addClass('active');
  });

  refreshFeed();
  checkIfNewRecosExist()
}

function getUserSongs() {
  $.ajax({url: "/", async: true}).done(function(response) {
    $('#playlist').html(response);
    // this is an awful way to do this...
    $('#button-playlist').addClass('active');
    $('#button-recommendations').removeClass('active');
  });
  refreshFeed();
}

function userPlaylist(user){
  $.ajax({url: "/user/?user=" + user, async: true}).done(function(response) {
    $('#playlist').html(response);
  });
  $('#button-playlist').removeClass('active');
  refreshFeed();
}

function deleteSong(id) {
  $.ajax({url: "/deletesong?trackid=" + id, async:true}).done(function(response){
      $('#song_' + id).remove();
  });
}

function loadItemAndCheckIfPlayed(type, id, senderUsername){
  loadItem(type, id);

  var playing_reco_info = {track_id: id,
                           sender: senderUsername,
                          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
                          }

  var checkIfPlayed = $.post('isrecoplayed/', playing_reco_info);

  checkIfPlayed.done(function(response) {
    //if reco was not played then remove the new icon
    if (response === 'False'){
        $('#song_' + id).find('.new-reco').hide();
        checkIfNewRecosExist()
    }

  });
}

function checkIfNewRecosExist(){
  $.ajax({url: "/anynewrecos", async:true}).done(function(response){
    //fix this. check if new resos exist for this particular user

    if (response==='True'){

      $('.new-recommendation-indicator').css('visibility','visible');
    }

    else{
      $('.new-recommendation-indicator').css('visibility','hidden');
    }
  });
}

function closeModal(){
    // $("#overlay").css('visibility', 'hidden');
    $("#overlay").removeClass('active');
    $('.receipient_username').val('');
    $('#recomendation_description').val('');
    $("html,body").css("overflow","auto");
}

function getURLParameter(url,name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null
}

function refreshFeed() {
  console.log('refreshing feed')
  $.ajax({url: "/feed", async:true}).done(function(response) {

    var users = JSON.parse(response).users;
    var recos = JSON.parse(response).recommendations;

    if(!users.length && !recos.length) {
      $('.feedbox').hide();
    }

    $('ul.feed').html('');

    _.each(_.map(users, function(user) {
      return "<li class='feed-item'>" + user.name + " joined as <a href='#' class='user' onClick=userPlaylist('"+ user.username +"')>" + user.username + "!</li>";
    }), function(el) {
      $('ul.feed').append(el);
    });

    _.each(_.map(recos, function(reco) {
      return "<li class='feed-item'><a href='#' class='user' onClick=userPlaylist('"+ reco.sender +"')>"  + reco.sender +
             "</a> recommended " + "<a href='#' class='play-song' title='" +reco.track_name + "' song-name ='" + escape(reco.track_name) + "' song-type='"+reco.track_type+
             "' song-id='"+ reco.track_id+"' song-art = '"+reco.track_artwork_url+"' recommendation = 'False'>" +
             reco.track_name + "</a> to <a href='#' class='user' onClick=userPlaylist('"+ reco.receipient +"')>" + reco.receipient + "</a></li>";

    }), function(el) {
      $('ul.feed').append(el);
    });

  });
}

function showRegistrationForm(){
  $.ajax({url: "/registrationForm/" , async:true}).done(function(response){

    $('.auth').html(response);
  });
}

function getHistory(){


}

