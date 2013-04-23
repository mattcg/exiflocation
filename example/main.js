/*jshint browser:true*/

window.addEventListener('load', function() {
	'use strict';

	var handleFile, handleFiles, output;

	if (!window.ExifLocation) {
		alert('window.ExifLocation not found. Have you build the example using `make example`?');
		return;
	}

	output = document.getElementById('output');

	// Check browser support.
	if (!ExifLocation.checkSupport()) {
		output.innerHTML = '<strong>Sorry, your web browser does not support the required APIs.</strong>';
		return;
	}

	handleFiles = function(files) {
		var exifOutput;

		exifOutput = '';

		ExifLocation.loadFromFileList(files, function(err, exifLocation, index) {
			if (err) {
				exifOutput = '<p>' + err + '</p>';
			} else {
				exifOutput += '<p>' + exifLocation.getGoogleMapsUrl() + '</p>';
			}
		}, function() {
			output.innerHTML = exifOutput;
		});
	};

	document.getElementById('file').addEventListener('change', function(event) {
		handleFiles(event.target.files);
	}, false);

}, false);
