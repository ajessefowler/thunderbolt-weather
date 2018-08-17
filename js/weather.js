document.addEventListener('DOMContentLoaded', function(event) {
	document.getElementById('closewelcome').addEventListener('click', function() {
		document.getElementById('welcomecard').style.animation =  'welcomeDown .6s ease forwards';
	});
	
	document.getElementById('dailyexpand').addEventListener('click', function() {
		const element = document.getElementById('dailycontenthidden');
		
		if (element.style.display === 'none') {
			element.style.display = 'flex';
			document.getElementById('dailyexpandbutton').style.animation = 'rotateDown .3s ease forwards';
		} else {
			element.style.display = 'none';
			document.getElementById('dailyexpandbutton').style.animation = 'rotateUp .3s ease forwards';
		}
	});
});

function closeIntro() {
	document.getElementById('welcomecard').style.animation =  'welcomeDown .6s ease forwards';
}

function loadWeather() {
	document.getElementById('weather').style.animation =  'weatherUp .5s ease .8s forwards';
}

async function getWeather(location) {
	const lat = location.lat();
	const long = location.lng();
    const weatherKey = '014160f48f5c2882a6f60dcbeb59425e';
	const weatherUrl = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + weatherKey + '/' + lat + ',' + long;
	const response = await fetch(weatherUrl);
	const data = await response.json();
	return data;
}

function updatePage(data) {
	if (data.minutely) {
		document.getElementById('conditions').innerHTML = data.minutely.summary;
	} else {
		document.getElementById('conditions').innerHTML = data.currently.summary;
	}
	document.getElementById('currenttemp').innerHTML = Math.round(data.currently.temperature) + '°F';
	document.getElementById('currenticon').src = 'img/' + data.currently.icon + '.png';
}

// Return time of day in 00:00 AM/PM format based off time retrieved from JSON data
function getTime(unixTime) {

	// Convert from milliseconds to seconds
	const jsTime = new Date(unixTime * 1000);
	let hour = 0;
	let meridiem = '';

	switch (jsTime.getHours()) {

		case 0:
			hour = 12;
			meridiem = 'AM';
			break;
			
		case 12:
			hour = 12;
			meridiem = 'PM';
			break;

		default:
			if (jsTime.getHours() < 12) {
				hour = jsTime.getHours();
				meridiem = 'AM';
				
			} else {
				hour = (jsTime.getHours() - 12);
				meridiem = 'PM';
			}
	}

	const min = jsTime.getMinutes() < 10 ? '0' + jsTime.getMinutes() : jsTime.getMinutes();
	const time = hour + ':' + min + ' ' + meridiem;

	return time;
}

// Return day of the week based off JSON data
function getDayOfWeek(unixTime) {

	// Convert from milliseconds to seconds
	const jsTime = new Date(unixTime * 1000);
	let day = '';

	switch (jsTime.getDay()) {

		case 0:
			day = 'Sun';
			break;

		case 1:
			day = 'Mon';
			break;

		case 2:
			day = 'Tue';
			break;

		case 3:
			day = 'Wed';
			break;

		case 4:
			day = 'Thu';
			break;

		case 5:
			day = 'Fri';
			break;

		case 6:
			day = 'Sat';
			break;
			
		default:
			console.log('Day of week could not be retrieved.');
	}

	return day;
}

// Return the wind direction
function getWindDirection(angle) {
	const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	return directions[Math.floor(((angle + (360 / 16) / 2) % 360) / (360 / 16))];
}
