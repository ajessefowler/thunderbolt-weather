document.addEventListener('DOMContentLoaded', initLocation);

function initLocation() {

	let centerCoords;
	let markers = [];
	let screenWidth = window.screen.availWidth;
	let weatherLoaded = false;
	const countryRestriction = { componentRestrictions: { country: 'us' }};
	const autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationsearch'), countryRestriction);

	let history = JSON.parse(localStorage.getItem('history')) || [];
	let defaultLocation = JSON.parse(localStorage.getItem('defaultlocation'));

	if (screenWidth < 768) {
		centerCoords = { lat: 35, lng: -98.35 };
	} else {
		centerCoords = { lat: 39.5, lng: -113 };
	}

	const map = new google.maps.Map(document.getElementById('map'), {
		center: centerCoords,
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
		map.setZoom(3.5);
	} else {
		map.setZoom(4.4);
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
		updateLocalStorage(location);

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
			map.panTo({ lat: (location.lat - 0.5), lng: location.lng });
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
		const location = {
			lat: lat,
			lng: long
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

	function updateLocalStorage(location) {
		history.push(location);
		localStorage.setItem('history', JSON.stringify(history));
	}
}

function retrieveData(location) {
	resolveAddress(location)
		.then(data => document.getElementById('locationname').innerHTML = data);
	retrieveWeather(location)
		.then(data => updateHTML(data));
}

async function resolveAddress(location) {
	let i, city, state;
	const lat = location.lat;
	const long = location.lng;
	const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;

	try {
		const response = await fetch(url);
		const data = await response.json();

		// Find city and state in a City, ST format
		for (i = 0; i < data.results[0].address_components.length; i++) {
			let component = data.results[0].address_components[i];
		
			switch(component.types[0]) {
				case 'locality':
					city = component.long_name;
					break;
				case 'administrative_area_level_1':
					state = component.long_name;
					break;
			}
		}

		return (city + ', ' + state);
	} catch(e) {
		console.log(e);
		return 'Unknown Location';
	}
}