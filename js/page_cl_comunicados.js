$( document ).on( 'pageinit', '#cl_comunicados', function() {
  console.log('loading comunicados - first time');

  try {
	var cl_user = cl_variable_get( 'cl_user' );
	console.log( cl_user );
	if ( cl_user ) {
		Drupal.user =  $.parseJSON( cl_user );
	}
	
	console.log ( Drupal.user.uid );
	if ( Drupal.user.uid == '0' ) {
		$.mobile.changePage( '#cl_login' );
	}

  } catch ( error ) {  console.log (error) }


});



$( document ).on( 'pageshow', '#cl_comunicados', function() {

	_get_hijos('comunicados');

	$(".lb_fecha_hoy").html(_dd + " de " + _get_month_name(_mm - 1) + " del " + _yyyy);
});
