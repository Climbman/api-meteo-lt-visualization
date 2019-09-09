document.onload = function() {
    document.getElementById('search-field').onkeyup = function() {
        get('srv.php?cmd=1&search_phrase=' + this.value, set_places);
    };
};


function set_places(response_obj) {
    var response;
    var places;
    var option;
    
    var container = document.getElementById('places');
    
    response = JSON.parse(response_obj.text);
    
    if (!response) {
        return false;
    }
    
    if (response.error === true) {
        alert(response.error_name);
        return false;
    }
    
    places = response.matches;
    
    
    
    for (var i = 0; i < places.length; i++) {
        option = createElement('option');
        option.setAtrribute('value', places[i]);
        container.appendChild(option);
    }
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
