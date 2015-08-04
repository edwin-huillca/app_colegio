/**
 * Given a variable name and value, this will save the value to local storage,
 * keyed by its name.
 * @param {String} name
 * @param {*} value
 * @return {*}
 */
function cl_variable_set(name, value) {
  try {
    if (!value) { value = ' '; } // store null values as a single space*
    else if (is_int(value)) { value = value.toString(); }
    else if (typeof value === 'object') { value = JSON.stringify(value); }
    return window.localStorage.setItem(name, value);
    // * phonegap won't store an empty string in local storage
  }
  catch (error) { console.log(error); }
}

/**
 * Given a variable name and a default value, this will first attempt to load
 * the variable from local storage, if it can't then the default value will be
 * returned.
 * @param {String} name
 * @param {*} default_value
 * @return {*}
 */
function cl_variable_get(name, default_value) {
  try {
    var value = window.localStorage.getItem(name);
    if (!value) { value = default_value; }
    if (value == ' ') { value = ''; } // Convert single spaces to empty strings.
    return value;
  }
  catch (error) { console.log(error); }
}

// Func that returns data
// request.name <- name of the data
// request.fecha <- Fecha de creacion la comunicacion : YYYY-MM-DD
// request.done <- function executed if request is fine
// request.fail <- function executed if fails
// request.fecha_agenda <- Fecha de la comunicacion : YYYY-MM-DD
// request.fecha_mes <- Fecha de la comunicacion ( o fecha agendada ) : YYYY-MM
function cl_get_data( request ){
  var url_request = '';
  var data_store_key = request.name + '_' + Drupal.user.uid;

  switch( request.name ) {

    case 'cl_hijos':
      url_request = Drupal.settings.site_path + '/cl_app_json/hijos/' + Drupal.user.uid;
      break;
    case 'cl_comunicaciones':
      url_request = Drupal.settings.site_path + '/cl_app_json/comunicacion/' + request.fecha + '/' + cl_app.hijo_activo + '/' + Drupal.user.uid;
      data_store_key = data_store_key + '_' + cl_app.hijo_activo + '_' + request.fecha;
      break;
    case 'cl_agenda':
      url_request = Drupal.settings.site_path + '/cl_app_json/agenda/' +  request.fecha_agenda + '/' + cl_app.hijo_activo + '/' + Drupal.user.uid;
      data_store_key = data_store_key + '_' + cl_app.hijo_activo + '_' + request.fecha_agenda;
      break;
    case 'cl_comunicados':
      url_request = Drupal.settings.site_path + '/cl_app_json/comunicados/' + cl_app.hijo_activo + '/' + Drupal.user.uid;
      data_store_key = data_store_key + '_' + cl_app.hijo_activo;
      break;
    case 'cl_asistencia':
      url_request = Drupal.settings.site_path + '/cl_app_json/asistencia/' + request.fecha + '/' + cl_app.hijo_activo + '/' + Drupal.user.uid;
      data_store_key = data_store_key + '_' + cl_app.hijo_activo + '_'  + request.fecha;
      break;
    case 'cl_cole_direccion':
      url_request = Drupal.settings.site_path + '/cl_app_get_requests'  + '?data=dvariable&name=cl_colegio_direccion';
      break;
    case 'cl_menu_del_dia':
      url_request = Drupal.settings.site_path + '/cl_app_get_requests'  + '?data=dvariable&name=cl_menu_del_dia';
      break;
    case 'cl_horario_profe':
      url_request = Drupal.settings.site_path + '/cl_app_get_requests'  + '?data=dvariable&name=cl_horario_profe';
      break;
    case 'cl_horario_clases':
      url_request = Drupal.settings.site_path + '/cl_app_get_requests'  + '?data=dvariable&name=cl_horario_clases';
      break;
    case 'cl_calendario_diario_mes': // cantidad de comunicaciones por día en un mes
      url_request = Drupal.settings.site_path + '/cl_app_get_requests'  + '?data=comunicaciones_day_amount_per_month&month=' + request.fecha_mes + '&hijo=' + cl_app.hijo_activo + '&padre=' + Drupal.user.uid;
      break;
    case 'cl_agenda_mes': // cantidad de comunicaciones por día en un mes
      url_request = Drupal.settings.site_path + '/cl_app_get_requests'  + '?data=agenda_day_amount_per_month&month=' + request.fecha_mes + '&hijo=' + cl_app.hijo_activo + '&padre=' + Drupal.user.uid;
      break;
  }


  stored = cl_variable_get( data_store_key, null );

  cache_enabled = false;

  if ( stored && cache_enabled ) {
    stored = $.parseJSON( stored );
    request.done( stored.data_stored );
  } else {


    var jqxhr = $.getJSON( url_request )
    .done(function( data ) {

      switch( request.name ) {
        case 'cl_cole_direccion':
          data = data.cl_colegio_direccion.value;
          break;
        case 'cl_menu_del_dia':
          data = data.cl_menu_del_dia.value;
          break;
        case 'cl_horario_profe':
          data = data.cl_horario_profe.value;
          break;
        case 'cl_horario_clases':
          data = data.cl_horario_clases.value;
          break;
      }

      cl_variable_set( data_store_key, { data_stored : data } );

      request.done( data);

    })
    .fail(function( data ) {
      request.fail( data);
    })
    .always(function() {
    });

  };

}



//GET: H I J O S
function _get_hijos(page){
  
  var data_request = {
    name: 'cl_hijos',  // nombre del dato
    done: function( data_recibida ){ 
    var json_hijos = data_recibida;   
    
    var total_hijos = json_hijos.nodes.length;
    
    if (json_hijos.nodes.length ==1){
      _get_un_solo_hijo(json_hijos,page);
      return false;
    }else if (json_hijos.nodes.length ==0){
      var selectMobile = $('select#selhijos_' + page);
      selectMobile.css('display', 'none').parent('.ui-select').css('display', 'none').parent("div").css('display', 'none');
      selectMobile.empty();
      
      $(".lb_nombre_hijo").html("<span style='color:red'>No hay hijos</span>");
      $(".lb_nombre_hijo").show();
      return false;
    }else{
      _get_varios_hijos(json_hijos,page);
      return false;
    }

    }, // funcion a ejecutar cuando se tiene el dato
    fail: function( data_recibida ){
    console.log('error:'); console.log( data_recibida );
    
  } // funcion a ejecutar cuando se tiene errores
  };

  cl_get_data(data_request);
  
  return false;
}

function _get_un_solo_hijo(json_hijos,page){
  
  var selectMobile = $('select#selhijos_' + page);
  selectMobile.css('display', 'none').parent('.ui-select').css('display', 'none').parent("div").css('display', 'none');
  selectMobile.empty();
  
  var item_hijo = json_hijos.nodes[0].node;
  $(".lb_nombre_hijo").html(item_hijo.nombre);
  $(".lb_nombre_hijo").show();
  $(".lb_id_hijo").html(item_hijo.nid);
  cl_app.hijo_activo = item_hijo.nid;
  
  if (page =="dashboard" || page=="diario_calendar"){
    _get_comunicaciones(page); // removed  hijo
    _get_asistencia(page);
  }else if(page =="agenda"){
    _get_agenda(page);
  }else if(page =="comunicados"){
    _get_comunicados(page);
  }else if(page =="cole_direccion"){
    _get_colegio();
  }else if(page =="menu_del_dia"){
    _get_menu_del_dia();
  }else if(page =="horario_profe"){
    _get_horario_profe();
  }else if(page =="horario_clases"){
    _get_horario_clases();            
  }
  
  return false;
}

function _get_varios_hijos(json_hijos,page){
  var options_hijos = "";
  var selectMobile = $('select#selhijos_' + page);
  
  selectMobile.css('display', 'block').parent('.ui-select').css('display', 'block').parent("div").css('display', 'block');
  $(".lb_nombre_hijo").hide();

  if (cl_app.hijo_activo == 0) cl_app.hijo_activo = json_hijos.nodes[0].nid;
  
  $.each(json_hijos.nodes, function (key,value) {
    var item_hijo = value.node;
    
    options_hijos += '<option value="'+ item_hijo.nid + '"';
    
    if (cl_app.hijo_activo !=null && cl_app.hijo_activo ==item_hijo.nid){
      options_hijos +=" selected='selected' ";
    }
    options_hijos +='>'+ item_hijo.nombre + '</option>';
  });
  
  selectMobile.html(options_hijos);
  
  if (selectMobile.data("mobile-selectmenu") === undefined) {
    selectMobile.selectmenu('refresh'); 
  }
  
  selectMobile.selectmenu();
  $("#selhijos_" + page).trigger("change",page);
}

//GET: C O M U N I C A C I O N E S
function _get_comunicaciones(page,dt_comunicacion){
    
  if (dt_comunicacion =="" || dt_comunicacion ==null){
    var mmddStr = sprintf('%02d-%02d',_mm,_dd);
    dt_comunicacion = _yyyy + "-" + mmddStr;
    $(".idx_dia").html(_dd);
  }
  
  //console.log(dt_comunicacion);
  //console.log(nid);
  
  var data_request ={
    name: 'cl_comunicaciones',
    fecha: dt_comunicacion,
//    hijo:  nid, // remmoved hijo
    done: function( data_recibida ){
      var json_comunicaciones = data_recibida;
      
      var html_comunicados = "";
      if (json_comunicaciones.nodes.length ==0){
        $("#comunicados_de_" + page).html("<li><center>No hay Comunicaciones</center></li>");
        $("#comunicados_de_" + page).listview().listview('refresh');
        
      }else{
        $.each(json_comunicaciones.nodes, function (key,value) {
          var item_comunicacion = value.node;
          var data_icon = "";
          
          switch(item_comunicacion.tipo){
            case "cl_actividad":
              data_icon = "clock";
            break;
            case "cl_citacion":
              data_icon = "calendar";
            break;
            case "cl_comunicado":
              data_icon = "comment";
            break;
              case "cl_mensaje":
            break;
            case "cl_tarea":
              data_icon = "edit";
            break;
          }
          
          var sDate = _gethora(item_comunicacion.fecha);
      
          html_comunicados +='<li role-data="' + item_comunicacion.id + '" class="ui-li"><p  class="ui-li-aside ui-li-aside-home">'+ sDate +'</p><h3 style="text-transform:capitalize;">' + item_comunicacion.tipo.replace("cl_","") + '</h3><p class="ui-li-desc ui-li-normal">'+ item_comunicacion.texto +'</p></li>';
        });
        
        $("#comunicados_de_" + page).html(html_comunicados);
        $("#comunicados_de_" + page).listview().listview('refresh');
      }
    
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}

//GET: A G E N D A
function _get_agenda(page,dt_agenda){
    
  if (dt_agenda =="" || dt_agenda ==null){
    var mmddStr = sprintf('%02d-%02d',_mm,_dd);
    dt_agenda = _yyyy + "-" + mmddStr;
    $(".idx_dia").html(_dd);
  }
  
  var data_request ={
    name: 'cl_agenda',
    fecha_agenda: dt_agenda,
//    hijo:  nid, // removed hijo
    done: function( data_recibida ){
      var json_agenda = data_recibida;
      
      var html_agenda = "";
      if (json_agenda.nodes.length ==0){
        $("#eventos_de_" + page).html("<li><center>NO HAY EVENTOS</center></li>");
        $("#eventos_de_" + page).listview().listview('refresh');
        
      }else{
        $.each(json_agenda.nodes, function (key,value) {
          var item_comunicacion = value.node;
          var data_icon = "";
          
          console.log(item_comunicacion);
          
          switch(item_comunicacion.tipo){
            case "cl_actividad":
              data_icon = "clock";
            break;
            case "cl_citacion":
              data_icon = "calendar";
            break;
            case "cl_comunicado":
              data_icon = "comment";
            break;
              case "cl_mensaje":
            break;
            case "cl_tarea":
              data_icon = "edit";
            break;
          }
          
          var sDate = _gethora(item_comunicacion.fecha);
      
          html_agenda +='<li role-data="' + item_comunicacion.id + '" class="ui-li"><p  class="ui-li-aside ui-li-aside-home">'+ sDate +'</p><h3 style="text-transform:capitalize;">' + item_comunicacion.tipo.replace("cl_","") + '</h3><p class="ui-li-desc ui-li-normal">'+ item_comunicacion.texto +'</p></li>';
        });
        
        $("#eventos_de_" + page).html(html_agenda);
        $("#eventos_de_" + page).listview().listview('refresh');
      }
    
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}


//GET: C O M U N I C A D O S
function _get_comunicados(page){
  var arr_fechas = [];
  var data_request ={
    name: 'cl_comunicados',
//    hijo:  nid, // removed hijo
    done: function( data_recibida ){
      var json_comunicados = data_recibida;
      
      var html_agenda = "";
      if (json_comunicados.nodes.length ==0){
        $("#eventos_de_" + page).html("<li><center>NO HAY COMUNICADOS</center></li>");
        $("#eventos_de_" + page).listview().listview('refresh');
        
      }else{
        $.each(json_comunicados.nodes, function (key,value) {
          var item_comunicado = value.node;
          var item_visible = 1;

          if (item_comunicado.periodo !=null && item_comunicado.periodo!=""){
            var rango = item_comunicado.periodo.split("to");
            var mmddStr = sprintf('%02d-%02d',_mm,_dd);
            var fecha_hoy_co = _yyyy + "-" + mmddStr;
            //var fecha_hoy_co = "2015-08-01";
            
            var fecha_en_rango = rango_fechas($.trim(rango[0]),$.trim(rango[1]),fecha_hoy_co);

            if (fecha_en_rango > -1){
               item_visible=1;
               console.log("registro en rango actual.." + item_comunicado.Id + "::: del ::: " + item_comunicado.periodo);
            }else{
              item_visible=0;
            }
          }
          
          if (item_visible ==1){
            html_agenda +='<li role-data="' + item_comunicado.Id + '" class="ui-li" ><h3 style="text-transform:capitalize;">Comunicado</h3><p class="ui-li-desc ui-li-normal">'+ item_comunicado.texto +'</p></li>';
          }
        });
        
        $("#eventos_de_" + page).html(html_agenda);
        $("#eventos_de_" + page).listview().listview('refresh');
      }
    
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log(data_recibida);
    }
  };
  
  cl_get_data(data_request);
}


//GET: A S I S T E N C I A
function _get_asistencia(page,dt_asistencia){
    
  if (dt_asistencia =="" || dt_asistencia ==null){
    var mmddStr = sprintf('%02d-%02d',_mm,_dd);
    dt_asistencia = _yyyy + "-" + mmddStr;
  }

  $("#asistencia_en_" + page).html("");

  var data_request ={
    name: 'cl_asistencia',
    fecha: dt_asistencia,
    done: function( data_recibida ){
      var json_asistencia = data_recibida;
 
      if (json_asistencia.nodes.length ==0){
        $("#asistencia_en_" + page).html("No hay registro");
      }else{
         $("#asistencia_en_" + page).html("" + json_asistencia.nodes[0].node.asistencia + "");
      }
    
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}


//GET: C O L E G I O
function _get_colegio(){


  var data_request ={
    name: 'cl_cole_direccion',
    done: function( data_recibida ){
      var str_datos = data_recibida;

      $("#direccion_colegio").html(str_datos);
      //console.log(str_datos);
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}

//GET: M E N U  D E L  D I A
function _get_menu_del_dia(){

  var data_request ={
    name: 'cl_menu_del_dia',
    done: function( data_recibida ){
      var str_datos = data_recibida;
      $("#content_html_menu_del_dia").html(str_datos);

      console.log(str_datos);
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}

//GET: H O R A R I O  P R O F E
function _get_horario_profe(){

  var data_request ={
    name: 'cl_horario_profe',
    done: function( data_recibida ){
      var str_datos = data_recibida;
      $("#content_html_horario_profe").html(str_datos);

      console.log(str_datos);
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}

//GET: H O R A R I O  D E   C L A S E S
function _get_horario_clases(){

  var data_request ={
    name: 'cl_horario_clases',
    done: function( data_recibida ){
      var str_datos = data_recibida;
      $("#content_html_horario_clases").html(str_datos);
      
      console.log(str_datos);
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}

//GET: M E S   A G E N D A
function _get_mes_agenda(element_calendar,fecha_agenda,format_mes){

  var data_request ={
    name: 'cl_agenda_mes',
	fecha_mes: format_mes,
    done: function( data_recibida ){
      var json_datos = data_recibida;
	  eventsArray = [];
	  
	  $.each(json_datos, function (key,value) {
		  var item_fecha = _getStringFecha2(key);
		  eventsArray.push({  "bg": "importance-" + value,"summary" : "Agenda día " + item_fecha.getDate() + " con (" + value + ") eventos", "begin" : item_fecha, "end" : item_fecha});
	  });
	  
	  $(element_calendar).data("jqm-calendar").settings.events = eventsArray;
	  $(element_calendar).trigger('refresh');
	  
	  console.log(format_mes);
      console.log(json_datos);
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}

//GET: C A L E N D A R I O   D I A R I O
function _get_calendario_diario_mes(element_calendar,fecha_agenda,format_mes){

  var data_request ={
    name: 'cl_calendario_diario_mes',
	fecha_mes: format_mes,
    done: function( data_recibida ){
      var json_datos = data_recibida;
	  eventsArray = [];
	  
	  $.each(json_datos, function (key,value) {
		  var item_fecha = _getStringFecha2(key);
		  eventsArray.push({  "bg": "importance-" + value,"summary" : "Calendario diario del " + item_fecha.getDate() + " con (" + value + ") eventos", "begin" : item_fecha, "end" : item_fecha});
	  });
	  
	  $(element_calendar).data("jqm-calendar").settings.events = eventsArray;
	  $(element_calendar).trigger('refresh');
	  
	  console.log(format_mes);
      console.log(json_datos);
    },
    fail: function( data_recibida ){
      console.log('error:'); console.log( data_recibida );
    }
  };
  
  cl_get_data(data_request);
}

//I N G R E S A R
//Formato: Fecha Completa.
function _getStringFecha(strDate){
  var s = strDate.replace(/[ :]/g, "-").split("-");
  var currentTime = new Date(s[0],(s[1] - 1),s[2],s[3],s[4],s[5]);
  
  return currentTime;
}

function _getStringFecha2(strDate){
  var s = strDate.replace(/[ :]/g, "-").split("-");
  var currentTime = new Date(s[0],(s[1] - 1),s[2]);
  
  return currentTime;
}

function _gethora(strDate) {
  
  var currentTime = _getStringFecha(strDate);
  var hours = currentTime.getHours()
  var minutes = currentTime.getMinutes()

  if (minutes < 10)
    minutes = "0" + minutes;

  var suffix = "AM";
  if (hours >= 12) {
    suffix = "PM";
    hours = hours - 12;
  }
  
  if (hours == 0) {
    hours = 12;
  }
  
  var current_time = hours + ":" + minutes + " " + suffix;
  return current_time;
}

function _get_nav_fecha(operacion, dias){
  $("#_nav_sumar").show();
  $("#_nav_restar").show();
  
  $arr_date = $("#input_dia_actual").val().split("-");

  var today = new Date($arr_date[0],$arr_date[1],$arr_date[2]);
  var tomorrow = new Date();

  if (operacion =="sumar")tomorrow.setTime(today.getTime() + (dias * 86400000));
  if (operacion =="restar")tomorrow.setTime(today.getTime() - (dias * 86400000));
  
  strDay = tomorrow.getFullYear() + "-" + (tomorrow.getMonth() ) + "-" + tomorrow.getDate();
  $("#input_dia_actual").attr('value',strDay);


  $(".lb_fecha_hoy").html(tomorrow.getDate() + " de " + _get_month_name(tomorrow.getMonth()) + " del " + tomorrow.getFullYear());
  strFechaHoy = _yyyy + "-" + (_mm - 1) + "-" + _dd;
  

    
  var nid = 0;
  
  if (cl_app.hijo_activo ==0){
    if ($("#selhijos_dashboard").length >0){
      nid = parseInt($("#selhijos_dashboard option:selected").val(),10);
    }else{
      nid = parseInt($(".lb_id_hijo").html(),10);
    }
  }else{
    nid = cl_app.hijo_activo;
  }
  
  var mmddStr = sprintf('%02d-%02d',(tomorrow.getMonth() + 1),tomorrow.getDate());
  var dt_comunicacion = tomorrow.getFullYear() + "-" + mmddStr;
    
  _get_comunicaciones('dashboard', dt_comunicacion); // removed hijo
  _get_asistencia('dashboard', dt_comunicacion);

  if (strFechaHoy == strDay){
    $("#_nav_" + operacion).hide();
  }

  //console.log("FECHA NAV: "  + strDay);
  return tomorrow;
}

function _get_months(){
  var mesok=new Array(12);
  mesok[0]="Enero";
  mesok[1]="Febrero";
  mesok[2]="Marzo";
  mesok[3]="Abril";
  mesok[4]="Mayo";
  mesok[5]="Junio";
  mesok[6]="Julio";
  mesok[7]="Agosto";
  mesok[8]="Septiembre";
  mesok[9]="Octubre";
  mesok[10]="Noviembre";
  mesok[11]="Diciembre";
  
  return mesok;
}

function _get_month_name(month_id){

  var mesok=_get_months();
  return mesok[month_id];
}


//FUNCTIONS: R A N G O  D E  F E C H A S


function rango_fechas(entrada,salida,fecha_hoy){
  fechaEntrada = new Array();
  fechaEntrada = entrada.replace(/[ :]/g, "-").split("-");

  fechaSalida = new Array(); 
  fechaSalida = salida.replace(/[ :]/g, "-").split("-");

  var fechaEntradaFinal =  Array(fechaEntrada[2],fechaEntrada[1],fechaEntrada[0]);
  var fechaSalidaFinal =  Array(fechaSalida[2],fechaSalida[1],fechaSalida[0]);
//console.log(fechaSalidaFinal);

  arr_fechas = [];
  _rango_maxLength(fechaEntradaFinal,fechaSalidaFinal,_rango_para_meses(fechaEntradaFinal));
  var encontro = arr_fechas.indexOf(fecha_hoy);
  
  //console.log("arr final:");
  //console.log(arr_fechas);

  return encontro;
}

function _rango_para_anioBisiesto(anio){
  if((anio%4==0 && anio%100 != 0) || anio%400 == 0)
   return 29;
  else
   return 28;
}

function _rango_para_meses(fecha){
  var longitud;
  if(fecha[1] == 2)
   return _rango_para_anioBisiesto(fecha[2]);
  else if(fecha[1] == 1 || fecha[1] == 3 || fecha[1] == 5 || fecha[1] == 7 || fecha[1] == 8 || fecha[1] == 10 || fecha[1] == 12)
   return 31;
  else
   return 30; 
}

function _rango_maxLength(fechaIn,fechaOut,longitud){

  while(true){
    arr_fechas.push(fechaIn[2]+"-"+fechaIn[1]+"-"+fechaIn[0]);
    //console.log("__:" + fechaIn[2]+"-"+fechaIn[1]+"-"+fechaIn[0]);

    if(fechaIn[0] == fechaOut[0] && fechaIn[1] == fechaOut[1] && fechaIn[2] == fechaOut[2]){
      break;
    }

    if(fechaIn[0] < longitud){
      fechaIn[0]++; 
    }else{
      fechaIn[0] = 0;
      fechaIn[0]++;
      fechaIn[1]++;
      longitud = _rango_para_meses(fechaIn);

      if(fechaIn[1] > 12){
        fechaIn[2]++;
        fechaIn[1]=1
      }
    }

    
  }
}

function __cl_has_internet(){
	
 if (window.navigator.onLine) {
   return true;
 } else {
   return false;
 }
}

function cl_has_internet(){
	var networkState = navigator.connection.type;

	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.CELL]     = 'Cell generic connection';
	states[Connection.NONE]     = 'No network connection';

	alert('Connection type: ' + states[networkState]);
}