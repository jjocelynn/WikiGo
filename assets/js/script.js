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
    searchHistory.push(location);
    localStorage.setItem("location", JSON.stringify(searchHistory));
    createButton(location);
})

//function to display buttons
let createButton = function (locationBtn) {
    let button = document.createElement("button");
    button.textContent = locationBtn;
    $("#searchHistory").append(button);
}