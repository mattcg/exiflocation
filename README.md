# ExifLocation #

Client and server-side GPS coordinate extraction using JavaScript.

## Install ##

You'll need [Component](https://github.com/component/component) and GNU make. Then run:

```bash
git clone https://github.com/mattcg/exiflocation.git
cd exiflocation/
make
```

Alternatively, use Component to install to your project.

```bash
component install exiflocation
```

ExifLocation is also available using Bower.

```bash
bower install exiflocation
```

## API ##

See `example/` for a complete example.

### ExifLocation.checkSupport() ###

ExifLocation uses [FileReader](https://developer.mozilla.org/en/docs/DOM/FileReader) and [DataView](https://developer.mozilla.org/en-US/docs/JavaScript/Typed_arrays/DataView) (available since Chrome 9, Firefox 15, IE 10, Safari 5.1). Use this method to check support in the current runtime.

Broader support is possible using [jDataView](https://github.com/vjeux/jDataView).

### ExifLocation.loadFromFileList(fileList, progressCb, cb) ###

Pass a [FileList](https://developer.mozilla.org/en-US/docs/DOM/FileList) as the first argument. The `progressCb` argument is a function that's executed once for each file in the list, receiving an error (if any) as the first argument and the ExifLocation instance as the second. The `cb` argument is executed once all the files have been loaded and receives an array of ExifLocation instances in the same order as the corresponding files in `fileList`.

```javascript
var file = document.getElementById('file');

file.multiple = true;
file.addEventListener('change', function(event) {
	ExifLocation.loadFromFileList(event.target.files, function(err, exifLocation) {
		if (!err) {
			console.log(exifLocation.getGoogleMapsUrl(location.protocol));
		}
	});
}, false);
```

### loadFromFile(file, cb) ###

Receives a [File](https://developer.mozilla.org/en-US/docs/DOM/File) as the first argument. The callback function receives an error object or null as the first argument and the ExifLocation instance as the second.

### loadFromArrayBuffer(arrayBuffer, cb) ###

As above, but with an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/JavaScript/Typed_arrays/ArrayBuffer).

### getLatitude() ###

Returns the decimal latitude.

### getLongitude() ###

Returns the decimal longitude.

### getGoogleMapsUrl(protocol, zoom, type) ###

Get a Google Maps URL for the embedded location. The protocol is relative by default. The `type` parameter is either `'m'` for the normal map (default), `'k'` for satellite, `'h'` for hybrid, `'p'` for terrain or `'e'` for Google Earth.

## Might be handy ##

- [convert from decimal to degree/minute/second format](http://andrew.hedges.name/experiments/convert_lat_long/)

## License ##

ExifLocation is copyright © 2013 [Matthew Caruana Galizia](https://twitter.com/mcaruanagalizia), licensed under an [MIT license](http://mattcg.mit-license.org/).
