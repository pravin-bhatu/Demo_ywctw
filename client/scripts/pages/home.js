//========== Home page scroller ==========
var pageHome = $('#page-home');

var BackgroundScroll = function(params) {
	params = $.extend({
		scrollSpeed: 35,
		imageWidth: $('#page-home').width(),
		imageHeight: $('#page-home').height()
	}, params);

	var step = 1,
		current = 0,
		stopPosition = - (params.imageHeight);

	var scroll = function() {
		current -= step;
		pageHome.css('backgroundPosition', '0 ' + current + 'px');
	};

	this.init = function() {
		setInterval(scroll, params.scrollSpeed);
	};
};

exports.scroll = new BackgroundScroll();
