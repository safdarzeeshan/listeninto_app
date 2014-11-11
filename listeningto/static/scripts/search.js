$(document).ready(function(){
      $('#close-search').hide();


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

function search(search_query){
      //clear search results

      $('#playlist').empty();

      var domElSearch = "<h3 class='search-query'>Search Results for '" + search_query + "'</h3>";
      $('#playlist').append(domElSearch);

      searchUsers(search_query);

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

        domEl = "<li id='song_"+item.id+"'><div class='song_name'><a href='#' onClick=loadItem('soundcloud','" +
                  item.id+  "')>" + item.title + "</a></div>" +
                  "<div class = 'song_options'>" +
                  "<a href='#' id='add-song' title = 'Add Song' onClick=getSongInfo('" + item.permalink_url +"','soundcloud','true')>" +
                  "<i class='fa fa-plus'></i></a>" +
                  "<a href='#' href='#' id='play-song' title = 'Play Song' onClick=loadItem('soundcloud','" + item.id+  "')>" +
                  "<i class='fa fa-play'></i></a>" +
                  "<a href='#' id='recommend-song' title = 'Recommend Song'  onClick=saveAndRecommend('soundcloud'" + ",'"+item.permalink_url +
                  "','"+item.id+"','"+ encodeURIComponent(item.title)+ "','"+ item.stream_url+"','" + item.artwork_url+"')>" +
                  "<i class='fa fa-share'></i></a></div></li>";

        $('#playlist').append(domEl);
  }
}

function appendYT(tracks) {

      for(var i in tracks.items) {

        var item = tracks.items[i];

        domEl = "<li id='song_" + item.id.videoId+ "'><div class='song_name'><a href='#' onClick=loadItem('youtube','" + item.id.videoId +
                "')>" + item.snippet.title + "</a></div>" +
                "<div class = 'song_options'>" +
                "<a href='#' id='add-song' title = 'Add Song' onClick=getSongInfo('https://www.youtube.com/watch?v=" + item.id.videoId +
                "','youtube','true')>" +
                "<img class= 'play-song-img' src='static/images/add.png'></a>" +
                "<a href='#' href='#' id='play-song' title = 'Play Song' onClick=loadItem('youtube','" + item.id.videoId +"')>" +
                "<img class= 'play-song-img' src='static/images/play.png'></a>" +
                "<a href='#' id='recommend-song' title = 'Recommend Song' onClick=saveAndRecommend('youtube'" + ","+"'https://www.youtube.com/watch?v="+ item.id.videoId +"','"+item.id.videoId+"','" + encodeURIComponent(item.snippet.title) + "','null','" +item.snippet.thumbnails.default.url  +"')>" +
                "<img class= 'recommend-song-img' src='static/images/recommend.png'></a></div></li>";

        $('#playlist').append(domEl);
      }
}

function searchUsers(users){

    $.ajax({url: "/searchusers?userquery=" + users, async:true}).done(function(response){

            var user = response;
            domEl= "<li><a href='#' onClick=userPlaylist('"+ user +"')>" + user + "</a></li>";

            if(response.length) {
              var userSearch = "<h3 class='search-query'>Users matching '" + users + "'</h3><ul class='user-list'></ul>";
              $('#playlist').prepend(userSearch);
              $('.user-list').append(domEl);
            }

    });
}






