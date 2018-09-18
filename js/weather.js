var settingsOpen = false;

document.addEventListener('DOMContentLoaded', function(event) {
	initSwitchHandler('temp');
	initSwitchHandler('speed');

	document.getElementById('settingsbutton').addEventListener('click', function() {
		toggleSettings();
	});

	document.getElementById('history').addEventListener('click', function() {
		toggleMenu();
	});
});

function checkUnitSettings(element) {
	let position = localStorage.getItem(element + 'Unit');

	if (position == 1) {
		document.getElementById(element + 'switch').style.transform = 'translateX(14px)';
	}

	return position;
}

function initSwitchHandler(element) {
	// 0 indicates left position, 1 indicates right position
	let position = checkUnitSettings(element);

	document.getElementById(element + 'toggle').addEventListener('click', function() {
		if (position == 0) {
			position = 1;
			document.getElementById(element + 'switch').style.animation = 'switchRight .1s ease forwards';
		} else {
			position = 0;
			document.getElementById(element + 'switch').style.animation = 'switchLeft .1s ease forwards';
		}

		if (element === 'temp') {
			localStorage.setItem('tempUnit', position);
			updateTempUnits(position);
		} else {
			localStorage.setItem('speedUnit', position);
			updateSpeedUnits(position);
		}
	});
}

function updateTempUnits(position) {
	const unit = position === 0 ? 'F' : 'C';

	document.getElementById('currenttemp').innerHTML = convertTemp(document.getElementById('currenttemp').innerHTML, unit) + '°' + unit;
	document.getElementById('high').innerHTML = convertTemp(document.getElementById('high').innerHTML, unit) + '°';
	document.getElementById('low').innerHTML = convertTemp(document.getElementById('low').innerHTML, unit) + '°';
	document.getElementById('feelslike').innerHTML = convertTemp(document.getElementById('feelslike').innerHTML, unit) + '°';
	document.getElementById('dewpoint').innerHTML = convertTemp(document.getElementById('dewpoint').innerHTML, unit) + '°';

	for (let i = 1; i <= 10; ++i) {
		document.querySelector('#hour' + i + ' > .temp').innerHTML = convertTemp(document.querySelector('#hour' + i + ' > .temp').innerHTML, unit) + '°';
	}

	for (let i = 1; i <= 5; ++i) {
		document.querySelector('#day' + i + ' > .high').innerHTML = convertTemp(document.querySelector('#day' + i + ' > .high').innerHTML, unit) + '°';
		document.querySelector('#day' + i + ' > .low').innerHTML = convertTemp(document.querySelector('#day' + i + ' > .low').innerHTML, unit) + '°';
	}
}

function convertTemp(tempString, newUnit) {
	let result;
	const startTemp = parseInt(tempString.replace(/\D/g, ''));

	if (newUnit.toLowerCase() === 'c') {
		result = Math.round((startTemp - 32) * 5 / 9);
	} else if (newUnit.toLowerCase() === 'f') {
		result = Math.round((startTemp * 9 / 5) + 32);
	}

	return result;
}

function updateSpeedUnits(position) {
	const unit = position === 0 ? 'mph' : 'km/h';
	const HTMLcontent = document.getElementById('wind').innerHTML;
	const bearing = HTMLcontent.split(' ').pop();
	
	document.getElementById('wind').innerHTML = convertSpeed(document.getElementById('wind').innerHTML, unit) + ' ' + unit + ' ' + bearing;
}

function convertSpeed(speedString, newUnit) {
	let result;
	const startSpeed = parseInt(speedString.replace(/\D/g, ''));

	if (newUnit === 'km/h') {
		result = Math.round(startSpeed * 1.609344);
	} else if (newUnit === 'mph') {
		result = Math.round(startSpeed * 0.6213711922);
	}

	return result;
}

function toggleMenu() {
	if (document.getElementById('historycard').style.display !== 'block') {
		document.getElementById('historycard').style.display = 'block';
		document.getElementById('historycard').style.animation = 'historyIn .3s ease forwards';
	} else {
		if (settingsOpen) {
			toggleSettings();
		}
		document.getElementById('historycard').style.animation = 'historyOut .3s ease forwards';
		setTimeout(function() {
			document.getElementById('historycard').style.display = 'none';
		}, 300);
	}
}

function toggleSettings() {
	if (settingsOpen) {
		settingsOpen = false;
		document.getElementById('settings').style.animation = 'collapseSettings .2s ease forwards';
		document.getElementById('settingsbutton').style.animation = 'rotateClockwise .2s ease forwards';
	} else {
		settingsOpen = true;
		document.getElementById('settings').style.animation = 'expandSettings .2s ease forwards';
		document.getElementById('settingsbutton').style.animation = 'rotateCounterclockwise .2s ease forwards';
	}
}

function removeWelcome() {
	let screenWidth = window.screen.availWidth;

	if (screenWidth < 768) {
		document.getElementById('welcomecard').style.animation =  'welcomeDown .4s ease forwards';
	} else {
		document.getElementById('welcomecard').style.animation =  'welcomeOut .5s ease forwards';
	}

	setTimeout(function() { 
		document.getElementById('welcomecard').style.display = 'none';
	}, 400);

	displayLoading();
}

function removeWeather() {
	let screenWidth = window.screen.availWidth;

	if (screenWidth < 768) {
		document.getElementById('weather').style.animation =  'weatherDown .4s ease forwards';
	} else {
		let delay = 0;
		const nodes = document.querySelectorAll('#weather > div');

		setTimeout(function() {
			document.getElementById('weather').style.animation =  'welcomeOut .4s ease forwards';
		}, 135);

		// Fix error here
		for (let i = nodes.length; i >= 0; --i) {
			const element = nodes[i];
			setTimeout(function() {
				element.style.animation = 'welcomeOut .4s ease forwards';
			}, delay);
			delay += 60;
		}
	}

	displayLoading();
}

function displayLoading() {
	zenscroll.toY(0);
	document.getElementById('loadingcard').style.display = 'flex';
	document.getElementById('loadingcard').style.animation = 'loadingUp .4s ease .4s forwards';
	if (document.getElementById('historycard').style.display === 'block') {
		toggleMenu();
	}
}

function displayWeather() {
	let screenWidth = window.screen.availWidth;
	document.getElementById('weather').style.display = 'block';

	if (screenWidth < 768) {
		document.getElementById('weather').style.animation =  'weatherUp .5s ease .4s forwards';
		setTimeout(function() {
			zenscroll.to(document.getElementById('locationname'));
		}, 370);
	} else {
		let delay = 400;
		const nodes = document.querySelectorAll('#weather > div');

		document.getElementById('weather').style.animation =  'welcomeIn .5s ease .4s forwards';

		for (let i = 0; i < nodes.length; ++i) {
			const element = nodes[i];
			setTimeout(function() {
				element.style.animation = 'welcomeIn .5s ease forwards';
			}, delay);
			delay += 60;
		}
	}
}

async function retrieveWeather(location) {
	const lat = location.lat;
	const long = location.lng;
    const weatherKey = '014160f48f5c2882a6f60dcbeb59425e';
	const weatherUrl = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + weatherKey + '/' + lat + ',' + long;
	const response = await fetch(weatherUrl);
	const data = await response.json();
	return data;
}

function updateHTML(data) {
	let alertsOpen = false;
	const tempUnit = localStorage.getItem('tempUnit');
	const speedUnit = localStorage.getItem('speedUnit');

	if (data.alerts) {
		document.getElementById('alertstitle').innerHTML = data.alerts[0].title;
		document.getElementById('alertscontent').innerHTML = data.alerts[0].description;
		document.getElementById('alertsbutton').style.display = 'flex';
		document.getElementById('alertsbutton').onclick = function() {
			if (!alertsOpen) {
				alertsOpen = true;
				document.getElementById('alertscard').style.animation = 'expandSettings .2s ease forwards';
			} else {
				alertsOpen = false;
				document.getElementById('alertscard').style.animation = 'collapseSettings .2s ease forwards';
			}
		}
	} else {
		document.getElementById('alertsbutton').style.display = 'none';
		document.getElementById('alertscard').style.display = 'none';
	}

	if (data.minutely) {
		document.getElementById('conditions').innerHTML = data.minutely.summary;
	} else {
		document.getElementById('conditions').innerHTML = data.currently.summary;
	}

	if (tempUnit == 1) {
		document.getElementById('currenttemp').innerHTML = convertHTMLTempToC(Math.round(data.currently.temperature)) + '°C';
		document.getElementById('high').innerHTML = convertHTMLTempToC(Math.round(data.daily.data[0].temperatureHigh)) + '°';
		document.getElementById('low').innerHTML = convertHTMLTempToC(Math.round(data.daily.data[0].temperatureLow)) + '°';
		document.getElementById('feelslike').innerHTML = convertHTMLTempToC(Math.round(data.currently.apparentTemperature)) + '°';
		document.getElementById('dewpoint').innerHTML = convertHTMLTempToC(Math.round(data.currently.dewPoint)) + '°';
	} else {
		document.getElementById('currenttemp').innerHTML = Math.round(data.currently.temperature) + '°F';
		document.getElementById('high').innerHTML = Math.round(data.daily.data[0].temperatureHigh) + '°';
		document.getElementById('low').innerHTML = Math.round(data.daily.data[0].temperatureLow) + '°';
		document.getElementById('feelslike').innerHTML = Math.round(data.currently.apparentTemperature) + '°';
		document.getElementById('dewpoint').innerHTML = Math.round(data.currently.dewPoint) + '°';
	}

	if (speedUnit == 1) {
		document.getElementById('wind').innerHTML = convertHTMLSpeedToKmh(data.currently.windSpeed) + ' km/h ' + getWindDirection(data.currently.windBearing);
	} else {
		document.getElementById('wind').innerHTML = Math.round(data.currently.windSpeed) + ' mph ' + getWindDirection(data.currently.windBearing);
	}

	document.getElementById('currenticon').src = 'img/' + data.currently.icon + '.png';
	document.getElementById('humidity').innerHTML = Math.round(data.currently.humidity * 100) + '%';
	document.getElementById('pressure').innerHTML = Math.round(data.currently.pressure) + ' mb';
	document.getElementById('uvindex').innerHTML = data.currently.uvIndex;
	document.getElementById('chanceprecip').innerHTML = Math.round(data.currently.precipProbability * 100) + '%';
	document.getElementById('sunrise').innerHTML = getTime(data.daily.data[0].sunriseTime, true);
	document.getElementById('sunset').innerHTML = getTime(data.daily.data[0].sunsetTime, true);

	for (let i = 1; i <= 5; ++i) {
		document.querySelector('#hour' + i + ' > .time').innerHTML = getTime(data.hourly.data[i].time);
		document.querySelector('#hour' + i + ' > img').src = 'img/' + data.hourly.data[i].icon + '.png';

		if (tempUnit == 1) {
			document.querySelector('#hour' + i + ' > .temp').innerHTML = convertHTMLTempToC(Math.round(data.hourly.data[i].temperature)) + '°';
		} else {
			document.querySelector('#hour' + i + ' > .temp').innerHTML = Math.round(data.hourly.data[i].temperature) + '°';
		}
	}

	for (let i = 1; i <= 5; ++i) {
		document.querySelector('#day' + i + ' > .time').innerHTML = getDayOfWeek(data.daily.data[i].time);
		document.querySelector('#day' + i + ' > img').src = 'img/' + data.daily.data[i].icon + '.png';
		if (tempUnit == 1) {
			document.querySelector('#day' + i + ' > .high').innerHTML = convertHTMLTempToC(Math.round(data.daily.data[i].temperatureHigh)) + '°';
			document.querySelector('#day' + i + ' > .low').innerHTML = convertHTMLTempToC(Math.round(data.daily.data[i].temperatureLow)) + '°';
		} else {
			document.querySelector('#day' + i + ' > .high').innerHTML = Math.round(data.daily.data[i].temperatureHigh) + '°';
			document.querySelector('#day' + i + ' > .low').innerHTML = Math.round(data.daily.data[i].temperatureLow) + '°';
		}
	}

	removeLoading();
	displayWeather();
}

function convertHTMLTempToC(tempInF) {
	return Math.round((tempInF - 32) * 5 / 9);
}

function convertHTMLSpeedToKmh(tempInMph) {
	return Math.round(tempInMph * 1.609344);
}

function removeLoading() {
	document.getElementById('loadingcard').style.animation = 'loadingDown .4s ease forwards';
	setTimeout(function() {
		document.getElementById('loadingcard').style.display = 'none';
	}, 400);
}

// Return time of day in 00:00 AM/PM format based off time retrieved from JSON data
function getTime(unixTime, includeMeridiem = false) {

	// Convert from milliseconds to seconds
	const jsTime = new Date(unixTime * 1000);
	let hour = 0;
	let meridiem = '';
	let time = '';

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
	if (includeMeridiem) {
		time = hour + ':' + min + ' ' + meridiem;
	} else {
		time = hour + ':' + min;
	}

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
