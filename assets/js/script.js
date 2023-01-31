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