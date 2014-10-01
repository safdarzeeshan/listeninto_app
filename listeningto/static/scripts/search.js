
// //youtube
// function googleApiClientReady(){
//   gapi.client.setApiKey('AIzaSyA5Nd_AjsQiFTdpVHYFGdYf8gzwIVy-_RA');
//   gapi.client.load('youtube', 'v3', function() {
//   searchA();
//   });
// }

// function searchA() {
//   var results = gapi.client.youtube.search.list('id,snippet', {q: 'dogs', maxResults: 5});
//   console.log('here');
//   console.log(results)


//   for(var i in results.items) {
//     console.log('here also')
//     var item = results.items[i];
//     console.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
//   }
// }


//soundcloud
$(document).ready(function(){

      SC.initialize({
        client_id: 'ad504f994ee6c4b53cfb47aec786f595'
      });

})

function search(){

      var search_query =  $('#query').val();
      SC.get('/tracks', { q: search_query, limit: 10}, function(tracks) {
      console.log(tracks[0]);
   
      append(tracks);

      });
}

function append(tracks){
      
        //append
      var results = document.getElementById('searchResults');

        for(var i in tracks) {

        var item = tracks[i];
        console.log(item.title)
        results.appendChild(document.createElement('P'));
        results.appendChild(document.createTextNode(item.title));
  }
}