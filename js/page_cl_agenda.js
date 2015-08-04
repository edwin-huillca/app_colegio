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

	var eventsArray = [];

    $("#cl_agenda_calendar").jqmCalendar({
       events : eventsArray,
       months : _get_months(),
       days : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
       startOfWeek : 1,
	   bg:"bg"
	  
    });
	
	$("#cl_agenda_calendar").trigger("refresh");
	
	setTimeout(function(){
		var fecha_ac = $("#cl_agenda_calendar").data("jqm-calendar").settings.date;
		var yyyymmStr = sprintf('%04d-%02d',fecha_ac.getFullYear(),(fecha_ac.getMonth() + 1));
		
		_get_mes_agenda($("#cl_agenda_calendar"),fecha_ac, yyyymmStr);
	}, 1000);
		
	$('#cl_agenda_calendar .next-btn').bind('click', function(event,date){
		console.log("mes next....::");
		
		var fecha_ac = $("#cl_agenda_calendar").data("jqm-calendar").settings.date;
		var yyyymmStr = sprintf('%04d-%02d',fecha_ac.getFullYear(),(fecha_ac.getMonth() + 1));
		console.log(yyyymmStr);
		
		_get_mes_agenda($("#cl_agenda_calendar"),fecha_ac, yyyymmStr);
	});
	
	$('#cl_agenda_calendar .previous-btn').bind('click', function(event,date){
		console.log("mes previous....::");
		
		var fecha_ac = $("#cl_agenda_calendar").data("jqm-calendar").settings.date;
		var yyyymmStr = sprintf('%04d-%02d',fecha_ac.getFullYear(),(fecha_ac.getMonth() + 1));
		console.log(yyyymmStr);
		
		_get_mes_agenda($("#cl_agenda_calendar"),fecha_ac, yyyymmStr);
	});

	$('#cl_agenda_calendar').bind('change', function(event, date) {
		
		var _yyyy_cal = date.getFullYear();
		var _dd_cal = date.getDate();
		var mmddStr = sprintf('%02d-%02d',(date.getMonth() + 1),_dd_cal);
		var dt_agenda = _yyyy + "-" + mmddStr;
		
		$(".idx_dia").html(_dd_cal);
//		var nid = cl_app.hijo_activo;
		
		_get_agenda('agenda',dt_agenda);

	});

});
