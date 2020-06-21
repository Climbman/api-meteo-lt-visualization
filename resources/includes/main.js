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

let places_data = [];

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
            windDirection: ['bar', 'rgba(56, 147, 0, 1.0)'],
            cloudCover: ['bar', 'rgba(80, 80, 80, 1.0)'],
            seaLevelPressure: ['line', 'rgba(41, 130, 157, 1.0)'],
            totalPrecipitation: ['bar', 'rgba(2, 103, 180, 1.0)']
        }
};



//adding event listeners
window.onload = function() {
    document.getElementById('fld_search').addEventListener('keyup', suggest);
    document.getElementById('fld_search').addEventListener('change', unfocus_input);
    document.getElementById('btn_confirm').addEventListener('click', refresh_graph);
    //document.getElementById('met_param').addEventListener('change', refresh_graph);
    //document.getElementById('met_lenght').addEventListener('change', refresh_graph);


    loadPage();
    
};


/*
 ******** Project-specific functions
*/

function loadPage() {
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

    get('srv.php?cmd=1', function (response) {
        let parsed = JSON.parse(response.responseText);
        places_data = parsed.places;
        document.getElementById('load_overlay').style.display = 'none';

    })
}

/*
 * Listener function for keyup in city field
 */
function suggest(event) {
    let search_text = event.target.value;
    let option;
    let container = document.getElementById('places');

    if (search_text.length < 3) {
        return;
    }

    container.innerHTML = '';
    for (place_code in places_data) {

        if (places_data[place_code].toUpperCase().includes(search_text.toUpperCase())) {
            option = document.createElement('option');
            option.value = place_code;
            //option.innerHTML = places_data[place_code];
            container.appendChild(option);
        }
    }
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
    let selected_lenght = document.getElementById('met_lenght');
    
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
        
        //calculate missing date points - gaps
        if (typeof data_points[i] != 'undefined' && typeof data_points[i + 1] != 'undefined') {
            date_diff = new Date(data_points[i + 1]['forecastTimeUtc']) - new Date(data_points[i]['forecastTimeUtc']);
            date_diff = date_diff / 1000;
            if (date_diff > hour_seconds && date_diff % hour_seconds == 0) {
                empty_count = date_diff / hour_seconds;
            }
        }
        
        if (i + empty_count > selected_lenght.value) {
            break;
        }
        
        
        for (var key in data_points[i]) {
            if (typeof data_holder[key] == 'undefined') {
                data_holder[key] = [];
            }
            
            if (key === 'forecastTimeUtc') {
                data_holder[key].push(utc_to_local(data_points[i][key]));
            } else {
                data_holder[key].push(data_points[i][key]);
            }
            
            for (let j = 0; j < empty_count; j++) {
                if (key === 'forecastTimeUtc') {
                    data_holder[key].push(date_add_sec(utc_to_local(data_points[i][key]), (j + 1) * hour_seconds));
                } else {
                    data_holder[key].push(null);
                }
            }
        }
        empty_count = 0;
    }
    
    
    graph = reset_canvas(document.getElementById('graph'));
    ctx = document.getElementById('graph').getContext('2d');
    
    
    graph = new Chart(ctx, {
        type: graph_type,
        data: {
            labels: data_holder.forecastTimeUtc,
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