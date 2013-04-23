/*jshint browser:true*/
/*global ExifLocation*/

window.addEventListener('load', function() {
	'use strict';

	var handleFiles, output, URL, revokeObjectUrls, getObjectUrl, objectUrls;

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

	URL = window.URL || window.webkitURL;
	objectUrls = [];
	revokeObjectUrls = function() {
		objectUrls.forEach(function(objectUrl) {
			URL.revokeObjectURL(objectUrl);
		});

		objectUrls.length = 0;
	};

	getObjectUrl = function(file) {
		var objectUrl;

		if (!URL) {
			return;
		}

		objectUrl = URL.createObjectURL(file);
		objectUrls.push(objectUrl);
		return objectUrl;
	};

	handleFiles = function(files) {
		var exifOutput;

		exifOutput = '';
		ExifLocation.loadFromFileList(files, function(err, exifLocation, index) {
			var style, objectUrl;

			if (err) {
				exifOutput = '<li>' + err + ' (image ' + index + ')</li>';
			} else {
				objectUrl = getObjectUrl(files[index]);
				if (objectUrl) {
					style = ' class="with-bg" style="background-image:url(' + objectUrl + ');"';
				} else {
					style = '';
				}

				exifOutput += '<li' + style + '><a href="' + exifLocation.getGoogleMapsUrl('https:') + '">' + exifLocation.getLatitude().toPrecision(8) + ', ' + exifLocation.getLongitude().toPrecision(8) + '</a></li>';
			}
		}, function() {
			output.innerHTML = '<ul>' + exifOutput + '</ul>';
		});
	};

	document.getElementById('file').addEventListener('change', function(event) {
		revokeObjectUrls();
		handleFiles(event.target.files);
	}, false);

}, false);
