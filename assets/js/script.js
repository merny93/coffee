// pure js request function
function state(prev = false, resource = null, id = null){
    return {
        prev: prev,
        resource: resource,
        id: id,
    }
}
history.replaceState(state(), "nothing");

let overlay = document.getElementById("overlay");
let overlay_contents = document.getElementById("overlay-contents");
// let locations = document.getElementsByClassName("location_container");

function httpGetAsync(theUrl, callback){
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
 

function openLocation(location_url, id, push_state = true){

    if (push_state){
        //dont let the user open the same location twice
        // might be better to prevent the click on the map... this seems easier
        //only check for this if the user is clicking on the map
        if (history.state.id == id) {
            return;
        }
        
        history.pushState(state(prev=true, resource= location_url, id=id), "nothing", "#"+id);
        
    }
    if (overlay_contents.firstElementChild != null) {
        overlay_contents.removeChild(overlay_contents.firstElementChild);
    }   
    httpGetAsync(location_url, function (response) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(response, "text/html");
        overlay_contents.appendChild(doc.body.firstElementChild );
    });
    overlay.classList.add("slide-in");
    // remove "darken" from all locations
    update_hover();

    //put loading screen inside of overlay_contents

}

function update_hover(){
    for (loc_id in locs) {
        if (loc_id != history.state.id) {
            locs[loc_id].marker.setIcon(myIcon);
            locs[loc_id].html_obj.classList.remove("darken");
            locs[loc_id].hover_abort()
            locs[loc_id].hover_create();
        } else {
            locs[loc_id].hover_abort();
            locs[loc_id].marker.setIcon(myIconHover);
            locs[loc_id].html_obj.classList.add("darken");
        }
    }
}

function openLocationCallback(response){
    
}

function closeLocation(){
    history.pushState(state(prev=false), "nothing", " ");
    closeLocationInternal();
}
function closeLocationInternal() {
    update_hover();
    overlay.classList.remove("slide-in");
}

addEventListener('popstate', function(event) {
    // deal with the back/forward button
    if (event.state.prev == false) {
        //if preview was off then close the preview box
        closeLocationInternal();
    } else {
        // open the right box. do not push state (infinite loop)
        openLocation(event.state.resource, event.state.id, push_state = false);
    }
});

