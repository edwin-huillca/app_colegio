$( document ).on( 'pageinit', '#cl_diario_calendar', function() {

});



$( document ).on( 'pageshow', '#cl_diario_calendar', function() {

console.log('loading #cl_diario_calendar');

   var eventsArray = [];

  //Agregando un evento nuevo


    $("#cl_diario_calendar_calendar").jqmCalendar({
       events : eventsArray,
       months : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
       days : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
       startOfWeek : 1
        
    });


  eventsArray.push({ "summary" : "Test event <b>testing</b>", "begin" : new Date(2015,6,24), "end" : new Date(2015,6,26)});  // tambien ver que atraque html 
  $('#cl_diario_calendar_calendar').trigger('refresh');

  //C O M P R O B A R  Y  R E V I S A R
  //Para que no ejecute el evento change cuando se pasa las fechas --> <--

  $('#cl_diario_calendar_calendar').bind('change', function(event, date) { // este evento de javascript sucede cada vez que se clickea, hay que ver el que suceda sólo cuando cambia de mes.
 
      var events = $("#cl_diario_calendar_calendar").data("jqm-calendar").settings.events;
 

      for ( var i = 0; i < events.length; i++ ) {
          if ( events[i].begin.getFullYear() == date.getFullYear() &&
               events[i].begin.getMonth() == date.getMonth() &&
               events[i].begin.getDate() == date.getDate() ) {
                
               return false;
          }
      }
     
//      alert('Fecha seleccionada: ' + date);

// cuando se cambia de  mes, se tiene que jalar las comunicaciones de ese mes y meter al calendar
// pero se tendria que saber de alguna manera que se metio antes
// otra sería destruir el calendario y construir de nuevo para ese mes




      console.log( date );


  });


});