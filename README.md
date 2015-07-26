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
  hijo:  '4',  // id del hijo
  done: function( data_recibida ){ console.log( data_recibida ); },
  fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); }
};
cl_get_data( data_request );

// Agenda por fecha e hijo
data_request = {
  name: 'cl_agenda',
  fecha_agenda: '2015-07-25', // fecha de la agenda
  hijo:  '4',  // id del hijo
  done: function( data_recibida ){ console.log( data_recibida ); },
  fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); }
};
cl_get_data( data_request );

// Comunicados
data_request = {
  name: 'cl_comunicados',
  hijo:  '4',  // id del hijo
  done: function( data_recibida ){ console.log( data_recibida ); },
  fail: function( data_recibida ){ console.log('error:'); console.log( data_recibida ); }
};
cl_get_data( data_request );


```


Tipos de datos a pedir

* cl_hijos <- todos los hijos del padre
* cl_comunicaciones <- todas las comunicaciones por dia e hijo