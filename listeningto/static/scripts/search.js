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

<<<<<<< HEAD
        //Make sure to resolve this - Space character cannot be added in html so it has been removed in title  
        
        domEl = "<li id='song_"+item.id+"'><a href='#' onClick=loadItem('soundcloud','" +
                  item.id+  "')>" + item.title +
                  "</a>" + "<button onClick=getSongInfo('" + item.permalink_url +
                  "','soundcloud', 'true') style='color:grey'>Add</button>" + 
                  "<button onClick=saveAndRecommend('soundcloud'" + ",'"+item.permalink_url +"','"+item.id+"','"+ item.title.replace(/ /g, '')+ "','"+ item.stream_url+"','" + item.artwork_url+"')>Recommend</button></li>";
                
=======
        //Make sure to resolve this - Space character cannot be added in html so it has been removed in title

        domEl = "<li id='song_"+item.id+"'><a href='#' onClick=loadItem('soundcloud','" +
                  item.id+  "')>" + item.title +
                  "</a>" + "<button onClick=getSongInfo('" + item.permalink_url +
                  "','soundcloud', 'true') style='color:grey'>Add</button>" +
                  "<button onClick=saveAndRecommend('soundcloud'" + ",'"+item.permalink_url +"','"+item.id+"','"+ encodeURIComponent(item.title)+ "','"+ item.stream_url+"','" + item.artwork_url+"')>Recommend</button></li>";

>>>>>>> 9271f8b5194ed1f3e5b7f1f4a6704ac37c3c1fb5

        $('#searchResults').append(domEl);
  }
}

function appendYT(tracks) {

      for(var i in tracks.items) {

        var item = tracks.items[i];
<<<<<<< HEAD
=======

        domEl = "<li id='song_" + item.id.videoId+ "'><a href='#' onClick=loadItem('youtube','" + item.id.videoId +
                "')>" + item.snippet.title +
                "</a><button onClick=getSongInfo('https://www.youtube.com/watch?v=" + item.id.videoId +
                "','youtube', 'true') style='color:grey'>Add</button>"+
                "<button onClick=saveAndRecommend('youtube'" + ","+"'https://www.youtube.com/watch?v="+ item.id.videoId +"','"+item.id.videoId+"','" + encodeURIComponent(item.snippet.title) + "','null','" +item.snippet.thumbnails.default.url  +"')>Recommend</button></li>";

>>>>>>> 9271f8b5194ed1f3e5b7f1f4a6704ac37c3c1fb5

        domEl = "<li id='song_" + item.id.videoId+ "'><a href='#' onClick=loadItem('youtube','" + item.id.videoId +
                "')>" + item.snippet.title +
                "</a><button onClick=getSongInfo('https://www.youtube.com/watch?v=" + item.id.videoId +
                "','youtube', 'true') style='color:grey'>Add</button>"+
                "<button onClick=saveAndRecommend('youtube'" + ","+"'https://www.youtube.com/watch?v="+ item.id.videoId +"','"+item.id.videoId+"','"+ item.snippet.title.replace(/ /g, '')+ "','null','" +item.snippet.thumbnails.default.url  +"')>Recommend</button></li>";
                
  
        $('#searchResults').append(domEl);
      }
}



