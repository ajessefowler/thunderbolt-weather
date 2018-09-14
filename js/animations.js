document.addEventListener('DOMContentLoaded', function(event) {
	let screenWidth = window.screen.availWidth;
	
    initExpand('current');
	initExpand('hourly');

	if (screenWidth < 768) {
		// Prepare ScrollMagic
		const controller = new ScrollMagic.Controller();
		const fadeInTimeline = new TimelineMax();
		const arrowTimeline = new TimelineMax();
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
		const leftArrowFrom = TweenMax.from('#leftarrow', 2, {
			transform: 'rotate(-40deg)'
		});
		const leftArrowTo = TweenMax.to('#leftarrow', 2, {
			transform: 'rotate(40deg)'
		});
		const rightArrowFrom = TweenMax.from('#rightarrow', 2, {
			transform: 'rotate(40deg)'
		});
		const rightArrowTo = TweenMax.to('#rightarrow', 2, {
			transform: 'rotate(-40deg)'
		});

		fadeInTimeline
			.add(shadeFadeInFrom)
			.add(shadeFadeInTo)
			.add(bgFadeInFrom, '-=1.6')
			.add(bgFadeInTo, '-=1.6');

		arrowTimeline
			.add(leftArrowFrom)
			.add(leftArrowTo)
			.add(rightArrowFrom, '-=3.5')
			.add(rightArrowTo, '-=3.5');

		new ScrollMagic.Scene({
			triggerElement: '#currently',
			triggerHook: 'onEnter',
			offset: -270,
		})
		.setTween(fadeInTimeline)
		.duration(700)
		.addTo(controller);

		new ScrollMagic.Scene({
			triggerElement: '#currentcontent',
			triggerHook: 'onCenter',
			offset: 70
		})
		.setTween(arrowTimeline)
		.duration(5)
		.addTo(controller);

		// Add scroll function to location name
		document.getElementById('weatherheader').addEventListener('click', function() {
			zenscroll.to(document.getElementById('locationname'));
		});
	}
});

function initExpand(element) {
    const div = document.getElementById(element + 'contenthidden');
    let isOpen = false;
        
    document.getElementById(element + 'expand').addEventListener('click', function() {
		if (!isOpen) {
			isOpen = true;
			div.style.display = 'flex';
		} else {
			isOpen = false;
			div.style.display = 'none';
		}
	});
}