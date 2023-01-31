let searchHistory = [];

$(function () {
    searchHistory = JSON.parse(localStorage.getItem("location")) || [];
    for (i = 0; i < searchHistory.length; i++) {
        console.log(searchHistory[i]);
        //createBtns(historyArr[i]);
    }
})

$("#searchButton").click(function () {
    let location = document.querySelector("#searchInput").value;
    console.log(location);
    searchHistory.push(location);
    localStorage.setItem("location", JSON.stringify(searchHistory));
})