/**
 * Created by zeeshan on 10/09/14.
 *
 */
$(function() {
  // Setup the player to autoplay the next track
  var a = audiojs.createAll({
    trackEnded: function() {
      var next = $('ol li.playing').next();
      if (!next.length) next = $('ol li').first();
      next.addClass('playing').siblings().removeClass('playing');
      audio.load($('a', next).attr('data-src'));
      audio.play();
    }
  });

  // Load in the first track
  var audio = a[0];
  first = $('ol a').attr('data-src');
  $('ol li').first().addClass('playing');
  audio.load(first);

  // Load in a track on click
  $('#playlist').on('click', 'li',function(e) {
    console.log("test of click", $(this));
    e.preventDefault();
    $(this).addClass('playing').siblings().removeClass('playing');
    audio.load($('a', this).attr('data-src'));
    audio.play();

    console.log('loading song123')
  });
});


// Initialize SoundCloud API
var client_id = 'ad504f994ee6c4b53cfb47aec786f595';

SC.initialize({
  client_id: client_id
});

// Main Functions

function saveSong() {
  console.log('trying to add song...');
  var song_url = document.getElementById("song_url").value;
  getInfoFromSC(song_url);
}

function getInfoFromSC(song_url){
    var url = String(song_url);
    console.log('getting info...', song_url);

    SC.get('/resolve', {url: song_url}, function(track) {
      console.log(track);
      loadSongToPlayer(track);
    });
}

function loadSongToPlayer(track) {
    console.log('loading...', track);
    domEl = "<li><a href='#' data-src=" + track.stream_url + "?client_id=" + client_id + ">" + track.title + "</a></li>";
    $('#playlist').append(domEl);

    saveToDB(track);
}

function saveToDB(track) {
    console.log('saving...', track);

    $('#song_url').val('');

    var track_info = "track_url=" + track.permalink_url+ "&track_name=" +track.title + "&track_id=" +track.id+ "&stream_url=" + track.stream_url + "&track_artwork_url="+track.artwork_url ;

    $.ajax({url: "/listeningto/addsong?" + track_info ,async:true}).done(function(response){
        console.log('new songs: ', response);
    });
}

function deleteSong(pk) {
  console.log($(this));
  var confirm = window.confirm('Are you sure you want to delete?');
  if (confirm) {
    var url = "listeningto/deletesong" + pk;
    // $.ajax({url: url, async: true}).done(function() {

    // });
  }
}

