// pure js request function
let stateObj = {

  };
history.replaceState(stateObj, "nothing");

let overlay = document.getElementById("overlay");
let overlay_contents = document.getElementById("overlay-contents");

function httpGetAsync(theUrl, callback){
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
 

function openLocation(location_url){
    history.pushState(stateObj, "nothing", "#preview");
    if (overlay_contents.firstElementChild != null) {
        overlay_contents.removeChild(overlay_contents.firstElementChild);
    }   
    httpGetAsync(location_url, openLocationCallback)
    overlay.classList.add("slide-in");
    //put loading screen inside of overlay_contents
    
}

function openLocationCallback(response){
    let parser = new DOMParser();
    let doc = parser.parseFromString(response, "text/html");
    overlay_contents.appendChild(doc.body.firstElementChild );
}
function closeLocation(){
    //works by triggering popstate event which calls closeLocationInternal
    history.back();
}
function closeLocationInternal() {
    overlay.classList.remove("slide-in");
}

addEventListener('popstate', function(event) {
    closeLocationInternal()
});