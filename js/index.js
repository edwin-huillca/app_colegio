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
alert('hi');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
alert('hi');
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

var hoy = new Date();
var dd = hoy.getDate();
var mm = hoy.getMonth()+1;
var yyyy = hoy.getFullYear();

$(".lb_fecha_hoy").html(dd + "/" + mm + "/" + yyyy);

$.support.cors = true;
$.mobile.allowCrossDomainPages = true;

// Panel for left menu
var panel = '<div data-role="panel" id="cl_left_menu" data-position="left" data-display="push" data-theme="b"><div data-role="header"><h1>Menu</h1></div><ul data-role="listview" data-inset="true"><li><a href="#cl_dashboard">Home</a></li><li><a href="#cl_diario_calendar">Agenda</a></li><li><a href="#">Direcci&oacute;n del colegio</a></li><li><a href="#">Menu del d&iacute;a</a></li><li><a href="#">Horario del profesor</a></li><li><a href="#">Horario de clases</a></li></ul></div>';
$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#cl_left_menu").panel().enhanceWithin();
});



$( document ).on( "pageinit", function() {

  // when very page loads for first time


});



