/* Author:

*/

var CDBB = (function() {

	var numPages, pages, pagesWrapper, pageContainer, pageLinks, nextCtrl, prevCtrl;
	var pageIndex = 0;

	function goToPage(index) {
		nextCtrl.removeClass("disabled");
		prevCtrl.removeClass("disabled");
		pageLinks.removeClass("current");

		pageIndex = index;
		pageContainer.stop(true, true).animate({ left: -960 * index }, "slow");
		pagesWrapper.stop().animate({height: pages.eq(index).height() }, "slow");

		pageLinks.eq(index).addClass("current");
		if (pageIndex === 0) {
			prevCtrl.addClass("disabled");
		} else if ( pageIndex === numPages - 1) {
			nextCtrl.addClass("disabled");
		}
	}

	function init() {
		pagesWrapper = $("#pages");
		pageContainer = $(".pageContainer", pagesWrapper);
		nextCtrl = $(".nextPage", pagesWrapper);
		prevCtrl = $(".prevPage", pagesWrapper);
		pageLinks = $(".pageLink", pagesWrapper);
		pages = pageContainer.children("section");
		numPages = pages.length;

		$(".fancybox").fancybox();
	
		nextCtrl.click(function() {
			if (pageIndex < numPages - 1) {
				goToPage(pageIndex + 1);
			}
			return false;
		});
	
		$(".prevPage").click(function() {
			if (pageIndex > 0) {
				goToPage(pageIndex - 1);
			}
			return false;
		});

		pageLinks.click(function() {
			var index = pageLinks.index(this);
			if ( pageIndex !== index ) {
				goToPage(index);
			}

			return false;
		});
	}

	return {
		init: init
	};
}());


$(document).ready(function() {
	CDBB.init();
});