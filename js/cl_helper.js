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
// request.hijo <- ID del Hijo, para obtener la comunicacion
// request.done <- function executed if request is fine
// request.fail <- function executed if fails
// request.fecha_agenda <- Fecha de la comunicacion : YYYY-MM-DD
function cl_get_data( request ){
  var url_request = '';

  switch( request.name ) {
    case 'cl_hijos':
      url_request = Drupal.settings.site_path + '/cl_app_json/hijos/' + Drupal.user.uid;
      break;
    case 'cl_comunicaciones':
      url_request = Drupal.settings.site_path + '/cl_app_json/comunicacion/' +  request.fecha + '/' + request.hijo + '/' + Drupal.user.uid;
      break
    case 'cl_agenda':
      url_request = Drupal.settings.site_path + '/cl_app_json/comunicacion/' +  request.fecha_agenda + '/' + request.hijo + '/' + Drupal.user.uid;
      break
    case 'cl_comunicados':
      url_request = Drupal.settings.site_path + '/cl_app_json/comunicados/'  + request.hijo + '/' + Drupal.user.uid;
      break
  }

  var jqxhr = $.getJSON( url_request )
  .done(function( data ) {
    request.done( data);
  })
  .fail(function( data ) {
    request.fail( data);
  })
  .always(function() {
//    console.log( "complete" );
  });


}


//GET: H I J O S
function _get_hijos($page){
	
	var data_request = {
	  name: 'cl_hijos',  // nombre del dato
	  done: function( data_recibida ){ 
		//console.log( data_recibida );
		var json_hijos = data_recibida;		
		
		
		var total_hijos = json_hijos.nodes.length;
		//console.log("total hijos:" + total_hijos);
		
		if (json_hijos.nodes.length ==1){
			_get_un_solo_hijo(json_hijos,$page);
			return false;
		}else if (json_hijos.nodes.length ==0){
			var selectMobile = $('select#selhijos_' + $page);
			selectMobile.css('display', 'none').parent('.ui-select').css('display', 'none').parent("div").css('display', 'none');
			selectMobile.empty();
			
			$(".lb_nombre_hijo").html("<span style='color:red'>No hay hijos</span>");
			$(".lb_nombre_hijo").show();
			return false;
		}else{
			_get_varios_hijos(json_hijos,$page);
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

function _get_un_solo_hijo(json_hijos,$page){
	
	var selectMobile = $('select#selhijos_' + $page);
	selectMobile.css('display', 'none').parent('.ui-select').css('display', 'none').parent("div").css('display', 'none');
	selectMobile.empty();
	
	var item_hijo = json_hijos.nodes[0].node;
	$(".lb_nombre_hijo").html(item_hijo.nombre);
	$(".lb_nombre_hijo").show();
	$(".lb_id_hijo").html(item_hijo.nid);
	cl_app.hijo_activo = item_hijo.nid;
	
	if ($page =="dashboard" || $page=="diario_calendar"){
		_get_comunicaciones(item_hijo.nid,$page);
	}else if($page =="agenda"){
		_get_agenda(item_hijo.nid,$page);
	}else if($page =="comunicados"){
		_get_comunicados(item_hijo.nid,$page);
	}
	
	return false;
}

function _get_varios_hijos(json_hijos,$page){
	var options_hijos = "";
	var selectMobile = $('select#selhijos_' + $page);
	
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
	$("#selhijos_" + $page).trigger("change",$page);
}

//GET: C O M U N I C A C I O N E S
function _get_comunicaciones(nid,page,dt_comunicacion){
    
	if (dt_comunicacion =="" || dt_comunicacion ==null){
		var mmddStr = sprintf('%02d-%02d',_mm,_dd);
		dt_comunicacion = _yyyy + "-" + mmddStr;
		$(".idx_dia").html(_dd);
		console.log('fecha default:  ' + dt_comunicacion);
	}
	
	//console.log(dt_comunicacion);
	//console.log(nid);
	
	var data_request ={
		name: 'cl_comunicaciones',
		fecha: dt_comunicacion,
		hijo:  nid,
		done: function( data_recibida ){
			var json_comunicaciones = data_recibida;
			//console.log(json_comunicaciones);
			
			var html_comunicados = "";
			if (json_comunicaciones.nodes.length ==0){
				$("#comunicados_de_" + page).html("<li><center>NO HAY COMUNICADOS</center></li>");
				$("#comunicados_de_" + page).listview().listview('refresh');
				
			}else{
				$.each(json_comunicaciones.nodes, function (key,value) {
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
			
					html_comunicados +='<li role-data="' + item_comunicacion.id + '" class="ui-li" data-role="collapsible"><p  class="ui-li-aside">'+ sDate +'</p><h3 style="text-transform:capitalize;">' + item_comunicacion.tipo.replace("cl_","") + '</h3><p class="ui-li-desc">'+ item_comunicacion.texto +'</p></li>';
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
function _get_agenda(nid,page,dt_agenda){
    
	if (dt_agenda =="" || dt_agenda ==null){
		var mmddStr = sprintf('%02d-%02d',_mm,_dd);
		dt_agenda = _yyyy + "-" + mmddStr;
		$(".idx_dia").html(_dd);
		console.log('fecha default:  ' + dt_agenda);
	}
	
	//console.log(dt_agenda);
	//console.log(nid);
	
	var data_request ={
		name: 'cl_agenda',
		fecha_agenda: dt_agenda,
		hijo:  nid,
		done: function( data_recibida ){
			var json_agenda = data_recibida;
			console.log(json_agenda);
			
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
			
					html_agenda +='<li role-data="' + item_comunicacion.id + '" class="ui-li" data-role="collapsible"><p  class="ui-li-aside">'+ sDate +'</p><h3 style="text-transform:capitalize;">' + item_comunicacion.tipo.replace("cl_","") + '</h3><p class="ui-li-desc">'+ item_comunicacion.texto +'</p></li>';
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
function _get_comunicados(nid,page){
    
	//console.log(nid);
	
	var data_request ={
		name: 'cl_comunicados',
		hijo:  nid,
		done: function( data_recibida ){
			var json_comunicados = data_recibida;
			console.log(json_comunicados);
			
			var html_agenda = "";
			if (json_comunicados.nodes.length ==0){
				$("#eventos_de_" + page).html("<li><center>NO HAY COMUNICADOS</center></li>");
				$("#eventos_de_" + page).listview().listview('refresh');
				
			}else{
				$.each(json_comunicados.nodes, function (key,value) {
					var item_comunicado = value.node;
					
					
					//var sDate = _gethora(item_comunicado.fecha);
					var sDate = "";
			
					//html_agenda +='<li role-data="' + item_comunicado.id + '" class="ui-li" ><p  class="ui-li-aside">'+ sDate +'</p><h3 style="text-transform:capitalize;">Comunicado</h3><p class="ui-li-desc">'+ item_comunicado.texto +'</p></li>';
					html_agenda +='<li role-data="' + item_comunicado.id + '" class="ui-li" ><p  class="ui-li-aside">'+ sDate +'</p><h3 style="text-transform:capitalize;">Comunicado</h3><p class="ui-li-desc">'+ item_comunicado.texto +'</p></li>';
				
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


function _gethora(strDate) {
	var currentTime = new Date(strDate)
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

	$arr_date = $("#input_dia_actual").val().split("-");

	var today = new Date($arr_date[0],$arr_date[1],$arr_date[2]);
	var tomorrow = new Date();

	if (operacion =="sumar") tomorrow.setTime(today.getTime() + (dias * 86400000));
	if (operacion =="restar") tomorrow.setTime(today.getTime() - (dias * 86400000));


	strDay = tomorrow.getFullYear() + "-" + (tomorrow.getMonth() ) + "-" + tomorrow.getDate();

	$("#input_dia_actual").attr('value',strDay);
	//console.log(strDay);

	$(".lb_fecha_hoy").html(tomorrow.getDate() + " de " + _get_month_name(tomorrow.getMonth()) + " del " + tomorrow.getFullYear());
	
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
	
	console.log(nid + " id en comunicaciones");
	
	var mmddStr = sprintf('%02d-%02d',(tomorrow.getMonth() + 1),tomorrow.getDate());
	var dt_comunicacion = tomorrow.getFullYear() + "-" + mmddStr;
		
	_get_comunicaciones(nid,'dashboard', dt_comunicacion);
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

function _get_month_name($month_id){

	var mesok=_get_months();
	
	return mesok[$month_id];
}