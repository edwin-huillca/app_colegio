$( document ).on( 'pageinit', '#cl_login', function() {

  $('#cl_boton_submit').bind( "click", function(event, ui) {
	if (cl_has_internet()){
	
    $.mobile.loading( 'show', {
      text: 'Validando',
      textVisible: true,
      html: ''
    });
	
    
      user_login( $('#cl_usuario').val(), $('#cl_password').val(), {
      success:function(result){
        cl_variable_set( 'cl_user' , Drupal.user );
        $.mobile.loading( 'hide');
        $.mobile.changePage( "#cl_dashboard");
      },
      error:function(xhr, status, message){
        $.mobile.loading( 'hide');
        alert(message);
      }
      });
    }else{
	  alert("Por favor, conectese a internet.");
	}
	
	return false;
  })
   

});