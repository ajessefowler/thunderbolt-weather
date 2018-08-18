document.addEventListener('DOMContentLoaded', function(event) {
	document.getElementById('closewelcome').addEventListener('click', function() {
		document.getElementById('welcomecard').style.animation =  'welcomeDown .6s ease forwards';
	});
    
    initExpand('current');
    initExpand('hourly');
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