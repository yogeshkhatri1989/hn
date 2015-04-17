function getTimeByAgo(time){

  var timeByAgo = (Date.now()/1000) - time;

  var timeNames = [
    {name: "Second", value: timeByAgo },
    {name: "Minute", value: timeByAgo / (60) },
    {name: "Hour",   value: timeByAgo / (60 * 60)},
    {name: "Day",    value: timeByAgo / (24 * 60 * 60) },
    {name: "Month",  value: timeByAgo / (30 * 24 * 60 * 60) },
    {name: "Year",   value: timeByAgo / (365 * 24 * 60 * 60) }
  ];

  var i;
  for (i = 0; i < timeNames.length; i++){
    if (timeNames[i].value < 1) {
      i--;
      break;
    }
  }

  i = Math.min(i, timeNames.length - 1);

  timeByAgo = parseInt(timeNames[i].value);

  var name = timeByAgo == 1 ? timeNames[i].name : timeNames[i].name + "s";

  return timeByAgo + " " + name.toLowerCase() + " ago"

}

document.addEventListener('polymer-ready', function() {

  var topStoriesAjax = document.getElementById("top-stories-ajax");
  var hnUrl = "https://hacker-news.firebaseio.com/v0/";

  var storyTypes = {
    "top": "topstories.json",
    "ask": "askstories.json",
    "show": "showstories.json",
    "job": "jobstories.json",
    "new": "newstories.json"
  }

  window.addEventListener("hashchange", function(e){

    var hash = window.location.hash.slice(1) || "top";

    hash = storyTypes[hash] ? hash : "top";
    topStoriesAjax.url = hnUrl + storyTypes[hash];

    var hnCards = document.querySelectorAll("hn-card").array()
    hnCards.forEach(function($elem){
      $elem.parentNode.removeChild($elem);
    });

    var navTabs = document.querySelector(".nav-tabs");
    var index = navTabs.children.array().indexOf(document.querySelector("a[href='#" + hash + "']").parentNode);
    navTabs.selected = index;

    document.querySelector(".stories-loading").hidden = false;
    document.querySelector(".stories-loading").classList.add("loading");
  });

  if (!window.location.hash) {
    window.location.hash = "top";
  }

  window.dispatchEvent(new Event("hashchange"));

  topStoriesAjax.addEventListener("core-response", function(e) {

    var itemIds = e.detail.response;
    var shownItems = Math.min(itemIds.length, 30);
    var hnCard;
    var siteContent = document.getElementById("site-content");

    for (var i = 0; i < shownItems; i++){
      hnCard = document.createElement("hn-card");
      hnCard.setAttribute("itemId", itemIds[i]);
      // hnCard.classList.add("init");
      siteContent.appendChild(hnCard);
    }

    document.querySelector(".stories-loading").hidden = true;

  });

});