const apiKey = "pk.eyJ1IjoiaXNodmFsIiwiYSI6ImNsZGtmZHQ2bzE3Zngzb2xsZWpld25qYXEifQ.h-MDSqkuEyiG5MPawRdT9w";
let searchHistory = [];
let coordinatesHistory = [];

// on page load, get items from local storage and display as buttons
$(function () {
    searchHistory = JSON.parse(localStorage.getItem("location")) || [];
    for (i = 0; i < searchHistory.length; i++) {
        createButton(searchHistory[i]);
    }
})

//when search button is clicked, add the input to searchHistory array and save to local storage
$("#searchButton").click(function () {
    let location = $("#searchInput").val();
    if (searchHistory.includes(location)) {
        //dont add anything to history
    } else {
        searchHistory.unshift(location);
        localStorage.setItem("location", JSON.stringify(searchHistory));
        createButton(location);
    }
    
    mapCall(location);
})

// wiki api call 
let wikiCall = function (latitude, longitude) {
    let apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${latitude}%7C${longitude}&gsradius=5000&gslimit=1&format=json&origin=*`;//insert lat and lon from mapCall.
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let pageId = data.query.geosearch[0].pageid; // get pageid from searched location.
            let pageIdUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${pageId}&explaintext=1&origin=*`; // put pageid in url for info to be extracted.       
            fetch(pageIdUrl) //fetch the url with pageid sourced from apiURL
                .then(response => response.json())
                .then(data => {
                    let article = data.query.pages[pageId].extract; // extract info from pageIdUrl.
                    $("#wikiArticle").html(article); // display wiki article on page.
                    // article overflow container 
                    document.getElementById("wikiArticle").style.width = "75%";
                    document.getElementById("wikiArticle").style.height = "9em";
                    document.getElementById("wikiArticle").style.border = "2px solid #0038ff";
                    document.getElementById("wikiArticle").style.overflowY = "scroll";
                    document.getElementById("wikiArticle").style.overflowX = "hidden";
                })
                .catch(error => {
                    console.error(error);
                    $("#wikiArticle").html("<p>No results found</p>");
                }); // display error message to page if search is not found.
        })     
}

// Map API call
let mapCall = function (location) {
    let mapboxApiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${apiKey}`;

    fetch(mapboxApiUrl)
        .then(response => response.json())
        .then(data => {
            let latitude = data.features[0].center[1];
            let longitude = data.features[0].center[0];

            // Create a Mapbox map
            mapboxgl.accessToken = apiKey;

            const map = new mapboxgl.Map({
                container: "map", // container ID
                style: "mapbox://styles/mapbox/streets-v12", // style URL
                center: [longitude, latitude], // starting position [lng, lat]
                zoom: 15, // starting zoom
            });
            
            //Sizing the scale appropriately
            let keyName = Object.keys(data.features[0]); //getting an array of object key names

            if (keyName.includes("bbox")) { //checks if there is bbox (bounding box)
                let southLat = data.features[0].bbox[0];
                let westLon = data.features[0].bbox[1];
                let northLat = data.features[0].bbox[2];
                let eastLon = data.features[0].bbox[3];
                map.fitBounds([[southLat, westLon], [northLat, eastLon]]); //setting map boundaries
            }
            wikiCall(latitude, longitude);
        })
        .catch(error => console.error(error));
}

//function to display buttons
let createButton = function (locationBtn) {
    let button = document.createElement("button");
    button.textContent = locationBtn;
    $("#searchHistory").append(button);
}

//clear search history button
$("#clearHistory").click(function () {
    searchHistory = [];
    localStorage.setItem("location", JSON.stringify(searchHistory));
    $("#searchHistory").text("");
})

//adding functionality to search history buttons
$("#searchHistory").click(function (e) {
    let search = e.target.textContent;
    mapCall(search);
});

