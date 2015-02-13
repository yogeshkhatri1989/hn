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
  

});