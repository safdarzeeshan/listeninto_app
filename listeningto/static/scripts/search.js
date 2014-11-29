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


      var domElsearch_buttons = "<div><span><a href='#' class='song-search' onClick='showSearchedSongs()'>Songs</a>" +
                                "<a href='#' class='user-search' onClick='showSearchedUsers()'>Users</a></div>";

      var domElSearch = "<h3 class='searched-song' id='search-query'>Search Results for '" + search_query + "'</h3>";

      $('#playlist').append(domElsearch_buttons);

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

        if (item.artwork_url !== null){

            default_artwork_url = item.artwork_url
            // //300 x 300 px art
            artwork_url = default_artwork_url.replace("large","t300x300");
        }

        else{
            //default image
            artwork_url = 'https://i.ytimg.com/vi/GtBaB85VQEw/hqdefault.jpg'
        }

        domEl = "<li id='song_"+item.id+"' class='searched-song'>" +
                  "<span class = 'song_options'>" +
                  "<a href='#' class='play-song' title ='Play Song' song-type='soundcloud' song-id='" + item.id+ "' song-art = '" + artwork_url + "' recommendation = 'False' >" +
                  "<i class='fa fa-play'></i></a>" +
                  "<a href='#' id='recommend-song' title = 'Recommend Song'  onClick=saveAndRecommend('soundcloud'" + ",'"+item.permalink_url +
                  "','"+item.id+"','"+ encodeURIComponent(item.title)+ "','"+ item.stream_url+"','" + artwork_url+"')>" +
                  "<i class='fa fa-share'></i></a>" +
                  "<a href='#' id='add-song' title = 'Add Song' onClick=getSongInfo('" + item.permalink_url +"','soundcloud','true')>" +
                  "<i class='fa fa-plus'></i></a></span>" +
                  "<span class='song_name' song-type='soundcloud' song-id='" + item.id+ "' song-art = '" + artwork_url + "' recommendation = 'False'><p>" + item.title + "</p></span></li>";

        $('#playlist').append(domEl);
  }
}

function appendYT(tracks) {

  _.each(tracks.items, function(item) {
    domEl = "<li id='song_" + item.id.videoId+ "' class='searched-song'>" +
            "<span class = 'song_options'>"  +
            "<a href='#' class='play-song' title ='Play Song' song-type='youtube' song-id='" + item.id.videoId +
            "' song-art = '" + item.snippet.thumbnails.high.url + "' recommendation = 'False'>" +
            "<i class='fa fa-play'></i></a>" +
            "<a href='#' id='recommend-song' title = 'Recommend Song' onClick=saveAndRecommend('youtube'" +
            ","+"'https://www.youtube.com/watch?v="+ item.id.videoId +"','"+item.id.videoId+"','" +
            encodeURIComponent(item.snippet.title) + "','null','" +item.snippet.thumbnails.high.url  +"')>" +
            "<i class='fa fa-share'></i></a>" +
            "<a href='#' id='add-song' title = 'Add Song' onClick=getSongInfo('https://www.youtube.com/watch?v=" +
            item.id.videoId + "','youtube','true')>" + "<i class='fa fa-plus'></i></a></span>" +
            "<span class='song_name' song-type='youtube' song-id='" + item.id.videoId +
            "' song-art = '" + item.snippet.thumbnails.high.url + "' recommendation = 'False'><p>" +
            item.snippet.title + "</p></span></li>";

    $('#playlist').append(domEl);
  });
}

function searchUsers(users){

    $.ajax({url: "/searchusers?userquery=" + users, async:true}).done(function(response){

            if(response.length) {
              var userSearch = "<h3 class='searched-user' id='search-query'>Users matching '" + users + "'</h3>";
              $('#playlist').append(userSearch);
              users = response.split(',');
              _.each(users, function(user) {
                var domEluser = "<li class='searched-user'><a href='#' onClick=userPlaylist('"+ user +"')>" +
                user + "</a></li>";
                $('#playlist').append(domEluser);
              });
            }

            else{
                var noSearchResult = "<h3 class='searched-user'>No users</h3>"
                $('#playlist').append(noSearchResult);
            }
            $('.searched-user').hide();

    });


}

function showSearchedSongs(){
  $('.searched-user').hide();
  $('.searched-song').show();

}

function showSearchedUsers(){
  $('.searched-song').hide();
  $('.searched-user').show();

}