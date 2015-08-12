require.config({
  paths: {
    iep: '/* @echo IMAGE_SERVER_URL *//scripts/iep-printing/iep'
  }
});

require(['jquery', 'handlebars', 'iep'], function($, Handlebars, Iep) {

	$(document).ready(function() {
		loadForms();
		$('button[type=submit]').on('click', printSelectedForms);
	});

	function loadForms() {
		$.ajax({
			url: Iep.apiUrl,
			type: 'POST',
			dataType: 'json',
			data: {forms: JSON.stringify(forms), action: 'getBlanks'},
		})
		.done(function(response) {
			if (response.length > 0) {
				$('#btnToggleSelection').show();
				$('#btnToggleSelection').on('click', Iep.toggleSelect);
				$.each(response, function(index, form) {
					var source = $('#form-list-item-template').html();
					var template = Handlebars.compile(source);
					var html = template(form);

					var listNum = ((index % 3) + 1);

					$('.forms-list:nth-of-type('+listNum+')').append(html);
				});

				Iep.iCheck();
			} else {
				$('#btnToggleSelection').after('<p> Sorry, there are no printable blank forms right now. </p>');
			}
		})
		.fail(function(error) {
			console.log(error);
			$('#btnToggleSelection').after('<p> Sorry, thre was an error communicating with the server. </p>');
		});
	}

	function printSelectedForms(event) {
		$(event.target).blur();
		var selected = [];

		// make sure there are checked forms
		if ($(Iep.checkedCheckboxes).length < 1) {
			alert('There are no forms selected.'); // TODO: might want to change how to notify
			return;
		}

		var selected = [];

		$(Iep.checkedCheckboxes).each(function(index, form) {
			selected.push({
				id: $(form).val(),
				title: $(form).parents('li').find('.title').text()
			});
		});

		console.log(JSON.stringify(selected));

		if (selected.length > 0) {
      togglePrintButtonState('disabled');

			$.ajax({
				url: Iep.apiUrl,
				type: 'POST',
				dataType: 'json',
				data: {forms: JSON.stringify(selected), action: 'printBlanks'},
			})
			.done(function(response) {
				console.log(response);
				if (response.file.length > 0) {
					var win = window.open(Iep.apiUrl + response.file, '_blank');
					if (win) {
						win.focus();
					} else {
						alert('ERROR: Please allow popups for this page.');
					}
				}

				for (var key in response.error) {
					var parentElement = $('input[value='+key+']').parents('li');
            		parentElement.addClass('error');
            		parentElement.find('.form-error').text(response.error[key]);
            	}
			})
			.fail(function(data) {
				console.log('Error');
				console.log(data);
			})
      .always(function() {
        togglePrintButtonState('enabled');
      });

		} else {
			alert('ERROR: selected form\'s data could not be collected');
		}
	}

  function togglePrintButtonState(state) {
    if (state == 'disabled') {
      $('#btnPrintSelection').prop('disabled', true);
      $('#btnPrintSelection i').show();
    } else {
      $('#btnPrintSelection').prop('disabled', false);
      $('#btnPrintSelection i').hide();
    }
  }
});
