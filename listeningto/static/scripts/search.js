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

        if (item.artwork_url !== null){

            default_artwork_url = item.artwork_url
            // //300 x 300 px art
            artwork_url = default_artwork_url.replace("large","t300x300");
        }
        
        else{
            //default image
            artwork_url = 'https://i.ytimg.com/vi/GtBaB85VQEw/hqdefault.jpg'
        }    

        domEl = "<li id='song_"+item.id+"'>" +
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

      for(var i in tracks.items) {

        var item = tracks.items[i];

        domEl = "<li id='song_" + item.id.videoId+ "'>" +
                "<span class = 'song_options'>"  +
                "<a href='#' class='play-song' title ='Play Song' song-type='youtube' song-id='" + item.id.videoId + "' song-art = '" + item.snippet.thumbnails.high.url + "' recommendation = 'False'>" +
                "<i class='fa fa-play'></i></a>" +
                "<a href='#' id='recommend-song' title = 'Recommend Song' onClick=saveAndRecommend('youtube'" + ","+"'https://www.youtube.com/watch?v="+ item.id.videoId +"','"+item.id.videoId+"','" + encodeURIComponent(item.snippet.title) + "','null','" +item.snippet.thumbnails.high.url  +"')>" +
                "<i class='fa fa-share'></i></a>" +
                "<a href='#' id='add-song' title = 'Add Song' onClick=getSongInfo('https://www.youtube.com/watch?v=" + item.id.videoId +
                "','youtube','true')>" +
                "<i class='fa fa-plus'></i></a></span>" + 
                "<span class='song_name' song-type='youtube' song-id='" + item.id.videoId +
                "' song-art = '" + item.snippet.thumbnails.high.url + "' recommendation = 'False'><p>" + item.snippet.title + "</p></span></li>";

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
