

function initBrowser(locs_loaded){
    //init the browser
    let location_container = document.getElementById("location-parent");
    let location_template = document.getElementById("location-template");
    for (loc in locs_loaded) {

        let new_location = location_template.cloneNode(true);

        //set the id of the new location
        new_location.content.firstElementChild.id = loc;

        new_location.content.getElementById("location-name").innerHTML = locs_loaded[loc]["location-visible-name"];
        new_location.content.getElementById("location-description").innerHTML = locs_loaded[loc]["description"];
        new_location.content.getElementById("location-score-overall").innerHTML = locs_loaded[loc]["score-overall"];
        new_location.content.getElementById("location-score-vibe").innerHTML = locs_loaded[loc]["score-vibe"];

        //add the event listener to the location
         // Create a closure for the click event listener
        let click = (function (locationURL, locationID) {
            return function () {
            openLocation(locationURL, locationID);
            };
        })(locs_loaded[loc]["location-url"], loc);
        new_location.content.firstElementChild.addEventListener("click", click);

        //add the location to the location container
        location_container.appendChild(new_location.content.firstElementChild);
    }
}

async function initMap(locs_loaded){


    for (loc in locs_loaded){
        let mrk = L.marker([locs_loaded[loc]["lat"], locs_loaded[loc]["lon"]], {icon: myIcon});
        let obj = document.getElementById(loc);

        //function to adjust styles on hover
        let mrk_enter = function(){
            mrk.setIcon(myIconHover);
            obj.classList.add("darken");
        };

        //function to adjust styles on leave
        let mrk_leave = function(){
            mrk.setIcon(myIcon);
            obj.classList.remove("darken");
        };

        //function to open the location preview with click on marker
        let mrk_click = function(){
            obj.click();
        }

        //generate event listeners for location list hover
        let create_hover = function(){
            obj.addEventListener("mouseenter", mrk_enter);
            obj.addEventListener("mouseleave", mrk_leave);

            //event listeners for hover color
            mrk.addEventListener("mouseover", mrk_enter);
            mrk.addEventListener("mouseout", mrk_leave);
        }

        //generate event listeners for location list hover
        let delete_hover = function(){
            obj.removeEventListener("mouseenter", mrk_enter);
            obj.removeEventListener("mouseleave", mrk_leave);

            //event listeners for hover color
            mrk.removeEventListener("mouseover", mrk_enter);
            mrk.removeEventListener("mouseout", mrk_leave);
        }
        create_hover();

        //event listener for click
        mrk.addEventListener("click", mrk_click);

        //add the markers (and store them in the locs object)
        mrk.addTo(map);


        locs[ loc] = {
            "lat": locs_loaded[loc]["lat"],
            "lon": locs_loaded[loc]["lon"],
            "html_obj": obj,
            "visible": true,
            "marker" : mrk,
            "hover_create": create_hover,
            "hover_abort": delete_hover,
        };

    }
}

function replaceStateFromHash(locs_loaded){
    //generate a attempt at a state from the hash
    if (location.hash != "") {
        let hash = location.hash;
        let id = hash.substring(1);
        implementState(state(prev=true, resource=locs_loaded[id]["location-url"], id=id), last_state_global);
        history.replaceState(state(prev=true, resource=locs_loaded[id]["location-url"], id=id), "nothing");
    } else {
        history.replaceState(state(), "nothing");
    }
}


async function fetchData(){
    const resp = await fetch("assets/database/locations.json");
    const locs_loaded = await resp.json();

    //now that it is loaded spawn the 
    await initBrowser(locs_loaded);
    await initMap(locs_loaded);

    //replace the state from the hash
    replaceStateFromHash(locs_loaded);
    

}

//call it
fetchData();


//create a last state object used sometimes for back
let last_state_global = state();
