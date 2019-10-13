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

let ctx; //graph 2d context
let graph;

//graph settings:




//adding event listeners
window.onload = function() {
    document.getElementById('fld_search').addEventListener('keyup', suggest);
    document.getElementById('fld_search').addEventListener('change', unfocus_input);
    document.getElementById('btn_confirm').addEventListener('click', refresh_graph);
    
    //runing js to load data
    graph = document.getElementById('graph');
    
};


/*
 * functions for retrieving graph data
 * START
 */
function refresh_graph() {
    let place = document.getElementById('fld_search').value;
    get('srv.php?cmd=2&place=' + place, set_graph_data);
}

//callback for refresh_graph() - data restructuring and painting new graph
function set_graph_data(response) {
    //unset previous values
    dates = [];
    temperature = [];
    wind_speed = [];
    wind_gust = [];
    wind_direction = [];
    cloud_cover = [];
    sea_pressure = [];
    precipitation = [];
    condition_code = [];
    
    //to array
    let data_points = JSON.parse(response.responseText);
    
    if (!data_points) {
        return false;
    }
    
    for (let i = 0; i < data_points.length; i++) {
        dates.push(data_points[i].forecastTimeUtc);
        temperature.push(data_points[i].airTemperature);
        wind_speed.push(data_points[i].windSpeed);
        wind_gust.push(data_points[i].windGust);
        wind_direction.push(data_points[i].windDirection);
        cloud_cover.push(data_points[i].cloudCover);
        sea_pressure.push(data_points[i].seaLevelPressure);
        precipitation.push(data_points[i].totalPrecipitation);
        condition_code.push(data_points[i].conditionCode);
    }
    
    graph = reset_canvas(document.getElementById('graph'));
    ctx = document.getElementById('graph').getContext('2d');
    
    graph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Test',
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: 'rgb(255, 99, 132)',
                lineTension: 0,
                borderWidth: 2,
                pointRadius: 2,
                data: temperature
            }]
        },
        options: {}
    });
}
/*
 * functions for retrieving graph data
 * END
 */


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


//Resseting canvas to avoid new graph generation on top of the old one
function reset_canvas(canvas) {
    let canvas_id = canvas.id;
    let canvas_class = canvas.className;
    let parent = canvas.parentNode;
    
    parent.removeChild(canvas);
    canvas = document.createElement('canvas');
    canvas.id = canvas_id;
    canvas.className = canvas_class;
    parent.appendChild(canvas);
    return canvas;
}
