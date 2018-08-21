document.addEventListener('DOMContentLoaded', initLocation);

function initLocation() {

	let markers = [];
	let screenWidth = window.screen.availWidth;
	let weatherLoaded = false;
	const countryRestriction = { componentRestrictions: { country: 'us' }};
	const autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationsearch'), countryRestriction);

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
		const location = {
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		}
		
		updateLocation(location);
	});

	function updateLocation(location) {
		if (!weatherLoaded) {
			removeWelcome();
			retrieveData(location);
		} else {
			removeWeather();
			setTimeout(function() { retrieveData(location) }, 1000);
		}

		weatherLoaded = true;

		// Remove any existing markers
		if (markers.length > 0) {
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
		}

		const marker = new google.maps.Marker({
			position: location,
			map: map
		});

		if (screenWidth < 768) {
			map.setZoom(7);
			map.panTo({ lat: (location.lat - 0.2), lng: location.lng });
		} else {
			// Zoom in further and shift map to right to compensate for desktop design
			map.setZoom(8);
			map.panTo({ lat: location.lat, lng: (location.lng - 1.35) });
		}

		markers.push(marker);
	}

	// Autocomplete and listener for main search bar
	autocomplete.bindTo('bounds', map)
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		const searchLocation = resolveLocation(autocomplete);
		document.getElementById('locationsearch').blur();
		updateLocation(searchLocation);
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
		const location = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		}

		updateLocation(location);
	}

	// Alert user when their location cannot be found
	function locationError() {
		alert('Unable to retrieve location.');
	}
}

function retrieveData(location) {
	if (!location.city) {
		resolveAddress(location)
			.then(data => document.getElementById('locationname').innerHTML = data);
	} else {
		document.getElementById('locationname').innerHTML = location.city + ', ' + location.state;
	}
	retrieveWeather(location)
		.then(data => updateHTML(data));
}

async function resolveAddress(location) {
	const lat = location.lat;
	const long = location.lng;
	const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;

	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log(data);
		const city = data.results[0].address_components[3].long_name;
		const state = data.results[0].address_components[5].long_name;
		return (city + ', ' + state);
	} catch(e) {
		return 'Unknown Location';
	}
}