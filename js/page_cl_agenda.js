$( document ).on( 'pageinit', '#cl_agenda', function() {
  try {
	var cl_user = cl_variable_get( 'cl_user' );
	//console.log( cl_user );
	if ( cl_user ) {
		Drupal.user =  $.parseJSON( cl_user );
	}
	
	//console.log ( Drupal.user.uid );
	if ( Drupal.user.uid == '0' ) {
		$.mobile.changePage( '#cl_login' );
	}
	
	
	
	} catch ( error ) {  console.log (error) }

});



$( document ).on( 'pageshow', '#cl_agenda', function() {

	_get_hijos('agenda');
	console.log('loading #cl_agenda');

	var eventsArray = [];

    $("#cl_agenda_calendar").jqmCalendar({
       events : eventsArray,
       months : _get_months(),
       days : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
       startOfWeek : 1
    });


  $('#cl_agenda_calendar').trigger('refresh');


	$('#cl_agenda_calendar').bind('change', function(event, date) { // este evento de javascript sucede cada vez que se clickea, hay que ver el que suceda sólo cuando cambia de mes.

		var _yyyy_cal = date.getFullYear();
		var _dd_cal = date.getDate();
		var mmddStr = sprintf('%02d-%02d',(date.getMonth() + 1),_dd_cal);
		var dt_agenda = _yyyy + "-" + mmddStr;
		
		$(".idx_dia").html(_dd_cal);
		var nid = cl_app.hijo_activo;
		
		_get_agenda(nid,'agenda',dt_agenda);

	});

});
