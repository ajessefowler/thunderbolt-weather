document.addEventListener('DOMContentLoaded', initMap);

function initMap() {

	let markers = [];
	let screenWidth = window.screen.availWidth;

	const map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 39.5, lng: -98.35 },
		mapTypeId: 'terrain',
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false
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

	function placeMarker(location) {
		closeIntro();
		resolveAddress(location)
			.then(data => document.getElementById('locationname').innerHTML = data);
		getWeather(location)
			.then(data => updatePage(data));

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

		const countryRestriction = { componentRestrictions: { country: 'us' }};

		// Autocomplete and listener for main search bar
		const autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationsearch'), countryRestriction);
		autocomplete.bindTo('bounds', map)
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			document.getElementById('locationsearch').blur();
		});

		function resolveLocation(element) {
			const place = element.getPlace();
			const lat = place.geometry.location.lat();
			const long = place.geometry.location.lng();
			const city = place.address_components[3].long_name;
			const state = place.address_components[5].long_name;
			const location = new Location(city, state, lat, long);
			return location;
		}
}

async function resolveAddress(location) {
	const lat = location.lat();
	const long = location.lng();
	const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);
	const city = data.results[0].address_components[3].long_name;
	const state = data.results[0].address_components[5].long_name;
	return (city + ', ' + state);
}
