$(document).on('pageshow', '#cl_salir', function() {
  try {
  user_logout({
    success:function(result){
      if (result[0]) {
        alert("Sesión cerrada exitosamente!");
      }
    }
  });
  } catch  ( error ) {  console.log (error) }
  var anon_user = Drupal.user;
  anon_user.uid = 0;
  cl_variable_set( 'cl_user' , anon_user.uid );
  $.mobile.changePage( '#cl_login');
});