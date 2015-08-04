$( document ).on( 'pageinit', '#cl_cole_direccion', function() {
  init_general();
});

$(document).on('pageinit', '#cl_cole_direccion', function() {

	_get_hijos('cole_direccion');
});

$( document ).on( 'pageinit', '#cl_menu_del_dia', function() {
  init_general();
});

$(document).on('pageinit', '#cl_menu_del_dia', function() {

	_get_hijos('menu_del_dia');
});


$( document ).on( 'pageinit', '#cl_horario_profe', function() {
  init_general();
});

$(document).on('pageinit', '#cl_horario_profe', function() {

	_get_hijos('horario_profe');
});


$( document ).on( 'pageinit', '#cl_horario_clases', function() {
  init_general();
});

$(document).on('pageinit', '#cl_horario_clases', function() {

	_get_hijos('horario_clases');
});


function init_general(){
  try {
	var cl_user = cl_variable_get( 'cl_user' );
	if ( cl_user ) {
		Drupal.user =  $.parseJSON( cl_user );
	}
	
	if ( Drupal.user.uid == '0' ) {
		$.mobile.changePage( '#cl_login' );
	}


  } catch ( error ) {  console.log (error) }

}
