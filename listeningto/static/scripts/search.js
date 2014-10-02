$(document).ready(function(){

      SC.initialize({
        client_id: 'ad504f994ee6c4b53cfb47aec786f595'
      });
})

function googleApiClientReady(){

      gapi.client.load('youtube', 'v3',onYouTubeApiLoad );      
}

function onYouTubeApiLoad() {

      gapi.client.setApiKey('AIzaSyDScS0XbWgnTtadhknXXwv9eqmPu9JNsno');
}

function search(){
      //clear search results
      $('#searchResults').empty();

      var search_query =  $('#query').val();
      SC.get('/tracks', { q: search_query, limit: 5}, function(tracks) {
   
        appendSC(tracks);
      });

      var request = gapi.client.youtube.search.list({
        part: 'snippet', 
        type:'video', 
        q: search_query, 
        maxResults: 5});

      request.execute(function(response) {
        appendYT(response)  
      });  
}

function appendSC(tracks){
      
      for(var i in tracks) {

        var item = tracks[i];
        domEl = "<li id='song_"+item.id+"'><a href='#' onClick=loadItem('soundcloud','" + 
                  item.id+  "')>" + item.title + 
                  "</a><a href='#' onClick=getSongInfo('" + item.permalink_url + 
                  "','soundcloud') style='color:blue'>Add</a></li>";

        $('#searchResults').append(domEl);
  }
}

function appendYT(tracks) {

      for(var i in tracks.items) {

        var item = tracks.items[i];
        domEl = "<li id='song_" + item.id.videoId+ "'><a href='#' onClick=loadItem('youtube','" + item.id.videoId + 
          "')>" + item.snippet.title + 
          "</a><a href='#' onClick=getSongInfo('https://www.youtube.com/watch?v=" + item.id.videoId + 
          "','youtube') style='color:blue'>Add</a></li>";"</a></li>";

        $('#searchResults').append(domEl);
      }         
}