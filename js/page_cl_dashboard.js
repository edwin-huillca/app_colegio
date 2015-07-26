$( document ).on( 'pageinit', '#cl_dashboard', function() {

  // when every page loads for first time
  console.log('loading home - first time');

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


//  cl_get_data( { name: 'cl_hijos', done: function( data_recibida ){ console.log( data_recibida ); }, fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); } } );
//  cl_get_data( { name: 'cl_comunicaciones', fecha: '2015-07-13', hijo:  '4',done: function( data_recibida ){ console.log( data_recibida ); }, fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); } } );

  } catch ( error ) {  console.log (error) }


});

function cl_test( data ){
 console.log( data );
}