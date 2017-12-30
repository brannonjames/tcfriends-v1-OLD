var menu 				= $(".menu"),
	searchBtn			= $("#search-button"),
	menuBtn				= $(".fa-bars"),
	searchForm			= $("#search-form"),
	closeBtn			= $(".fa-times"),
	input				= $(".ipt-ani"),
	label				= $(".lbl-ani"),
	pfHelpBtn			= $(".fa-question-circle"),
	pfHelp				= $("#petfinder-help"),
	msgBtn				= $("#message-button"),
	emailer				= $("#emailer"),
	slideshow			= $("#slideshow"),
	jumpToTop			= $("#jump-to-top"),
	menuButtonDiv		= $(".menu-buttons"),
	shelterEmail		= $("#shelter-email"),
	filterToggleDiv		= $("#filter-toggle"),
	filterForm  		= $(".filter-form"),
	filterReset			= $("#filter-reset"),
	filterDown			= $("#filter-down"),
	filterUp			= $("#filter-up"),
	useEmail			= $("#use-email"),
	width				= $(window).width(),

	largeBreakPoint		= 1024;



var showMore 		= document.getElementById("view-all"),
	friendDetails 	= document.getElementsByClassName("details");

function menuToggle() {
	$(menuBtn).toggle();
	$(closeBtn).toggle();
	$(menu).slideToggle(120);
}


	
function buttonClicks() {
	$(menuButtonDiv).click(function() {
		menuToggle();
	});
	
	
	$(searchBtn).click(function() {
		$(searchForm).slideToggle(120);
	});
	
	
	$(pfHelpBtn).click(function() {
		$(pfHelp).toggle();
	});
	
	
	$(msgBtn).click(function() {
		$(emailer).toggle();
	});

	$(jumpToTop).click(function() {
		$("html").animate({ scrollTop: 0 }, 'fast');
	});

}


function filterToggle(){
	$(filterForm).toggle();
	$(filterUp).toggle();
	$(filterDown).toggle();
}

function filterShow(){
	$(filterForm).show();
	$(filterUp).show();
	$(filterDown).hide();
	$(filterToggleDiv).show();
}

function filterHide(){
	$(filterForm).hide();
	$(filterToggleDiv).show()
	$(filterUp).hide();
	$(filterDown).show();
}

function filterShowOnResize(){
	$(filterToggleDiv).hide();
	$(filterUp).hide();
	$(filterDown).hide();
}
		

function selectFilterForm(animal, sex, age) {
	var filterAnimalForm = document.getElementById("species"),
		filterAnimalQuery = animal,

		filterSexForm = document.getElementsByClassName("filter-sex"),
		filterSexQuery = sex,

		filterAgeForm = document.getElementsByClassName("filter-age"),
		filterAgeQuery = age;

	for(var i=0, len=filterAnimalForm.options.length; i<len; i++) {
		if(filterAnimalForm.options[i].value === filterAnimalQuery) {
			filterAnimalForm.options[i].selected = true;
		}
	}
	for(var i=0, len=filterSexForm.length; i<len; i++) {
		if(filterSexForm[i].value === filterSexQuery) {
			filterSexForm[i].checked = true;
		}
	}
	for(var i=0, len=filterAgeForm.length; i<len; i++) {
		if(filterAgeForm[i].value === filterAgeQuery) {
			filterAgeForm[i].checked = true;
		}
	}

}
	
function fileUploader() {
	var fileInput = document.getElementById("file-upload");
	fileInput.addEventListener('change', function(e) {
		var inputLabel	= fileInput.nextElementSibling,
			labelVal	= inputLabel.innerHTML,
			fileName	= e.target.value.split("C:\\fakepath\\").pop();
		if(fileName) {
			inputLabel.querySelector("span").innerHTML = fileName;
		} else {
			inputLabel.innerHTML = labelVal;
		}
	});		
}
	
var slideIndex;
function loadSlideshow(j) {
	$('html,body').scrollTop(0);
	slideIndex = j;
	// $(".slideshow").css("margin-top", (String(window.pageYOffset + 65) + "px"));
	$("#slideshow-wrapper").css("display", "block");
	showSlides();
	$(".mySlides img").addClass("fade");
	$(".misc-button").toggle();
	

}




function exitSlideshow() {
	$("#slideshow-wrapper").css("display", "none");
	$(".misc-button").toggle();
}

function plusSlides(n) {
	showSlides(slideIndex += n);
}


function currentSlide(n) {
	showSlides(slideIndex = n);
}


function showSlides(n) {
	$("#slideshow-wrapper").css("height", ($(document).height()));
	var slides = document.getElementsByClassName("mySlides");
	var i;
	if (n > slides.length - 1) {
		slideIndex = 0;
	}
	if (n < 0) {
		slideIndex = slides.length - 1;
	}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}
	slides[slideIndex].style.display = "block";
}
		
var thumbnailCSS = {
	"margin": $(".thumbnail").css("margin"),
	"transform": $(".thumbnail").css("transform")
}	

function centerSinglePhoto() {
	if ($(window).width() < 1024) {
		$(".thumbnail").css({
			"margin-left": "50%",
			"transform": "translateX(-50%)"
		})
	} else {
		$(".thumbnail").css(thumbnailCSS);
	}
}



function toggleTextInputLabel() {
	var originalCSS = {
		"top": "29.5px",
		"left": "8px",
		"font-size": "1em",
		"color": "#999"
	};
	
	var newCSS = {
		"top": "2px",
		"left": "0",
		"font-size": ".6em",
		"color": "black"
	};
	
	$(input).toArray().forEach(function(input) {
		if(input.value) {
			$(input).next().css(newCSS);
		}
	});
	
	
	$(input).focusin(function() {
		if(!this.value.length) {
			$(this).next().css(newCSS);	
		}
	});
	$(input).focusout(function() {
		if(!this.value.length) {
			$(this).next().css(originalCSS);	
		}
	});
}
	
	

function showHeaderMenuWhenWide() {
	if($(window).width() >= 1024) {
		$(menu).css("display", "block");
		// $(menu).css("width", "auto");
	} else {
		$(menu).css("display", "none");
	}
}	

function showMoreFriendDetails() {
	if ($(friendDetails).height() > 450 && $(window).width() < 1024) {
		var isHidden = true;
		$(showMore).show();
		$(showMore).click(function() {
			if (isHidden) {
				$(friendDetails).css({
					"max-height": "none",
					"padding-bottom": "56px"
				});
				showMore.innerText = "Show Less";
				isHidden = false;
			} else {
				$(friendDetails).css({
					"max-height": "460px",
					"padding-bottom": "10%"
				});
				showMore.innerText = "Show More";
				isHidden = true;
			}

			
		});
	} else {
		$(showMore).hide();
	}
}


function hideMenu() {
	$(menuBtn).show();
	$(closeBtn).hide();
	$(menu).hide(120);
}



$(document).ready(function() {
	toggleTextInputLabel();	
	buttonClicks();
	showMoreFriendDetails();
	$(window).resize(function() {
		if($(window).width() < 1024) {
			hideMenu();
			filterHide();
		}
		if($(window).width() > 1024) {
			filterShow();
			filterShowOnResize();
		}
		// centerSinglePhoto();
		showHeaderMenuWhenWide();
		showMoreFriendDetails();
	});
});


