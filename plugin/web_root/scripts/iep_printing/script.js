
require(['jquery', 'handlebars'], function($, Handlebars) {

  $(document).ready(function() {
    // often used jquery css selectors
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
          var source = $('#form-list-item-template').html(); // template lives here "/web_root/admin/students/iepprinting/index.html"
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
    });

    // action when print selection button is clicked
    function printSelectedForms() {
      $('#btnPrintSelection').blur(); // unfocuses the button

      // make sure there are checked forms
      if ($(checkedCheckboxes).length < 1) {
        alert('There are no forms selected.'); // TODO: might want to change how to notify
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

      // console.log(selected);

      if (selected.length > 0) {
        var apiUrl = "https://pats.irondistrict.org/printing/";
        var responses = [];

        $.each(selected, function(index, select) {
          $.ajax({
            url: '/admin/students/iepprinting/responses.json.html',
            dataType: 'JSON',
            data: select,
            async: false
          })
          .done(function(response) {
            responses.push(cleanUpResponse(response));
          })
          .fail(function() {
            console.log("error");
          });
        });

        responses = JSON.stringify(responses);
        var stud = JSON.stringify(student);
        console.log(responses);

        $.ajax({
          url: apiUrl,
          method: "post",
          data: {
            "responses": responses,
            "student": stud
          }
        })
        .done(function(response) {
          response = JSON.parse(response);
          if (response.file.length > 0) {
            var win = window.open(apiUrl + response.file[0], '_blank');
            if (win) {
              win.focus();
            } else {
              alert('ERROR: Please allow popups for this page.');
            }
          }

          for (var key in response.error) {
            $('input[data-form-id='+key+']').parents('li').addClass('error');
          }
        })
        .fail(function(data) {
          console.log('failure sending to php');
          console.log(data);
        });

      } else {
        alert('ERROR: selected form\'s data could not be collected');
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

    function cleanUpResponse(dirty) {
      var clean = {
        form: {
          id: dirty.form.id,
          title: dirty.form.title,
          description: dirty.form.description,
          type: dirty.form.type
        },
        response: []
      };

      $.each(dirty.form.elements, function(index, element) {
        if (element.response || element.response.length > 0) {
          clean.response.push({
            field: element.class,
            response: element.response
          });
        }
      });

      return clean;
    }
  });
});
