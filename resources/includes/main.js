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
let data_holder;

let ctx; //graph 2d context
let graph;

//graph config

let conf = {
        parameterList: {
            temp:    ['Temperature', 'airTemperature', 'line', 'rgba(224, 0, 0, 1.0)'],
            wind_sp: ['Wind speed', 'windSpeed', 'line', 'rgba(224, 0, 0, 1.0)'],
            wind_gs: ['Wind gusts', 'windGust', 'line', 'rgba(224, 0, 0, 1.0)'],
            wind_dr: ['Wind direction', 'windDirection', 'bar', 'rgb(56, 147, 0, 1.0)'],
            clouds:  ['Cloud cover', 'cloudCover', 'bar', 'rgb(56, 147, 0, 1.0)'],
            press:   ['Pressure', 'seaLevelPressure', 'line', 'rgba(41, 130, 157, 1.0)'],
            rain:    ['Precipitation', 'totalPrecipitation', 'bar', 'rgba(2, 103, 180, 1.0)']
        },
        graphSettings: {
            airTemperature: ['line', 'rgba(224, 0, 0, 1.0)'],
            windSpeed: ['line', 'rgba(0, 147, 86, 1.0)'],
            windGust: ['line', 'rgba(0, 147, 86, 1.0)'],
            windDirection: ['bar', 'rgb(56, 147, 0, 1.0)'],
            cloudCover: ['bar', 'rgb(56, 147, 0, 1.0)'],
            seaLevelPressure: ['line', 'rgba(41, 130, 157, 1.0)'],
            totalPrecipitation: ['bar', 'rgba(2, 103, 180, 1.0)']
        }
};



//adding event listeners
window.onload = function() {
    document.getElementById('fld_search').addEventListener('keyup', suggest);
    document.getElementById('fld_search').addEventListener('change', unfocus_input);
    document.getElementById('btn_confirm').addEventListener('click', refresh_graph);
    
    //runing js to load data
    graph = document.getElementById('graph');
    
    //load meteorological parametet list
    let met_list = document.getElementById('met_param');
    let met_option;
    
    for (let name_arr of Object.values(conf.parameterList)){
        met_option = document.createElement('option');
        met_option.innerHTML = name_arr[0];
        met_option.value = name_arr[1];
        met_list.appendChild(met_option);
        met_option = null;
    }
    
};


/*
 ******** Project-specific functions
*/

/*
 * Listener function for keyup in city field
 */
function suggest(event) {
    get('srv.php?cmd=1&search_phrase=' + event.target.value, set_places);
}

/*
 * Listener function for keyup in click
 */
function refresh_graph() {
    let place = document.getElementById('fld_search').value;
    get('srv.php?cmd=2&place=' + place, set_graph_data);
}

/*
 * Callback for refresh_graph() - data restructuring and painting new graph
 */
function set_graph_data(response) {
    //get selected meteorological parameter
    let selected_par = document.getElementById('met_param');
    
    let graph_type = conf.graphSettings[selected_par.value][0];
    let graph_color = conf.graphSettings[selected_par.value][1];
    
    let dates = [];
    
    let hour_seconds = 3600;
    let date_diff;

    let empty_count;
    
    //unset previous values
    data_holder = {};
    
    //to array
    let data_points = JSON.parse(response.responseText);
    
    if (!data_points) {
        return false;
    }
    
    for (let i = 0; i < data_points.length; i++) {
        if (typeof data_points[i] != 'undefined' && typeof data_points[i + 1] != 'undefined') {
            date_diff = new Date(data_points[i + 1]['forecastTimeUtc']) - new Date(data_points[i]['forecastTimeUtc']);
            date_diff = date_diff / 1000;
            if (date_diff > hour_seconds && date_diff % hour_seconds == 0) {
                empty_count = date_diff / hour_seconds;
            }
        }
        for (var key in data_points[i]) {
            if (typeof data_holder[key] == 'undefined') {
                data_holder[key] = [];
            }
            data_holder[key].push(data_points[i][key]);
            for (let j = 0; j < empty_count; j++) {
                data_holder[key].push(null);
            }
        }
        empty_count = 0;
    }
    
    for (var index in data_holder.forecastTimeUtc) {
        dates.push(utc_to_local(data_holder.forecastTimeUtc[index]));
    }
    
    
    graph = reset_canvas(document.getElementById('graph'));
    ctx = document.getElementById('graph').getContext('2d');
    
    
    graph = new Chart(ctx, {
        type: graph_type,
        data: {
            labels: dates,
            datasets: [{
                label: selected_par.options[selected_par.selectedIndex].innerHTML,
                fill: false,
                borderColor: graph_color,
                pointBackgroundColor: graph_color,
                pointBorderColor: graph_color,
                backgroundColor: graph_color,
                spanGaps: true,
                lineTension: 0,
                borderWidth: 2,
                pointRadius: 2,
                data: data_holder[selected_par.value]
            }]
        },
        options: {}
    });
}

/*
 * Callback for suggest()
 * generates autocompletion list based on search by keyword
 */
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
        console.log(response.error_name);
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
