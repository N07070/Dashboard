/* jQuery MaterialRipple Plugin */
/* 2014 Dominik Biedebach */

$.fn.materialripple = function(options) {
	var defaults = {
		rippleClass: 'ripple-wrapper'
	}
	$.extend(defaults, options);

	$('body').on('animationend webkitAnimationEnd oAnimationEnd', '.' + defaults.rippleClass, function () {
    removeRippleElement(this);
});

	var addRippleElement = function(element, e) {
		$(element).append('<span class="added '+defaults.rippleClass+'"></span>');
		newRippleElement = $(element).find('.added');
		newRippleElement.removeClass('added');

		// get Mouse Position
		var mouseX = e.pageX;
		var mouseY = e.pageY;

		// for each ripple element, set sizes
		elementWidth = $(element).outerWidth();
		elementHeight = $(element).outerHeight();
		d = Math.max(elementWidth, elementHeight);
		newRippleElement.css({'width': d, 'height': d});

		var rippleX = e.clientX - $(element).offset().left - d/2 + $(window).scrollLeft();
		var rippleY = e.clientY - $(element).offset().top - d/2 + $(window).scrollTop();

		// Position the Ripple Element
		newRippleElement.css('top', rippleY+'px').css('left', rippleX+'px').addClass('animated');
	}

	var removeRippleElement = function($element) {
		$element.remove();
	}

	// add Ripple-Wrapper to all Elements
	$(this).addClass('has-ripple');

	// Let it ripple on click
	$(this).bind('click', function(e){
		console.log("RIPPLE ME!");
		addRippleElement(this, e);
	});
}
