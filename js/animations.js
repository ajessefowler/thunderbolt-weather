document.addEventListener('DOMContentLoaded', function(event) {
	let screenWidth = window.screen.availWidth;
	zenscroll.setup(null, 56)
	
	initExpand();

	if (screenWidth < 768) {
		const controller = new ScrollMagic.Controller();
		const fadeInTimeline = new TimelineMax();

		const shadeFadeInFrom = TweenMax.from("#mobileshade", 2, {
			autoAlpha: 0
		});
		const shadeFadeInTo = TweenMax.to("#mobileshade", 2, {
			autoAlpha: 1
		});
		const headerFadeInFrom = TweenMax.from("#headershade", 2, {
			autoAlpha: 0
		});
		const headerFadeInTo = TweenMax.to("#headershade", 2, {
			autoAlpha: 0.9
		});

		fadeInTimeline
			.add(shadeFadeInFrom)
			.add(shadeFadeInTo)
			.add(headerFadeInFrom, '-=1.6')
			.add(headerFadeInTo, '-=1.6');

		new ScrollMagic.Scene({
			triggerElement: '#currently',
			triggerHook: 'onEnter',
			offset: -270,
		})
		.setTween(fadeInTimeline)
		.duration(700)
		.addTo(controller);

		// Make right part of arrow point down when weather reaches top of page
		new ScrollMagic.Scene({
			triggerElement: '#currentcontent',
			triggerHook: 'onCenter',
			offset: 70
		})
		.setClassToggle('#rightarrow', 'rightarrowdown')
		.addTo(controller);

		// Make left part of arrow point down when weather reaches top of page
		new ScrollMagic.Scene({
			triggerElement: '#currentcontent',
			triggerHook: 'onCenter',
			offset: 70
		})
		.setClassToggle('#leftarrow', 'leftarrowdown')
		.addTo(controller);

		// Add scroll function to weather header
		document.getElementById('weatherheader').addEventListener('click', function() {
			if (!document.getElementById('leftarrow').classList.contains('leftarrowdown')) {
				zenscroll.to(document.getElementById('locationname'));
			} else {
				zenscroll.toY(0);
			}
		});
	}
});

// Initialize the controls for expanding elements
function initExpand() {
	const div = document.getElementById('currentcontenthidden');
	const buttonText = document.querySelector('#currentexpand > h3');
	let isOpen = false;
        
    document.getElementById('currentexpand').addEventListener('click', function() {
		if (!isOpen) {
			isOpen = true;
			div.style.maxHeight = '300px';
			buttonText.innerHTML = 'COLLAPSE';
		} else {
			isOpen = false;
			div.style.maxHeight = null;
			buttonText.innerHTML = 'EXPAND';
		}
	});
}