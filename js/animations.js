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