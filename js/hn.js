function getTimeByAgo(time){

  var timeByAgo = (Date.now()/1000) - time;
  
  var timeNames = [
    {name: "Second", value: timeByAgo },
    {name: "Minute", value: timeByAgo / (60) },
    {name: "Hour",   value: timeByAgo / (60 * 60)},
    {name: "Day",    value: timeByAgo / (24 * 60 * 60) },
    {name: "Month",  value: timeByAgo / (30 * 24 * 60 * 60) },
    {name: "Year",   value: timeByAgo / (365 * 30 * 24 * 60 * 60) }
  ];
  
  var i;
  for (i = 0; i <= timeNames.length; i++){
    if (timeNames[i].value < 1){
      i--;
      break;
    }
  }
  
  timeByAgo = parseInt(timeNames[i].value);
  
  var name = timeByAgo == 1 ? timeNames[i].name : timeNames[i].name + "s";

  return timeByAgo + " " + name.toLowerCase() + " ago"
  
}

document.addEventListener('polymer-ready', function() {
  
  var topStoriesAjax = document.getElementById("top-stories-ajax");
  
  topStoriesAjax.addEventListener("core-response", function(e) {

    var itemIds = e.detail.response;
    var shownItems = Math.min(itemIds.length, 30);
    var hnCard;

    for (var i = 0; i < shownItems; i++){
      hnCard = document.createElement("hn-card");
      hnCard.setAttribute("itemId", itemIds[i]);
      hnCard.classList.add("init");
      document.getElementById("site-content").appendChild(hnCard);
    }
    
    document.querySelector(".stories-loading").classList.remove("loading");
  });
  
  document.getElementById("newTabOption").addEventListener("change", function(e){
    
    if (this.checked){
      document.querySelectorAll("hn-card").array().forEach(function(hnCard){
        hnCard.shadowRoot.querySelector(".story-link").setAttribute("target", "_blank");
      });
    } else {

      document.querySelectorAll("hn-card").array().forEach(function(hnCard){
        hnCard.shadowRoot.querySelector(".story-link").removeAttribute("target");
      });
    }

  });

});