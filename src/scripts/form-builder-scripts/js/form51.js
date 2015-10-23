define(['jquery'], function($) {
	function applyValues() {
		var values = {
			'school-num': $('#schoolid').text(),
			'parent-email': $('#guardianemail').text(),
			'work-phone': $('#motherdayphone').text(),
			'primary-language': $('#primarylanguage').text()
		};

		for (var key in values) {
			var element = $('.pdf_' + key + ' input');
			if (element.val() === '') {
				element.prop('value', values[key]);
				element.trigger('input');
			}
		}

	}

	function checkReadiness() {
		var inputs = $('div#formcontainer input').length;

		if (!inputs) {
			setTimeout(checkReadiness, 500);
		} else {
			setTimeout(applyValues, 2000);
		}
	}

	return function() {
		checkReadiness();
	}
});