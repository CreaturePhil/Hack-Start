(function($) {

  $('form').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    console.log(data);
    $.ajax({
      url: '/',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(data) {
        console.log(data);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

})(jQuery);
