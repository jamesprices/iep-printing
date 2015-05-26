
require(['jquery', 'handlebars'], function($, Handlebars) {

  $(document).ready(function() {
    // often used css selectors
    var checkboxes = '.forms-list-container input[type=checkbox]';
    var checkedCheckboxes = '.forms-list-container input[type=checkbox]:checked';

    // icheck checkboxes initialize
    var iCheck = function() {
      $(checkboxes).iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue'
      });

      $(checkboxes).on('ifChanged', inputWatcher);
    }

    // bindings
    $('#btnPrintSelection').on('click', printSelectedForms);
    $('#btnToggleSelection').on('click', toggleSelect);

    // initial ajax request for forms associated with the student with the latest response
    $.ajax({
      url: "/admin/students/iepprinting/getForms.json.html",
      dataType: "json"
    })
    .done(function(forms) {
      forms.pop();

      if (forms.length > 0) {
        $.each(forms, function(index, form) {
          var source = $('#form-list-item-template').html();
          var template = Handlebars.compile(source);
          var html = template(form);

          var listNum = ((index % 3) + 1);

          $('.forms-list:nth-of-type('+listNum+')').append(html);
        });

        iCheck();

      } else {
        $('#btnToggleSelection').after(
          '<p> Sorry, no forms could be found matching your selection. </p>'
        );
      }

    })

    // action when print selection button is clicked
    function printSelectedForms() {
      $('#btnPrintSelection').blur();
      // make sure there are checked forms
      if ($(checkedCheckboxes).length < 1) {
        alert('There are no forms selected.');
        return;
      }

      var selected = [];
      $(checkedCheckboxes).each(function(index, form) {
        selected.push({
          frn: frn,
          subjectid: subjectid,
          formid: parseInt($(form).attr('data-form-id')),
          formtype: $(form).attr('data-form-type'),
          responseid: parseInt($(form).val())
        });
      });
      console.log(selected);

      if (selected.length > 0) {
        var responses = [];

        $.each(selected, function(index, select) {
          console.log('doing ajax');
          $.ajax({
            url: '/admin/students/iepprinting/responses.json.html',
            dataType: 'json',
            data: select
          })
          .done(function(response) {
            responses.push(response);
          })
          .fail(function() {
            console.log("error");
          });
        });

        console.log(responses);

      } else {
        console.log('selected length is 0');
      }
    }

    // action when select all/none link is clicked
    function toggleSelect(event) {
      if ($(event.target).text() == 'Select All') {
        $(checkboxes).iCheck('check');
      } else {
        $(checkboxes).iCheck('uncheck');
      }
    }

    function inputWatcher(event) {
      if ($(checkedCheckboxes).length < 1) {
        $('#btnToggleSelection').text('Select All');
        $('#btnPrintSelection').hide();
      } else {
        $('#btnPrintSelection').show();
      }

      if ($(checkedCheckboxes).length == $(checkboxes).length) {
        $('#btnToggleSelection').text('Select None');
      }
    }
  });
});
