$( document ).on( 'pageinit', '#cl_diario_calendar', function() {
  try {
	var cl_user = cl_variable_get( 'cl_user' );
	if ( cl_user ) {
		Drupal.user =  $.parseJSON( cl_user );
	}
	
	if ( Drupal.user.uid == '0' ) {
		$.mobile.changePage( '#cl_login' );
	}
	
	
	
	} catch ( error ) {  console.log (error) }

});



$( document ).on( 'pageshow', '#cl_diario_calendar', function() {
	_get_hijos('diario_calendar');

	var eventsArray = [];

    $("#cl_diario_calendar_calendar").jqmCalendar({
       events : eventsArray,
       months : _get_months(),
       days : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
       startOfWeek : 1,
	   bg:"bg"
    });
	
	$('#cl_diario_calendar_calendar').trigger('refresh');
	
	setTimeout(function(){
		var fecha_ac = $("#cl_diario_calendar_calendar").data("jqm-calendar").settings.date;
		var yyyymmStr = sprintf('%04d-%02d',fecha_ac.getFullYear(),(fecha_ac.getMonth() + 1));
		
		_get_calendario_diario_mes($("#cl_diario_calendar_calendar"),fecha_ac, yyyymmStr);
	}, 1000);
		
	$('#cl_diario_calendar_calendar .next-btn').bind('click', function(event,date){
		console.log("mes next....::");
		
		var fecha_ac = $("#cl_diario_calendar_calendar").data("jqm-calendar").settings.date;
		var yyyymmStr = sprintf('%04d-%02d',fecha_ac.getFullYear(),(fecha_ac.getMonth() + 1));
		console.log(yyyymmStr);
		
		_get_calendario_diario_mes($("#cl_diario_calendar_calendar"),fecha_ac, yyyymmStr);
	});
	
	$('#cl_diario_calendar_calendar .previous-btn').bind('click', function(event,date){
		console.log("mes previous....::");
		
		var fecha_ac = $("#cl_diario_calendar_calendar").data("jqm-calendar").settings.date;
		var yyyymmStr = sprintf('%04d-%02d',fecha_ac.getFullYear(),(fecha_ac.getMonth() + 1));
		console.log(yyyymmStr);
		
		_get_calendario_diario_mes($("#cl_diario_calendar_calendar"),fecha_ac, yyyymmStr);
	});


	$('#cl_diario_calendar_calendar').bind('change', function(event, date) {

		var _dd_cal = date.getDate();
		var _mm_cal = date.getMonth()+1;
		var _yyyy_cal = date.getFullYear();
		var mmddStr = sprintf('%02d-%02d',_mm_cal,_dd_cal);
		var dt_comunicacion = _yyyy + "-" + mmddStr;
		
		$(".idx_dia").html(_dd_cal);

		_get_comunicaciones('diario_calendar',dt_comunicacion); // removed hijo
		_get_asistencia('diario_calendar',dt_comunicacion);

	});


});
