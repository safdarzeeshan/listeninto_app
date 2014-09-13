/**
 * Created by zeeshan on 13/09/14.
 */

SC.initialize({
  client_id: '201b55a1a16e7c0a122d112590b32e4a'
});

var track_url = 'https://soundcloud.com/fink/fink-looking-too-closely';

SC.get('/resolve', { url: track_url }, function(track) {
  // SC.get('/tracks/' + track.id, function(trackInfo) {
  //   console.log(track, trackInfo);
  console.log(track);
});