// pure js request function
function state(prev = false, resource = null, id = null){
    return {
        prev: prev,
        resource: resource,
        id: id,
        map_state: { 
            latlon: map.getCenter(),
            zoom: map.getZoom()
        }
    }
}



let overlay = document.getElementById("overlay");
let overlay_contents = document.getElementById("overlay-contents");
let overlay_contents_loading = document.getElementById("overlay-loading-indicator"); 



async function openLocationInternal(location_url){
    
    //add a loading icon to the overlay
    overlay_contents_loading.style.display = "block";

    //request and parse
    const response = await fetch(location_url);
    const testBody = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(testBody, "text/html");


    //delete the current contents of the overlay now that the new contents have been fetched
    if (overlay_contents.firstElementChild != null) {
        overlay_contents.removeChild(overlay_contents.firstElementChild);
    }

    //remove the loading icon from the overlay, thus the beauty of async
    overlay_contents_loading.style.display = "none";

    //add the new contents to the overlay   
    overlay_contents.appendChild(doc.body.firstElementChild );
}

// updates the hover color on the map and on the location list
function update_hover(location_id = null){
    for (loc_id in locs) {
        if (loc_id != location_id) {
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

//called when you click the back button on the location card
function closeLocation(){
    if (implementState(state(prev=false), last_state_global)){
        history.pushState(state(prev=false), "nothing", " ");
    }
}

//called when you press on a location tag in the location list or when you click on a marker (works by calling .click() on the location tag)
function openLocation(location_url, location_id){
    if (implementState(state(prev=true, resource=location_url, id=location_id), last_state_global)){
        history.pushState(state(prev=true, resource=location_url, id=location_id), "nothing", "#"+location_id);
    }
}

//called when you press the back button on the browser
addEventListener('popstate', function(event) {
    implementState(event.state, last_state_global);
});


function implementState(current_state, previous_state){
    //transition between the previous_state object and the current_state object
    // this involves, pulling up the location card with transition if a location card isnt already up
    // highlighting the location on the map, zooming to it if necessary and possibly unhighlighting the previous location
    // alternativly it might require hiding all the location cards and unhighlighting all the locations on the map
    // previous state or current state will never be null.\


    if (!previous_state.prev && !current_state.prev){
        //do nothing
        console.log("previous state.prev == false && current state.prev == false");
        return false
    } else if (previous_state.id == current_state.id){
        console.log("pressed same marker twice ignoring");
        return false
    } else if (!previous_state.prev && current_state.prev){
        //open the location card
        openLocationInternal(current_state.resource);
        update_hover(current_state.id);
        mapFocus(current_state.id, previous_state.map_state);
        overlay.classList.add("slide-in"); //show the overlay
    } else if (previous_state.prev && current_state.prev){
        //change the location card
        openLocationInternal(current_state.resource);
        update_hover(current_state.id);
        mapFocus(current_state.id, previous_state.map_state);
    } else if (previous_state.prev && !current_state.prev){
        //close the location card
        update_hover();
        overlay.classList.remove("slide-in"); //hide the overlay
        //return the map to previous state
        map.setView(previous_state.map_state.latlon, previous_state.map_state.zoom);
    }

    //update a global state in case the browser back button is pressed
    last_state_global = current_state;

    return true
} 
