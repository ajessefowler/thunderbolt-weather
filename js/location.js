document.addEventListener('DOMContentLoaded', initLocation);

function initLocation() {

	let centerCoords;
	let interval;
	let markers = [];
	let screenWidth = window.screen.availWidth;
	let radarIsPlaying = false;
	let weatherLoaded = false;
	const countryRestriction = { componentRestrictions: { country: 'us' }};
	const autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationsearch'), countryRestriction);

	let history = JSON.parse(localStorage.getItem('history')) || [];
	let defaultLocation = JSON.parse(localStorage.getItem('defaultlocation')) || null;

	if (history.length > 0) {
		updateHistoryMenu();
	}

	if (screenWidth < 768) {
		centerCoords = { lat: 34, lng: -96 };
	} else {
		centerCoords = { lat: 39.5, lng: -117 };
	}

	const map = new google.maps.Map(document.getElementById('map'), {
		center: centerCoords,
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false,
		gestureHandling: 'greedy'
	});

	if (screenWidth < 768) {
		map.setZoom(3.1);
	} else {
		map.setZoom(4.0);
	}
	
	if (defaultLocation !== null) {
		weatherLoaded = true;
		updateLocation(defaultLocation, false);
		createDefaultNode(defaultLocation);
		document.getElementById('defaultinstructions').style.display = 'none';
	} else {
		if (screenWidth < 768) {
			document.getElementById('welcomecard').style.animation = 'welcomeUp .6s ease .3s forwards';
		} else {
			document.getElementById('welcomecard').style.animation = 'welcomeIn .5s ease .5s forwards';
		}
	}

	getRadarImages();

	document.getElementById('radarcontrol').addEventListener('click', function() {
		toggleRadar();
	});

	function getRadarImages() {
		const radar = new google.maps.ImageMapType ({
			getTileUrl: function(tile, zoom) {
				return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
			},
			tileSize: new google.maps.Size(256, 256),
			opacity: 0.60,
			name: 'NEXRAD',
			isPng: true
		});
	
		const radar5 = new google.maps.ImageMapType ({
			getTileUrl: function(tile, zoom) {
				return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913-m05m/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
			},
			tileSize: new google.maps.Size(256, 256),
			opacity: 0.00,
			name: 'NEXRAD',
			isPng: true
		});
	
		const radar10 = new google.maps.ImageMapType ({
			getTileUrl: function(tile, zoom) {
				return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913-m10m/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
			},
			tileSize: new google.maps.Size(256, 256),
			opacity: 0.00,
			name: 'NEXRAD',
			isPng: true
		});
	
		const radar15 = new google.maps.ImageMapType ({
			getTileUrl: function(tile, zoom) {
				return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913-m15m/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
			},
			tileSize: new google.maps.Size(256, 256),
			opacity: 0.00,
			name: 'NEXRAD',
			isPng: true
		});
	
		const radar20 = new google.maps.ImageMapType ({
			getTileUrl: function(tile, zoom) {
				return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913-m20m/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
			},
			tileSize: new google.maps.Size(256, 256),
			opacity: 0.00,
			name: 'NEXRAD',
			isPng: true
		});
	
		const radar25 = new google.maps.ImageMapType ({
			getTileUrl: function(tile, zoom) {
				return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913-m25m/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
			},
			tileSize: new google.maps.Size(256, 256),
			opacity: 0.00,
			name: 'NEXRAD',
			isPng: true
		});
	
		const radar30 = new google.maps.ImageMapType ({
			getTileUrl: function(tile, zoom) {
				return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913-m30m/' + zoom + '/' + tile.x + '/' + tile.y + '.png?' + (new Date()).getTime();
			},
			tileSize: new google.maps.Size(256, 256),
			opacity: 0.00,
			name: 'NEXRAD',
			isPng: true
		});

		map.overlayMapTypes.push(radar);
		map.overlayMapTypes.push(radar5);
		map.overlayMapTypes.push(radar10);
		map.overlayMapTypes.push(radar15);
		map.overlayMapTypes.push(radar20);
		map.overlayMapTypes.push(radar25);
		map.overlayMapTypes.push(radar30);
	}

	function toggleRadar() {
		if (!radarIsPlaying) {
			radarIsPlaying = true;
			document.getElementById('radarcontrolicon').innerHTML = 'pause';

			let index = map.overlayMapTypes.getLength() - 1;

			map.overlayMapTypes.getAt(0).setOpacity(0.00);

			interval = window.setInterval(function() {
				map.overlayMapTypes.getAt(index).setOpacity(0.00);

				index--;
				
				if (index < 0) {
					index = map.overlayMapTypes.getLength() - 1;
				}

				map.overlayMapTypes.getAt(index).setOpacity(0.60);
			}, 400);
		} else {
			radarIsPlaying = false;
			document.getElementById('radarcontrolicon').innerHTML = 'play_arrow';

			clearInterval(interval);

			for (let i = 1; i < map.overlayMapTypes.getLength() - 1; i++) {
				map.overlayMapTypes.getAt(i).setOpacity(0.00);
			}
	
			map.overlayMapTypes.getAt(0).setOpacity(0.60);
		}
	}
	
	google.maps.event.addListener(map, 'click', function(event) {
		let location;

		resolveAddress({lat: event.latLng.lat(), lng: event.latLng.lng()})
			.then(function(locationInfo) {
				location = {
					lat: event.latLng.lat(),
					lng: event.latLng.lng(),
					address: locationInfo.address,
					city: locationInfo.city,
					state: locationInfo.state
				}

				updateLocation(location);
			});
	});

	function updateLocation(location, addToHistory = true) {
		if (!weatherLoaded) {
			removeWelcome();
			setTimeout(function() { retrieveData(location) }, 700);
		} else {
			removeWeather();
			setTimeout(function() { retrieveData(location) }, 1000);
		}

		setTimeout(function() {
			document.getElementById('locationname').innerHTML = location.city + ', ' + location.state;
			
			// Increase top of elements to make room for for taller header
			if (screenWidth < 768) {
				if (document.getElementById('weatherheader').scrollHeight > 62) {
					document.getElementById('current').style.top = '159px';
					document.getElementById('hourly').style.top = '234px';
					document.getElementById('daily').style.top = '304px';
				} else {
					document.getElementById('current').style.top = '115px';
					document.getElementById('hourly').style.top = '190px';
					document.getElementById('daily').style.top = '260px';
				}
			}
		}, 400);

		weatherLoaded = true;
		
		if (addToHistory && !isDuplicateLocation(location.address)) {
			history.push(location);
			updateLocalStorage();
		} else if (addToHistory && isDuplicateLocation(location.address)) {
			const index = getDuplicateIndex(location.address);

			if (index !== (history.length - 1)) {
				history.push(history.splice(index, 1)[0]);
				updateLocalStorage();
			}
		}

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
		resolveLocation(autocomplete);
		document.getElementById('locationsearch').blur();
	});

	function resolveLocation(element) {
		let location;
		const place = element.getPlace();

		resolveAddress({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})
			.then(function(locationInfo) {
				location = {
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng(),
					address: locationInfo.address,
					city: locationInfo.city,
					state: locationInfo.state
				}

				updateLocation(location);
			});
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
		let location;

		resolveAddress({lat: position.coords.latitude, lng: position.coords.longitude})
			.then(function(locationInfo) {
				location = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					address: locationInfo.address,
					city: locationInfo.city,
					state: locationInfo.state
				}

				updateLocation(location);
			});
	}

	// Alert user when their location cannot be found
	function locationError() {
		alert('Unable to retrieve location.');
	}

	function updateLocalStorage() {
		localStorage.setItem('history', JSON.stringify(history));
		updateHistoryMenu();
	}

	// Update history menu when updating local storage
	function updateHistoryMenu() {
		let i;
		const items = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
		const historyNode = document.getElementById('locationhistory');

		// Remove current items from history menu
		while (historyNode.lastChild) {
			historyNode.removeChild(historyNode.lastChild);
		}

		if (items.length === 0) {
			displayEmptyHistory();
		} else {
			// Get address for each item
			for (i = items.length - 1; i >= 0; i--) {
				const location = items[i];
				const index = i;
				const div = document.createElement('div');
				const locationName = document.createElement('p');
				const icon = document.createElement('i');
					
				div.classList.add('historyitem');
				locationName.appendChild(document.createTextNode(items[i].address));
				icon.classList.add('material-icons');
				icon.innerHTML = 'favorite_border';
	
				div.addEventListener('click', function() {
					updateLocation(location);
				});
	
				icon.addEventListener('click', function(event) {
					event.stopPropagation();
					setAsDefault(location, index);
				});
					
				div.appendChild(locationName);
				div.appendChild(icon);
					
				document.getElementById('locationhistory').appendChild(div);
			}
		}
	}

	document.getElementById('clearhistory').addEventListener('click', function() {
		localStorage.removeItem('history');
		history = [];
		updateHistoryMenu();
	});

	function displayEmptyHistory() {
		const element = document.createElement('p');
		element.appendChild(document.createTextNode('No previous locations.'));
		element.id = 'emptyhistory';
		document.getElementById('locationhistory').appendChild(element);
	}

	function setAsDefault(location, index) {
		history.splice(index, 1);
		updateLocalStorage();
		if (defaultLocation !== null) {
			removeAsDefault(defaultLocation);
		}
		document.getElementById('defaultinstructions').style.display = 'none';
		defaultLocation = location;
		localStorage.setItem('defaultlocation', JSON.stringify(location));
		createDefaultNode(location);
	}

	function removeDefaultNode() {
		const defaultNode = document.getElementById('defaultlocation');
		defaultNode.removeChild(defaultNode.lastChild);
		document.getElementById('defaultinstructions').style.display = 'block';
	}

	function removeAsDefault(location) {
		defaultLocation = null;
		localStorage.setItem('defaultlocation', null);
		removeDefaultNode();

		history.push(location);
		updateLocalStorage();
	}

	function isDuplicateLocation(address) {
		let i;
		let isDuplicate = false;

		for (i = 0; i < history.length; i++) {
			if (history[i].address === address) {
				isDuplicate = true;
				break;
			}
		}

		if (defaultLocation && defaultLocation.address === address) {
			isDuplicate = true;
		}

		return isDuplicate;
	}

	function getDuplicateIndex(address) {
		let i, index;

		for (i = 0; i < history.length; i++) {
			if (history[i].address === address) {
				index = i;
				break;
			}
		}

		return index;
	}

	function createDefaultNode(location) {
		const div = document.createElement('div');
		const locationName = document.createElement('p');
		const icon = document.createElement('i');

		div.classList.add('historyitem');
		div.classList.add('favorite');
		locationName.appendChild(document.createTextNode(location.address));
		icon.classList.add('material-icons');
		icon.innerHTML = 'favorite';

		div.addEventListener('click', function() {
			updateLocation(location, false);
		});

		icon.addEventListener('click', function(event) {
			event.stopPropagation();
			removeAsDefault(location);
		});

		div.appendChild(locationName);
		div.appendChild(icon);

		document.getElementById('defaultlocation').appendChild(div);
	}
}

function retrieveData(location) {
	retrieveWeather(location)
		.then(data => updateHTML(data));
}

async function resolveAddress(location) {
	let i, city, state, address;
	const lat = location.lat;
	const long = location.lng;
	const key = 'AIzaSyC2Mcoh2tL1KeJUbmn420w0lPvPclJJvMQ';
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + long + '&key=' + key;

	try {
		const response = await fetch(url);
		const data = await response.json();
		address = data.results[0].formatted_address;

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

		const locationObject = {
			city: city,
			state: state,
			address: address
		}

		return locationObject;
	} catch(e) {
		console.log(e);
		return 'Unknown Location';
	}
}