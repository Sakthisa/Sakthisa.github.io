var ourRequest = new XMLHttpRequest();

//Get JSON information from website
ourRequest.open('GET', 'https://learnwebcode.github.io/json-example/animals-1.json');

//What will happen on the website when the information is received
ourRequest.onload = function(){
  var ourData = JSON.parse(ourRequest.responseText); //Make the text-file an actual json file, so we can work with objects
  console.log(ourData[0]);
};

//Sending the request
ourRequest.send();
