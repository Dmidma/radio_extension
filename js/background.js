// create the current Selected Element
var currentRadio = {
  radioInfo: {
    name : "No Radio"
  },
  radioListRef: $(document.createElement('a')),
  isPlaying : false
};

var radios;

/**
 * [Load a JSON file in the radio-list <div>]
 */

$.getJSON("../js/radios.json", function(data) {
  radios = data;
});

var audio = new Audio();

function play(link) {
  if(audio.src !== link) {
    stop();
    audio.src = link;
    audio.play();
    currentRadio.isPlaying = true;
    load();
  }
}

function load() {
  // add refresh icon to selected item
  currentRadio.radioListRef.children('i').removeClass("fa-play").addClass("fa fa-refresh fa-spin fa-fw");
  audio.onloadeddata = function() {
    // add pause icon one radio is loaded
    currentRadio.radioListRef.children('i').removeClass().addClass("fa fa-pause");
  };
}


function stop() {

  if (audio.played) {
    audio.pause();  
  }

  currentRadio.isPlaying = false;
}

function changeVolume(volume){
  audio.volume = volume / 100;
}