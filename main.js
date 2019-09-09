window.onload = function() {
    document.getElementById('search-field').addEventListener('keyup', suggest);

};

function suggest(event) {
    get('srv.php?cmd=1&search_phrase=' + event.target.value, set_places);
}


function set_places(response_obj) {
    var response;
    var places;
    var option;
    
    var container = document.getElementById('places');
    
    response = JSON.parse(response_obj.responseText);
    
    if (!response) {
        return false;
    }
    
    if (response.error === true) {
        alert(response.error_name);
        return false;
    }
    
    places = response.matches;
    
    
    container.innerHTML = '';
    for (var i = 0; i < places.length; i++) {
        option = document.createElement('option');
        option.setAttribute('value', places[i]);
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
