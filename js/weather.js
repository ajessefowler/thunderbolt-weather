document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('closewelcome').addEventListener('click', function() {
		removeWelcome();
	});
});

function removeWelcome() {
	let screenWidth = window.screen.availWidth;

	if (screenWidth < 768) {
		document.getElementById('welcomecard').style.animation =  'welcomeDown .6s ease forwards';
	} else {
		document.getElementById('welcomecard').style.animation =  'welcomeOut .4s ease forwards';
	}

	setTimeout(function() { 
		document.getElementById('welcomecard').style.display = 'none';
	}, 600);
}

function removeWeather() {
	let screenWidth = window.screen.availWidth;

	if (screenWidth < 768) {
		document.getElementById('weather').style.animation =  'weatherDown .5s ease forwards';
	} else {
		let delay = 0;
		const nodes = document.querySelectorAll('#weather > div');

		for (let i = nodes.length; i >= 0; --i) {
			const element = nodes[i];
			setTimeout(function() {
				element.style.animation = 'welcomeOut .5s ease forwards';
			}, delay);
			delay += 60;
		}
	}
}

function displayWeather() {
	let screenWidth = window.screen.availWidth;
	document.getElementById('weather').style.display = 'block';

	if (screenWidth < 768) {
		document.getElementById('weather').style.animation =  'weatherUp .5s ease forwards';
	} else {
		let delay = 500;
		const nodes = document.querySelectorAll('#weather > div');

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
	console.log(data);
	return data;
}

function updateHTML(data) {
	if (data.minutely) {
		document.getElementById('conditions').innerHTML = data.minutely.summary;
	} else {
		document.getElementById('conditions').innerHTML = data.currently.summary;
	}
	document.getElementById('currenttemp').innerHTML = Math.round(data.currently.temperature) + '°F';
	document.getElementById('high').innerHTML = Math.round(data.daily.data[0].temperatureHigh) + '°';
	document.getElementById('low').innerHTML = Math.round(data.daily.data[0].temperatureLow) + '°';
	document.getElementById('currenticon').src = 'img/' + data.currently.icon + '.png';

	document.getElementById('wind').innerHTML = Math.round(data.currently.windSpeed) + ' mph ' + getWindDirection(data.currently.windBearing)
	document.getElementById('feelslike').innerHTML = Math.round(data.currently.apparentTemperature) + '°F';
	document.getElementById('humidity').innerHTML = Math.round(data.currently.humidity * 100) + '%';
	document.getElementById('dewpoint').innerHTML = Math.round(data.currently.dewPoint) + '°';
	document.getElementById('pressure').innerHTML = Math.round(data.currently.pressure) + ' mb';
	document.getElementById('uvindex').innerHTML = data.currently.uvIndex;
	document.getElementById('sunrise').innerHTML = getTime(data.daily.data[0].sunriseTime, true);
	document.getElementById('sunset').innerHTML = getTime(data.daily.data[0].sunsetTime, true);

	for (let i = 1; i <= 10; ++i) {
		document.querySelector('#hour' + i + ' > .time').innerHTML = getTime(data.hourly.data[i].time);
		document.querySelector('#hour' + i + ' > img').src = 'img/' + data.hourly.data[i].icon + '.png';
		document.querySelector('#hour' + i + ' > .temp').innerHTML = Math.round(data.hourly.data[i].temperature) + '°';
	}

	for (let i = 1; i <= 5; ++i) {
		document.querySelector('#day' + i + ' > .time').innerHTML = getDayOfWeek(data.daily.data[i].time);
		document.querySelector('#day' + i + ' > img').src = 'img/' + data.daily.data[i].icon + '.png';
		document.querySelector('#day' + i + ' > .high').innerHTML = Math.round(data.daily.data[i].temperatureHigh) + '°';
		document.querySelector('#day' + i + ' > .low').innerHTML = Math.round(data.daily.data[i].temperatureLow) + '°';
	}

	displayWeather();
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
