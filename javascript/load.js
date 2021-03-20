/**
 * @function loadjs Loads scripts from url
 * @param {string} url
 * @param {function(){}} callback 
 */
function loadjs(url, callback){
    var head =  document.getElementsByTagName("head")[0] || document.documentElement;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

   head.appendChild(script);
}

/**
 * @function loadjson Loads json from url
 * @param {string} url 
 * @param {function(data) {}} callback 
 */
function loadjson(url, callback){
    $.getJSON(url, function(data){callback(data);})
}