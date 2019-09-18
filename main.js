//globals for storing graph point data
let dates;
let temperature;
let wind_speed;
let wind_gust;
let wind_direction;
let cloud_cover;
let sea_pressure;
let precipitation;
let condition_code;



//adding event listeners
window.onload = function() {
    document.getElementById('fld_search').addEventListener('keyup', suggest);
    document.getElementById('fld_search').addEventListener('change', unfocus_input);
    document.getElementById('btn_confirm').addEventListener('click', refresh_graph);
    
    //runing js to load data
    
};


//functions for retrieving graph data
function refresh_graph() {
    let place = document.getElementById('fld_search').value;
    get('srv.php?cmd=2&place=' + place, set_graph_data);
}

function set_graph_data(response) {
    //unset previous values
    dates = null;
    temperature = null;
    wind_speed = null;
    wind_gust = null;
    wind_direction = null;
    cloud_cover = null;
    sea_pressure = null;
    precipitation = null;
    condition_code = null;
    
    //to array
    let data_points = JSON.parse(response.responseText);
    
    if (!data_points) {
        return false;
    }
    
    for (let i = 0; i < data_points.length; i++) {
        //
        //
        //
        //
        //
        //
        //
    }
}



//functions for place suggestions
function suggest(event) {
    get('srv.php?cmd=1&search_phrase=' + event.target.value, set_places);
}

function set_places(response_obj) {
    let response;
    let places;
    let option;
    
    let container = document.getElementById('places');
    
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
    for (let i = 0; i < places.length; i++) {
        option = document.createElement('option');
        option.setAttribute('value', places[i]);
        container.appendChild(option);
    }
}


//General functions
function get(url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function unfocus_input(event) {
    console.log('unfocus');
    event.target.blur();
}
