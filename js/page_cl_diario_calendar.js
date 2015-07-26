$( document ).on( 'pageinit', '#cl_diario_calendar', function() {
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



$( document ).on( 'pageshow', '#cl_diario_calendar', function() {
	_get_hijos('diario_calendar');
	console.log('loading #cl_diario_calendar');

	var eventsArray = [];

	//Agregando un evento nuevo


    $("#cl_diario_calendar_calendar").jqmCalendar({
       events : eventsArray,
       months : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
       days : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
       startOfWeek : 1
    });


  //eventsArray.push({ "summary" : "Test event <b>testing</b>", "begin" : new Date(2015,6,24), "end" : new Date(2015,6,26)});  // tambien ver que atraque html 
  $('#cl_diario_calendar_calendar').trigger('refresh');

  //C O M P R O B A R  Y  R E V I S A R
  //Para que no ejecute el evento change cuando se pasa las fechas --> <--

  $('#cl_diario_calendar_calendar').bind('change', function(event, date) { // este evento de javascript sucede cada vez que se clickea, hay que ver el que suceda sólo cuando cambia de mes.
 
      // var events = $("#cl_diario_calendar_calendar").data("jqm-calendar").settings.events;
 

      // for ( var i = 0; i < events.length; i++ ) {
          // if ( events[i].begin.getFullYear() == date.getFullYear() &&
               // events[i].begin.getMonth() == date.getMonth() &&
               // events[i].begin.getDate() == date.getDate() ) {
                
               // return false;
          // }
      // }
     
// alert('Fecha seleccionada: ' + date);

// cuando se cambia de  mes, se tiene que jalar las comunicaciones de ese mes y meter al calendar
// pero se tendria que saber de alguna manera que se metio antes
// otra sería destruir el calendario y construir de nuevo para ese mes

		var _dd_cal = date.getDate();
		var _mm_cal = date.getMonth()+1;
		var _yyyy_cal = date.getFullYear();
		var mmddStr = sprintf('%02d-%02d',_mm_cal,_dd_cal);
		var dt_comunicacion = _yyyy + "-" + mmddStr;
		
		$(".idx_dia").html(_dd_cal);
		var nid = 0;
		
		if ($("#selhijos_diario_calendar").length >0){
			nid = parseInt($("#selhijos_diario_calendar option:selected").val(),10);
		}else{
			nid = parseInt($(".lb_id_hijo").html(),10);
		}
		
		_get_comunicaciones(nid,'diario_calendar',dt_comunicacion);

  });


});