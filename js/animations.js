document.addEventListener('DOMContentLoaded', function(event) {
	let screenWidth = window.screen.availWidth;

	initExpand();

	if (screenWidth < 768) {
		const controller = new ScrollMagic.Controller();
		const fadeInTimeline = new TimelineMax();
		const headerTimeline = new TimelineMax();

		const shadeFadeInFrom = TweenMax.from("#mobileshade", 2, {
			autoAlpha: 0
		});

		const shadeFadeInTo = TweenMax.to("#mobileshade", 2, {
			autoAlpha: 1
		});

		const headerFadeInFrom = TweenMax.from("#weatherheader", 1, {
			paddingTop: '18px',
			borderRadius: '13px 13px 0px 0px',
			boxShadow: 'none'
		});
		
		const headerFadeInTo = TweenMax.to("#weatherheader", 1, {
			paddingTop: '66px',
			borderRadius: '0px 0px 0px 0px',
			boxShadow: '0 4px 8px -4px rgb(20, 20, 20)'
		});

		fadeInTimeline
			.add(shadeFadeInFrom)
			.add(shadeFadeInTo);

		headerTimeline
			.add(headerFadeInFrom)
			.add(headerFadeInTo);

		// Scene for background shade on scroll
		new ScrollMagic.Scene({
			triggerElement: '#currently',
			triggerHook: 'onEnter',
			offset: -270,
		})
		.setTween(fadeInTimeline)
		.duration(900)
		.addTo(controller);

		// Scene for weather header on scroll
		new ScrollMagic.Scene({
			triggerElement: '#weatherheader',
			triggerHook: 0,
			offset: -190,
		})
		.setTween(headerTimeline)
		.duration(150)
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
			zenscroll.setup(null, 17);
			
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