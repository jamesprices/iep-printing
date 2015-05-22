
require(['jquery'], function($) {

  $(document).ready(function() {
    // icheck checkboxes initialize
    var iCheck = function() {
      $('#content-main input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue'
      });
    }

    $.ajax({
      url: "/admin/students/iepprinting/getForms.json.html",
      dataType: "json"
    })
    .done(function(forms) {
      forms.pop();
      $.each(forms, function(index, form) {
        var checkbox = '<li> \
          <input type="checkbox" name="response['+index+']" value="'+form.response_id+'"> \
          <span class="form-name">'+form.description+' - '+form.form_title+'</span> \
        </li>';

        var listNum = ((index % 3) + 1);

        $('.forms-list:nth-of-type('+listNum+')').append(checkbox);
      });

      iCheck();

      // console.log(forms);
    })
    .always(function() {
      console.log('blahalways');
    })
  });
});
