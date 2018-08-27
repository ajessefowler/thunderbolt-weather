document.addEventListener('DOMContentLoaded', function(event) {
	let historyOpen = false;
	
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

	// Prepare ScrollMagic
	const controller = new ScrollMagic.Controller();

	var fadeInTimeline = new TimelineMax();
	var fadeInFrom = TweenMax.from("#mobileshade", 1, {
		autoAlpha: 0
	});
	var fadeInTo = TweenMax.to("#mobileshade", 1, {
		autoAlpha: 1
	});
	fadeInTimeline
		.add(fadeInFrom)
		.add(fadeInTo);

	new ScrollMagic.Scene({
		triggerElement: "#currently",
		triggerHook: "onEnter",
		offset: -250,
	})
	.setTween(fadeInTimeline)
	.duration(500)
	//    .reverse(false)
	//.addIndicators() // add indicators (requires plugin)
	.addTo(controller);
});

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