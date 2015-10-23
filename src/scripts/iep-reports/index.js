
require(['jquery'], function($) {
  var reports = {};
  $('#iep-report-select').on('change', loadReport);

  function loadReport(event) {
    $('#iep-report-select').prop('disabled', true);

    var reportName = $(event.target).val();
    var url = '/admin/reports/iepreports/' + reportName + '.html';

    if (!reports.hasOwnProperty(reportName)) {

      loadingDialogInstance.open('Loading');
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html'
      })
      .done(function(html) {
        reports[reportName] = html;
        displayReport(reportName, html);
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        loadingDialogInstance.closeDialog();
      });

    } else {
      displayReport(reportName);
    }

    $('#iep-report-select').prop('disabled', false);
  }

  function displayReport(report, html) {
    $('#report-container table').hide();

    if ($('#' + report).length > 0) {
      $('#' + report).show();
    } else {
      $('#report-container').append(html);
      $('#' + report).tablesorter();
    }
  }
});
