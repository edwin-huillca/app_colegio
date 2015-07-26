/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

/*

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
*/
    }
};

//app.initialize();


// jdrupal settings
Drupal.settings.site_path = "http://colegio.logicaldesign.pe";
Drupal.settings.endpoint = "rest";


// jqm settings
$.support.cors = true;
$.mobile.allowCrossDomainPages = true;

// app settings
var hoy = new Date();
var _dd = hoy.getDate();
var _mm = hoy.getMonth()+1;
var _yyyy = hoy.getFullYear();

var cl_app = {};
cl_app.hijo_activo = 0; // guarda el nid del hijo activo


// Panel for left menu
var panel = '<div data-role="panel" id="cl_left_menu" data-position="left" data-display="push" data-theme="b"><div data-role="header"><h1>Menu</h1></div><ul data-role="listview" data-inset="true"><li><a href="#cl_dashboard">Home</a></li><li><a href="#cl_agenda">Agenda</a></li><li><a href="#cl_comunicados">Comunicados</a></li><li><a href="#">Direcci&oacute;n del colegio</a></li><li><a href="#">Menu del d&iacute;a</a></li><li><a href="#">Horario del profesor</a></li><li><a href="#">Horario de clases</a></li><li><a href="#cl_salir">Salir</a></li></ul></div>';
$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#cl_left_menu").panel().enhanceWithin();
});



$( document ).on( "pageinit", function() {

  // when any page loads for first time
	$(".sel_hijos").on('change', function ($x, $page){
		var nid = 0;
		if (cl_app.hijo_activo ==0) nid = parseInt($(this).val(),10);
		
		//Not evento trigger
		if ($page !=""){
			$page =$(this).attr("id").replace("selhijos_","");
			
			nid = parseInt($(this).val(),10);
			cl_app.hijo_activo = nid;
		}
		
		if ($page =="dashboard" || $page=="diario_calendar"){
			_get_comunicaciones(nid,$page);
		}else if($page =="agenda"){
			_get_agenda(nid,$page);
		}else if($page =="comunicados"){
			_get_comunicados(nid,$page);
		}
		
		return false;
	});

});






