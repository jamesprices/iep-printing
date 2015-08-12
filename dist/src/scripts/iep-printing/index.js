'use strict';

require.config({
  paths: {
    iep: '//psimagestest.irondistrict.org/scripts/iep-printing/iep'
  }
});

require(['jquery', 'handlebars', 'iep'], function ($, Handlebars, Iep) {

  $(document).ready(function () {
    // bindings
    $('#btnPrintSelection').on('click', printSelectedForms);
    $('#btnToggleSelection').on('click', Iep.toggleSelect);

    // initial ajax request for forms associated with the student with the latest response
    $.ajax({
      url: "/admin/students/iepprinting/getForms.json.html",
      dataType: "json"
    }).done(function (forms) {
      forms.pop();

      if (forms.length > 0) {
        $('#btnToggleSelection').show();
        $.each(forms, function (index, form) {
          var source = $('#form-list-item-template').html(); // template lives here "/web_root/admin/students/iepprinting/index.html"
          var template = Handlebars.compile(source);
          var html = template(form);

          var listNum = index % 3 + 1;

          $('.forms-list:nth-of-type(' + listNum + ')').append(html);
        });

        Iep.iCheck();
      } else {
        $('#btnToggleSelection').after('<p> Sorry, no forms could be found matching your selection. </p>');
      }
    });

    // action when print selection button is clicked
    function printSelectedForms() {
      // make sure there are checked forms
      if ($(Iep.checkedCheckboxes).length < 1) {
        alert('There are no forms selected.'); // TODO: might want to change how to notify
        return;
      }

      var selected = [];

      $(Iep.checkedCheckboxes).each(function (index, form) {
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
        togglePrintButtonState('disabled');
        var responses = [];
        var ajaxCalls = [];

        $.each(selected, function (index, select) {
          ajaxCalls.push($.ajax({
            url: '/admin/students/iepprinting/responses.json.html',
            dataType: 'JSON',
            data: select
          }).done(function (response) {
            responses.push(cleanUpResponse(response));
          }).fail(function () {
            console.log("error");
          }));
        });

        $.when.apply($, ajaxCalls).then(function () {
          responses = JSON.stringify(responses);
          var stud = JSON.stringify(student);
          console.log(responses);
          console.log(stud);

          $.ajax({
            url: Iep.apiUrl,
            method: "post",
            data: {
              responses: responses,
              student: stud,
              action: "printFillForm",
              fileOption: $('input[name=fileOption]:checked').val(),
              watermarkOption: $('input[name=watermarkOption]:checked').val()
            }
          }).done(function (response) {
            console.log(response);
            // response = JSON.parse(response);
            if (response.file.length > 0) {
              var win = window.open(Iep.apiUrl + response.file, '_blank');
              if (win) {
                win.focus();
              } else {
                alert('ERROR: Please allow popups for this page.');
              }
            }

            for (var key in response.error) {
              var parentElement = $('input[data-form-id=' + key + ']').parents('li');
              parentElement.addClass('error');
              parentElement.find('.form-error').text(response.error[key]);
            }
          }).fail(function (data) {
            console.log('failure sending to php');
            console.log(data);
          }).always(function () {
            togglePrintButtonState('enabled');
          });
        });
      } else {
        alert('ERROR: selected form\'s data could not be collected');
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

      $.each(dirty.form.elements, function (index, element) {
        if (element.response || element.response.length > 0) {
          var classes = element['class'].split(' ');
          var field = element['class'];
          for (var key in classes) {
            if (classes[key].indexOf('pdf_') === 0) {
              field = classes[key].split('pdf_').join('');
            }
          }

          clean.response.push({
            field: field,
            type: element.type,
            response: element.response
          });
        }
      });

      return clean;
    }

    function togglePrintButtonState(state) {
      if (state == 'disabled') {
        $('#btnPrintSelection').prop('disabled', true);
        $('#btnPrintSelection i').removeClass('hide');
      } else {
        $('#btnPrintSelection').prop('disabled', false);
        $('#btnPrintSelection i').addClass('hide');
      }
    }
  });
});