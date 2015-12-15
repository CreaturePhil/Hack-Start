(function($, window) {

  const TOKEN_STORAGE_NAME = 'hack-start-token';

  function saveToken(token) {
    window.localStorage.setItem(TOKEN_STORAGE_NAME, token);
  }

  function getToken() {
    return window.localStorage.getItem(TOKEN_STORAGE_NAME);
  }

  function isLoggedIn() {
    var token = getToken();

    if (token) {
      var payload = JSON.parse(window.atob(token.split('.')[1]));

      return payload.exp > (Date.now() / 1000);
    }

    return false;
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_STORAGE_NAME);
  }

  $('form').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    console.log(data);
    $.ajax({
      url: $(this).attr('action'),
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(data) {
        console.log(data);
        saveToken(data.token);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

})(jQuery, window);
