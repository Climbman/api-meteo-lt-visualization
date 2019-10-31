function utc_to_local(date_str) {
    let localtime = new Date();
    let date = new Date(date_str);
    date.setMinutes(date.getMinutes() - localtime.getTimezoneOffset());

    return ("" + date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) +
    " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2));
}

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
    event.target.blur();
}

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
