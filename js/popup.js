(function() {


	// get a reference of the background radios
	var radios = chrome.extension.getBackgroundPage().radios;
	// get a reference of the background currentRadio
	var currentRadio = chrome.extension.getBackgroundPage().currentRadio;

	(function createRadiosDOM() {

		for (var i = 0, leng = radios.length; i < leng; i++) {
			// create main <a> element
			var aElement = $(document.createElement('a'));
			aElement.addClass("radio-item list-group-item");

			// check is current radio played
			$("#stop-button").prop('disabled', !currentRadio.isPlaying);



			// create <i> element for the icon
			var iElement = $(document.createElement('i'));
			iElement.addClass("radio-item-icon fa fa-play");
			iElement.attr("aria-hidden", "true");


			if(currentRadio.radioInfo.name == radios[i].name) {
				aElement.addClass("active");
				if (currentRadio.isPlaying) {
					iElement.removeClass("fa-play").addClass("fa-pause");
				}
			}

			// append <i> to <a>
			aElement.append(iElement);

			// create <b> element for the name of Radio
			// append the current name of radio in it
			var bElement = $(document.createElement('b'));
			// we've added a space so that the icon and the name don't stuck
			bElement.append(" " + radios[i].name);

			// append <b> to <a>
			aElement.append(bElement);

			// add click listener to current item
			aElement.bind("click", clickPlay);

			// finish him !
			$("#radio-list").append(aElement);

			// set last volume selected by user
			$("#volume").val(chrome.extension.getBackgroundPage().audio.volume * 100);
		}

	}());

	(function getCurrentRadio() {
		currentRadio.radioListRef.addClass("active");
		$("#current-radio-header").text(currentRadio.radioInfo.name);
		$("#current-radio-img").attr("src", currentRadio.radioInfo.icon);
	})();

	// clicking the stop button will call the stop() function
	// declared in background.js which will stop playing the current audio
	$("#stop-button").click(function() {clickStop()});

	$("#volume").change(function () {
		chrome.extension.getBackgroundPage().changeVolume($(this).val());
	});

	function clickPlay() {

		clickStop();

		// remove the active class from the old list element
		currentRadio.radioListRef.removeClass("active");

		// update the list element
		currentRadio.radioListRef = $(this);

		// add "active" class to the clicked item list
		currentRadio.radioListRef.addClass("active");
	  			
	  	// get the last children of <a> element
	  	// which will be the <b> element that contains the name of radio
	  	var radioName = $(this).children(':last').text();

	  	// get the info of the 
	  	$.each(radios, function(i, v) {
	  		if (v.name == radioName.trim()) {
	  			currentRadio.radioInfo = radios[i];

				// select the curren-radio-heade and change it to the selected item
				$("#current-radio-header").text(currentRadio.radioInfo.name);
				$("#current-radio-img").attr("src", currentRadio.radioInfo.icon);

				return;
	  		}
	  	});


	  	// at this point we will end up with two references
	  	// play sound
	  	chrome.extension.getBackgroundPage().play(currentRadio.radioInfo.stream);

	  	$("#stop-button").prop('disabled', !currentRadio.isPlaying);
	}

	function clickStop() {
		chrome.extension.getBackgroundPage().stop();
		$("#stop-button").prop('disabled', !currentRadio.isPlaying);

		// for user interaction
		$(".active").removeClass("active");
		$("#current-radio-header").text("No Radio");
		$(".radio-item").children('i').removeClass().addClass("fa fa-play");

		currentRadio.radioInfo = {name: "No Radio"};
		currentRadio.radioListRef = $(document.createElement('a'));
	}
})();