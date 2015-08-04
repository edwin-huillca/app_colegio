Info:

```
#!javascript

cl_app.hijo_activo // el hijo activo, 0 si no hay hijos

```

Para pedir data:

```
#!javascript

// Todos los hijos
var data_request = {
  name: 'cl_hijos',  // nombre del dato
  done: function( data_recibida ){ console.log( data_recibida ); }, // funcion a ejecutar cuando se tiene el dato
  fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); } // funcion a ejecutar cuando se tiene errores
};
cl_get_data( data_request );

// Todas las comunicaciones por fecha e hijo
data_request = {
  name: 'cl_comunicaciones',
  fecha: '2015-07-13', // fecha de las comunicaciones
  done: function( data_recibida ){ console.log( data_recibida ); },
  fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); }
};
cl_get_data( data_request );

// Agenda por fecha e hijo
data_request = {
  name: 'cl_agenda',
  fecha_agenda: '2015-07-25', // fecha de la agenda
  done: function( data_recibida ){ console.log( data_recibida ); },
  fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); }
};
cl_get_data( data_request );

// Comunicados
data_request = {
  name: 'cl_comunicados',
  done: function( data_recibida ){ console.log( data_recibida ); },
  fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); }
};
cl_get_data( data_request );

// Asistencia
data_request = {
  name: 'cl_asistencia',
  done: function( data_recibida ){ console.log( data_recibida ); },
  fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); }
};
cl_get_data( data_request );



```

