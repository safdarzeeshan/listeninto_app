function loadSound(){
  console.log("fuck this shit")


  $("#jquery_jplayer").jPlayer({
    ready: function () {
      this.element.jPlayer("setFile", "http://api.soundcloud.com/tracks/72186759/stream?client_id=4ead13387d69695b62b1168c307f222d").jPlayer("play");

    }
  });
}