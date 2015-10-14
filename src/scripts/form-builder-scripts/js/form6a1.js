define(['jquery'], function($) {
	function totalMinutes(category) {
		var selector = 'div[class^="pdf_' + category + '-total"] input';
		var minutes = 0;

		$(selector).each(function(index, element) {
			if ($.isNumeric($(element).val())) {
				minutes += parseInt($(element).val());
			}
		});

		$('.' + category + '-service-minutes input').val(minutes);
		$('.' + category + '-service-minutes input').trigger('input');
	}

	return function() {
		$(document).on('blur', 'div[class^="pdf_sped-total"] input', function() {
			totalMinutes('sped');
		});

		$(document).on('blur', 'div[class^="pdf_related-total"] input', function() {
			totalMinutes('related');
		});

		$(document).on('blur', 'div[class^="pdf_service-total"] input', function() {
			totalMinutes('service');
		});
	}
});
