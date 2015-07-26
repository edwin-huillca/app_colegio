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
function cl_get_data( request ){
  var url_request = '';

  switch( request.name ) {
    case 'cl_hijos':
      url_request = Drupal.settings.site_path + '/cl_app_json/hijos/' + Drupal.user.uid;
      break;
    case 'cl_comunicaciones':
      url_request = Drupal.settings.site_path + '/cl_app_json/comunicacion/' +  request.fecha + '/' + request.hijo + '/' + Drupal.user.uid;
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

