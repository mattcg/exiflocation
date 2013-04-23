/**
 * Get location data points from EXIF GPS data embedded in an image.
 *
 * @author Matthew Caruana Galizia <m@m.cg>
 * @license MIT
 * @copyright Copyright (c) 2013, Matthew Caruana Galizia
 * @preserve
 */

/*jshint node:true*/
/*global File, FileList, DataView*/

'use strict';

var ExifReader = require('exifreader').ExifReader;

module.exports = ExifLocation;


/**
 * @constructor
 */
function ExifLocation() {
	this.loading = false;
	this.exifReader = null;
	this.err = null;
}


/**
 * Factory method for producing an array of ExifLocation instances from a FileList.
 *
 * @param {FileList} fileList
 * @param {function} progressCb Progress callback executed once every time an item in the list is loaded, receiving the list index as the third argument
 * @param {function} cb Callback function executed when the entire list is loaded, with the list as the first and only argument
 */
ExifLocation.loadFromFileList = function(fileList, progressCb, cb) {
	var i, l, countDown, exifLocation, exifLocationList, innerCb;

	if (!(fileList instanceof FileList)) {
		throw new TypeError('Expecting FileList, received "' + fileList + '".');
	}

	innerCb = function(i) {
		return function(err, exifLocation) {
			countDown--;
			exifLocationList[i] = exifLocation;
			if (progressCb) {
				progressCb(err, exifLocation, i);
			}

			if (countDown === 0 && cb) {
				cb(exifLocationList);
			}
		};
	};

	// TODO: Only create and push to this list if cb is not null.
	exifLocationList = [];
	countDown = fileList.length;
	for (i = 0, l = countDown; i < l; i++) {
		exifLocation = new ExifLocation();
		exifLocation.loadFromFile(fileList[i], innerCb(i));
	}
};


/**
 * Load from a File.
 *
 * @param {File} file
 * @param {function} cb Callback receives an Error object or null as the first argument and the ExifLocation instance as the second argument.
 */
ExifLocation.prototype.loadFromFile = function(file, cb) {
	var fileReader, self = this;

	if (this.loading) {
		throw new Error('Already loading.');
	}

	if (!(file instanceof File)) {
		throw new TypeError('Expecting File, received "' + file + '".');
	}

	this.loading = true;

	fileReader = new FileReader();
	fileReader.onload = function(event) {
		self.loading = false;
		self.loadFromArrayBuffer(event.target.result, cb);
	};

	fileReader.readAsArrayBuffer(file);
};


/**
 * Load from an ArrayBuffer.
 *
 * @param {ArrayBuffer} arrayBuffer
 * @param {function} cb Callback receives an Error object or null as the first argument and the ExifLocation instance as the second argument.
 */
ExifLocation.prototype.loadFromArrayBuffer = function(arrayBuffer, cb) {
	var exifReader;

	if (this.exifReader) {
		throw new Error('Already loaded.');
	}

	exifReader = new ExifReader();
	try {

		// Parse the Exif tags.
		exifReader.load(arrayBuffer);

		// Or, with jDataView you would use this:
		// exif.loadView(new jDataView(arrayBuffer));

	} catch (err) {
		this.err = err;
		return cb(err, this);
	}

	this.exifReader = exifReader;
	cb(null, this);
};


/**
 * Get the longitude from the image EXIF GPS data.
 *
 * @return {number|boolean} Return false if GPS data is not available
 */
ExifLocation.prototype.getLongitude = function() {
	var longitude, longitudeRef;

	if (!this.exifReader) {
		throw new Error('Not loaded.');
	}

	longitude = this.exifReader.getTagDescription('GPSLongitude');
	if (!longitude) {
		return false;
	}

	longitudeRef = this.exifReader.getTagDescription('GPSLongitudeRef');
	if (longitudeRef === 'West longitude') {
		longitude = longitude * -1;
	}

	return longitude;
};


/**
 * Get the latitude from the image EXIF GPS data.
 *
 * @return {number|boolean} Return false if GPS data is not available
 */
ExifLocation.prototype.getLatitude = function() {
	var latitude, latitudeRef;

	if (!this.exifReader) {
		throw new Error('Not loaded.');
	}

	latitude = this.exifReader.getTagDescription('GPSLatitude');
	if (!latitude) {
		return false;
	}

	latitudeRef = this.exifReader.getTagDescription('GPSLatitudeRef');
	if (latitudeRef === 'South latitude') {
		latitude = latitude * -1;
	}

	return latitude;
};


/**
 * Get a Google Maps URL for the image EXIF GPS coordinates.
 *
 * @param {string} protocol Either 'http:', 'https:' or empty for a protocol relative URL
 * @param {string|number} zoom Zoom level for the map (1-20), defaults to 10
 * @param {string} type Map type, either 'm' for the normal map (default), 'k' for satellite, 'h' for hybrid, 'p' for terrain or 'e' for Google Earth
 * @return {string|boolean} Google Maps URL for the location, or false if no data points available
 */
ExifLocation.prototype.getGoogleMapsUrl = function(protocol, zoom, type) {
	var latitude, longitude;

	if (!protocol) {
		protocol = '';
	}

	if (!zoom) {
		zoom = '10';
	}

	if (!type) {
		type = 'm';
	}

	latitude = this.getLatitude();
	longitude = this.getLongitude();
	if (!latitude || !longitude) {
		return false;
	}

	return protocol + '//maps.google.com/maps?z=' + zoom + '&t=' + type + '&q=loc:' + latitude + '+' + longitude;
};


/**
 * Check if the JavaScript runtime supports the interfaces required by ExifLocation.
 *
 * @return {boolean}
 */
ExifLocation.checkSupport = function() {
	return !(!FileReader || !DataView);
};
