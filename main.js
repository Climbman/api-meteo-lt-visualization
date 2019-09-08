var places = [];

get('https://api.meteo.lt/v1/places', set_places);

setTimeout(function(){ console.log(places); }, 3000);



function set_places(response_obj) {
    var places_array;
    
    places_array = JSON.parse(response_obj.text);
    
    if (!places_array) {
        return false;
    }
    
    places = places_array;
}

function get(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
