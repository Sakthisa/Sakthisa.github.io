var count = 1;
var animalContainer = document.getElementById("animal-info");
var button = document.getElementById("btn");

button.addEventListener("click", function() {
  var ourRequest = new XMLHttpRequest();

  //Get JSON information from website
  ourRequest.open('GET', 'https://learnwebcode.github.io/json-example/animals-' + count + '.json');

  //What will happen on the website when the information is received
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText); //Make the text-file an actual json file, so we can work with objects
    renderHTML(ourData);
  };

  //Sending the request
  ourRequest.send();
  count++;
  if(count > 3){
    button.classList.add("hide-me");
  }
});

function renderHTML(ourData) {
  var htmlString = "";

  for(i = 0; i < ourData.length; i++){
    htmlString += "<p>" + ourData[i].name + " is a " + ourData[i].species + "." + " That likes to eat ";
    for(j = 0; j < ourData[i].foods.likes.length; j++){
      htmlString += " " + ourData[i].foods.likes[j];
    }
    htmlString  += ".</p>"
  }


  animalContainer.insertAdjacentHTML('beforeend', htmlString);
}
