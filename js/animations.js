document.addEventListener('DOMContentLoaded', function(event) {
	let historyOpen = false;
	let screenWidth = window.screen.availWidth;
	
    initExpand('current');
	initExpand('hourly');
	
	document.getElementById('history').addEventListener('click', function() {
		if (!historyOpen) {
			historyOpen = true;
			document.getElementById('historycard').style.animation = 'historyIn .4s ease forwards';
		} else {
			historyOpen = false;
			document.getElementById('historycard').style.animation = 'historyOut .4s ease forwards';
		}
	});
});

function initScrollMagic() {
	// Prepare ScrollMagic
	const controller = new ScrollMagic.Controller();
	const fadeInTimeline = new TimelineMax();
	const shadeFadeInFrom = TweenMax.from("#mobileshade", 2, {
		autoAlpha: 0
	});
	const shadeFadeInTo = TweenMax.to("#mobileshade", 2, {
		autoAlpha: 1
	});
	const bgFadeInFrom = TweenMax.from("#weather", 2, {
		backgroundColor: 'rgba(20, 20, 20, 0.9)',
		boxShadow: '0 -5px 14px -3px rgba(43, 43, 43, 1)'
	});
	const bgFadeInTo = TweenMax.to("#weather", 2, {
		backgroundColor: 'rgba(20, 20, 20, 0.0)',
		boxShadow: '0 -5px 14px -3px rgba(43, 43, 43, 0)'
	});

	fadeInTimeline
		.add(shadeFadeInFrom)
		.add(shadeFadeInTo)
		.add(bgFadeInFrom, '-=1.6')
		.add(bgFadeInTo, '-=1.6');

	new ScrollMagic.Scene({
		triggerElement: "#currently",
		triggerHook: "onEnter",
		offset: -270,
	})
	.setTween(fadeInTimeline)
	.duration(700)
	.addTo(controller);
}

function initExpand(element) {
    const div = document.getElementById(element + 'contenthidden');
    let isOpen = false;
        
    document.getElementById(element + 'expand').addEventListener('click', function() {
		if (!isOpen) {
			isOpen = true;
			div.style.display = 'flex';
			document.getElementById(element + 'expandbutton').style.animation = 'rotateDown .3s ease forwards';
		} else {
			isOpen = false;
			div.style.display = 'none';
			document.getElementById(element + 'expandbutton').style.animation = 'rotateUp .3s ease forwards';
		}
	});
}