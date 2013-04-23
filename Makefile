build: components lib/ExifLocation.js
	@component build --dev --name exiflocation
	@component build --standalone ExifLocation --name exiflocation.standalone

components: component.json
	@component install --dev

example: build

clean:
	rm -fr build components

.PHONY: clean example
