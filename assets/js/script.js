const apiKey = "pk.eyJ1IjoiaXNodmFsIiwiYSI6ImNsZGtmZHQ2bzE3Zngzb2xsZWpld25qYXEifQ.h-MDSqkuEyiG5MPawRdT9w";

let searchHistory = [];

// on page load, get items from local storage and display as buttons
$(function () {
    searchHistory = JSON.parse(localStorage.getItem("location")) || [];
    for (i = 0; i < searchHistory.length; i++) {
        createButton(searchHistory[i]);
    }
})

//when search button is clicked, add the input to searchHistory array and save to local storage
$("#searchButton").click(function () {
    let location = document.querySelector("#searchInput").value;
    if (searchHistory.includes(location)) {
        //dont add anything to history
    } else {
        searchHistory.unshift(location);
        localStorage.setItem("location", JSON.stringify(searchHistory));
        createButton(location);
    }

    // wiki api call 

    let searchTerm = $("#searchInput").val();
    let apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&format=json&origin=*`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.query.search.length > 0) {
                let firstResult = data.query.search[0].snippet;
                $("#wikiArticle").html(firstResult);
            } else {
                throw new Error("No results found");
            }


        })
        .catch(error => {
            console.error(error);
            $("#wikiArticle").html("<p>No results found</p>");
        });

    // Map API call
    let mapboxApiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${apiKey}`;
    console.log(mapboxApiUrl);

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
                zoom: 9, // starting zoom
            });
        })
        .catch(error => console.error(error));
})





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