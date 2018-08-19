document.addEventListener('DOMContentLoaded', initMap);

function initMap() {

	let markers = [];
	let screenWidth = window.screen.availWidth;
	const countryRestriction = { componentRestrictions: { country: 'us' }};

	const map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 39.5, lng: -98.35 },
		mapTypeId: 'terrain',
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false,
		gestureHandling: 'greedy'
    });

    if (screenWidth < 768) {
		map.setZoom(4);
	} else {
		map.setZoom(5);
	}

    const radar = new google.maps.ImageMapType ({
		getTileUrl: function(tile, zoom) {
			return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
		},
		tileSize: new google.maps.Size(256, 256),
		opacity: 0.60,
		name: 'NEXRAD',
		isPng: true
	});

	map.overlayMapTypes.setAt('1', radar);
	
	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	});

	function placeMarker(location, loadWeather = true) {
		if (loadWeather) {
			if (!weatherLoaded) {
				closeIntro();
				resolveAddress(location)
					.then(data => document.getElementById('locationname').innerHTML = data);
				getWeather(location)
					.then(data => updateHTML(data));
			} else {
				document.getElementById('weather').style.animation =  'weatherDown .5s ease forwards';
				setTimeout(function() {
					resolveAddress(location)
						.then(data => document.getElementById('locationname').innerHTML = data);
					getWeather(location)
						.then(data => updateHTML(data));
				}, 1000);
			}
		}

		if (markers.length > 0) {
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
		}

		const marker = new google.maps.Marker({
			position: location,
			map: map
		});

		markers.push(marker);
	}

	// Autocomplete and listener for main search bar
	const autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationsearch'), countryRestriction);
	autocomplete.bindTo('bounds', map)
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		const searchLocation = resolveLocation(autocomplete);
		document.getElementById('locationsearch').blur();
		if (!weatherLoaded) {
			closeIntro();
			placeMarker(searchLocation, false);
			getWeather(searchLocation, false)
				.then(data => updateHTML(data));
		} else {
			document.getElementById('weather').style.animation =  'weatherDown .5s ease forwards';
			placeMarker(searchLocation, false);
			setTimeout(function() {
				document.getElementById('locationname').innerHTML = searchLocation.city + ', ' + searchLocation.state;
				getWeather(searchLocation, false)
					.then(data => updateHTML(data));
			}, 1000);
		}
	});

	function resolveLocation(element) {
		const place = element.getPlace();
		const lat = place.geometry.location.lat();
		const long = place.geometry.location.lng();
		const city = place.address_components[3].long_name;
		const state = place.address_components[5].long_name;
		
		const location = {
			lat: lat,
			lng: long,
			city: city,
			state: state
		}
		return location;
	}

	document.getElementById('locate').addEventListener('click', findLocation);

	// Find the user's current location, if supported
	function findLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(findUserLocation, locationError);
		} else {
			alert('Your browser does not support location. Please enter your location.');
		}
	}

	// Find weather based on user's determined coordinates and update HTML
	function findUserLocation(position) {
		const lat = position.coords.latitude;
		const long = position.coords.longitude;
		const location = {
			lat: lat,
			lng: long
		}
		const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
		const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
		const request = new XMLHttpRequest();

		request.open('GET', url, true);
		
		request.onload = function() {
			if (!weatherLoaded) {
				closeIntro();
				resolveAddress(location, false)
					.then(data => document.getElementById('locationname').innerHTML = data);
				placeMarker(location, false);
				getWeather(location, false)
					.then(data => updateHTML(data));
			} else {
				document.getElementById('weather').style.animation =  'weatherDown .5s ease forwards';
				placeMarker(location, false);
				setTimeout(function() {
					resolveAddress(location, false)
						.then(data => document.getElementById('locationname').innerHTML = data);
					getWeather(location, false)
						.then(data => updateHTML(data));
				}, 1000);
			}
		};

		request.onerror = () => { console.log('Connection error.'); };

		request.send();
	}

	// Alert user when their location cannot be found
	function locationError() {
		alert('Unable to retrieve location.');
	}
}

async function resolveAddress(location, useFunction = true) {
	let lat, long;
	if (useFunction) {
		lat = location.lat();
		long = location.lng();
	} else {
		lat = location.lat;
		long = location.lng;
	}
	const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);
	const city = data.results[0].address_components[3].long_name;
	const state = data.results[0].address_components[5].long_name;
	return (city + ', ' + state);
}