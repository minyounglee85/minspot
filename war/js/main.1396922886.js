$(document).ready(function(){

// Set html class to User Agent to Target IE10 with CSS
var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);

// Add Select Easing Functions from jQuery UI
$.extend($.easing,
{
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        //alert($.easing.default);
        return $.easing[$.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

// Home Slideshow
$("body.home #featured ul").responsiveSlides({
	auto: true,
	pager: false,
	nav: true,
	speed: 500,
	timeout: 8000,
	prevText: "&#59237;",
	nextText: "&#59238;", 
	before: function () {
		// If we are seeing the 1st slide
		if ($("#" + this.namespace + "1_s0").hasClass(this.namespace + "1_on")) {
			// First slide started animating
			setTimeout( function(){ // Delay CSS reset until after the slide transition completes
				$('#rslides1_s0').removeClass('current');
			},500);
		}        
		// If we are seeing the 2nd slide
		if ($("#" + this.namespace + "1_s1").hasClass(this.namespace + "1_on")) {
			// First slide started animating
			setTimeout( function(){ // Delay CSS reset until after the slide transition completes
				$('#rslides1_s1').removeClass('current');
			},500);
		}      
		// If we are seeing the 2nd slide
		if ($("#" + this.namespace + "1_s2").hasClass(this.namespace + "1_on")) {
			// First slide started animating
			setTimeout( function(){ // Delay CSS reset until after the slide transition completes
				$('#rslides1_s2').removeClass('current');
			},500);
		}
	},
	after: function(){
		var currentSlide = $("." + this.namespace + "1_on").attr("id"); // Get currentSlide
		$('#'+currentSlide).addClass('current');
	}
});

// Hide Slideshow
$('#featured').css({ opacity: 0 });

// Hide Hero Images
$('body.work #featured, body.about #featured').css({ display: 'none' });

// If on smaller devices, set featured images to position absolute
var windowWidth = $(window).width();
if(windowWidth < 1025) {
	$('#featured').css({ position: 'absolute' });
}

// Lazy load of Images Triggered with Custom Function
$("img").lazyload({ 
    effect : "fadeIn",
    effectspeed: 1000,
    event : "scrollstop"
});

// Responsive Nav Toggle Button
var navActive = 0;
$('a.nav-toggle').click(function(e) {
	if(navActive === 0) {
		$('a.nav-toggle').html('&#10060;');
		navActive = 1;
	}
	else {
		$('a.nav-toggle').html('&#9776;');
		navActive = 0;
	}
    $('nav').slideToggle();
    e.preventDefault();
});

// Responsive Nav Visibility
function navVisibility(){ 
	var menu = $('nav');
    var w = $(window).width();
    if(w > 768 && menu.is(':hidden')) {
    	menu.removeAttr('style');
    }
}

// Reveal Contact Section
function revealContact() {
	var wt = $(window).scrollTop();
    var wb = wt + $(window).height();
    var s = $("#contact");
    var ost = (s.offset().top) + 181;
    
    if(ost < wb) {
	    s.addClass("reveal");
    }
    if(ost > wb) {
	    s.removeClass("reveal");
    }
}

// AJAX Contact Form: On Change Name Input
$('#name').change(function() {
	$.ajax({
    	type: 'POST',
    	url: '/includes/validate-ajax.php',
    	data: $("#contact-form").serialize(),
    	timeout: 5000,
    	success: function(data) {
			var $response=$(data); // Create jQuery object from the response HTML
			
			// Query the jQuery object for the values
			var responseName = $response.filter('#inputname').text();
    		
    		if (responseName == 'success') {
    			setTimeout( function(){ $("#nameinput").removeClass('error').addClass('success'); },500);
    		}
    		else {
    			setTimeout( function(){ $("#nameinput").removeClass('success').addClass('error'); },500);
    		}
    	}
	});
});

// AJAX Contact Form: On Change Sender Email Input
$('#senderemail').change(function() {
	$.ajax({
    	type: 'POST',
    	url: '/includes/validate-ajax.php',
    	data: $("#contact-form").serialize(),
    	timeout: 5000,
    	success: function(data) {
			var $response=$(data); // Create jQuery object from the response HTML
			
			// Query the jQuery object for the values
			var responseSenderEmail = $response.filter('#inputsenderemail').text();
    		
    		if (responseSenderEmail == 'success') {
    			setTimeout( function(){ $("#senderemailinput").removeClass('error').addClass('success'); },500);
    		}
    		else {
    			setTimeout( function(){ $("#senderemailinput").removeClass('success').addClass('error'); },500);
    		}
    	}
	});
});

// AJAX Contact Form: On Change Message Input
$('#message').change(function() {
	$.ajax({
    	type: 'POST',
    	url: '/includes/validate-ajax.php',
    	data: $("#contact-form").serialize(),
    	timeout: 5000,
    	success: function(data) {
			var $response=$(data); // Create jQuery object from the response HTML
			
			// Query the jQuery object for the values
			var responseMessage = $response.filter('#inputmessage').text();
    		
    		if (responseMessage == 'success') {
    			setTimeout( function(){ $("#messageinput").removeClass('error').addClass('success'); },500);
    		}
    		else {
    			setTimeout( function(){ $("#messageinput").removeClass('success').addClass('error'); },500);
    		}
    	}
	});
});

// AJAX Contact Form: On Submit
$("#contact-form").submit(function(){
	$('#contact .loading').fadeIn('500');
	$.ajax({
    	type: 'POST',
    	url: '/includes/sendmail-ajax.php',
    	data: $("#contact-form").serialize(),
    	timeout: 5000,
    	success: function(data) {
			var $response=$(data); // Create jQuery object from the response HTML
			
			// Query the jQuery object for the values
			var successfulSend = $response.filter('#successfulsend').text();
			var responseName = $response.filter('#inputname').text();
			var responseSenderEmail = $response.filter('#inputsenderemail').text();
			var responseMessage = $response.filter('#inputmessage').text();
    		
    		if (successfulSend === 'Yes') {
    			// Sent the email
    			setTimeout( function(){
    				$(':input','#contact-form').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected'); // Reset Form Values
    				$('#contact-form').css('display','none');
    				$('#contact .loading').fadeOut('500',function(){
    					$('#response').fadeIn('1000');
					});
				},500);
    		}
    		else {
    			setTimeout( function(){
					if (responseName == 'success') { $("#nameinput").removeClass('error').addClass('success'); }
					if (responseName != 'success') { $("#nameinput").removeClass('success').addClass('error'); }
					if (responseSenderEmail == 'success') { $("#senderemailinput").removeClass('error').addClass('success'); }
					if (responseSenderEmail != 'success') { $("#senderemailinput").removeClass('success').addClass('error'); }
					if (responseMessage == 'success') { $("#messageinput").removeClass('error').addClass('success'); }
					if (responseMessage != 'success') { $("#messageinput").removeClass('success').addClass('error'); }
					$('#contact .loading').fadeOut('1000');
				},500);
    		}
    	}
	});
	// Make sure the form doesn't post
	return false;
});

// Parallax
function parallax(){
	var w = $(window).width();
    if(w > 1024) {
    	var scrolled = $(window).scrollTop();
		$('.parallax').css('top', -(scrolled * 0.2) + 'px');
    }
}

// Back Top Top Button
$('.back-to-top').click(function(e) {
    $('html, body').stop().animate({scrollTop: 0}, 1200, 'easeInOutExpo');
    e.preventDefault();
});

// Scroll to Section on Load
$(function(){
    var hash = location.hash.replace('#','');
    if(hash === 'work'){
    	if ( $("body").hasClass("home") ) { // Only scroll to work on home page
    		var workTop = ($("#work").offset().top);
    		$('html, body').stop().animate({scrollTop: workTop}, 1200, 'easeInOutExpo');
    	}
    }
    if(hash === 'contact'){
    	var contactTop = ($("#contact").offset().top);
    	$('html, body').stop().animate({scrollTop: contactTop}, 1200, 'easeInOutExpo');
    }
});

// Scroll to Work Section with Button
$('body.home li.work a').click(function(e) {
	var workTop = ($("#work").offset().top);
    $('html, body').animate({scrollTop: workTop}, 1200, 'easeInOutExpo');
    var w = $(window).width();
    if(w < 769) {
		if(navActive === 0) {
			$('a.nav-toggle').html('&#10060;');
			navActive = 1;
		}
		else {
			$('a.nav-toggle').html('&#9776;');
			navActive = 0;
		}
		$('nav').slideToggle();
    }
    e.preventDefault();
});

// Scroll to Contact Section with Button
$('li.contact a').click(function(e) {
	var contactTop = ($("#contact").offset().top);
    $('html, body').animate({scrollTop: contactTop}, 1200, 'easeInOutExpo');
    var w = $(window).width();
    if(w < 769) {
		if(navActive === 0) {
			$('a.nav-toggle').html('&#10060;');
			navActive = 1;
		}
		else {
			$('a.nav-toggle').html('&#9776;');
			navActive = 0;
		}
		$('nav').slideToggle();
    }
    e.preventDefault();
});

// Scroll to Contact Section with Another Button
$('.contact-button').click(function(e) {
	var contactTop = ($("#contact").offset().top);
    $('html, body').animate({scrollTop: contactTop}, 1200, 'easeInOutExpo');
    e.preventDefault();
});

// Make Top Nav Menu Sticky
var headerActive = 0;
function moveScroller() {
    var move = function() {
        var st = $(window).scrollTop();
        var s = $("header");
        var ot = ($("#page").offset().top) + 1;
        if(st > ot) {
        	if(headerActive === 0) {
            	s.addClass("sticky");
            	headerActive = 1;
            }
        } else {
            if(st <= ot) {
        		if(headerActive === 1) {
            		headerActive = 0;
                	s.removeClass("sticky");
                }
            }
        }
    };
    $(window).scroll(move);
    move();
}

// Define throttle (underscore.js) offset and call updatePosition when window is scrolled
var throttled = _.throttle(updateWindowScroll, 33); // 33 throttles at 30 fps
$(window).scroll(throttled);

// Trigger functions on Window Resize - Paul Irish Window Smart Resize Function
(function($,sr){
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

// Do Stuff on Window Resize
$(window).smartresize(function(){
	updateWindowResize();
});

// Fire any throttled functions based on window scroll event
function updateWindowScroll() {
    moveScroller();
    parallax();
    revealContact();
    $("img").trigger("lazyLoadImages");
}

// Fire any functions based on window resize event
function updateWindowResize() {
    moveScroller();
    parallax();
    navVisibility();
    revealContact();
}

// Toggle Work Thumbnail Class
//$('#work li a').hover(function () {
//		$(this).toggleClass('overlay');
//});

});



$(window).on("load", function() {

// Reveal Slideshow
setTimeout( function(){
	$('#featured').fadeTo( 1000, 1);
},500);

// Reveal Hero Images
setTimeout( function(){
	$('body.work #featured, body.about #featured').fadeIn('1000');
},500);

});