/**
 * Created by zeeshan on 14/09/14.
 */
	$("#jquery_jplayer").jPlayer({
	  ready: function () {
	    this.element.jPlayer("setFile", "http://api.soundcloud.com/tracks/72186759/stream?client_id=4ead13387d69695b62b1168c307f222d").jPlayer("play");

	  },
	  swfPath: "http://jplayer.org/1.2.0/js",
	  volume: 50,
	  preload: 'none'
	})