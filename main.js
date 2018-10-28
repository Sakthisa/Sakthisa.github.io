

  var ourRequest = new XMLHttpRequest();

  //Get JSON information from website
  ourRequest.open('GET', 'https://raw.githubusercontent.com/Sakthisa/Sakthisa.github.io/master/TA00011.json', true);

  //What will happen on the website when the information is received
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText); //Make the text-file an actual json file, so we can work with objects
    console.log(ourData);
    getData(ourData);
  };

  var erroneousData = [];
  var doubtfulData = [];
  var date = [];
  var dateamt = 1;
  var dateTemp = "";
  var doubtFulLen = 0;
  var erroneousLen = 0;
  var countOne = 0;
  var countTwo = 0;
  var countwgerr = 0;
  var countwgdoubt = 0;
  var wgerr = [];
  var wgdoubt = [];
  var sumwd = 0;
  var sumws = 0;

  function getData(data){
    date[0] = data[0].date;
    for(i = 0; i < data.length; i++){
        dateTemp = data[i].date;
        if(typeof data[i+1] != "undefined"){
          if(dateTemp !== data[i+1].date){
            dateTemp = data[i+1].date;
            date[dateamt] = data[i+1].date;
            dateamt++;
          }
        }
    }


    for(i = 0; i < data.length; i++){
      if(date[countOne] === data[i].date){
        if(data[i].quality === 4){
          erroneousData[countOne] = ++erroneousLen;
          doubtfulData[countOne] = 0
        }
        else{
          doubtfulData[countOne] = ++doubtFulLen;
          erroneousData[countOne] = 0
        }
      }
      else{
        countOne++;
        erroneousLen = 1;
        doubtFulLen = 1;
        if(data[i].quality === 4){
          erroneousData[countOne] = erroneousLen;
          doubtfulData[countOne] = 0
        }
        else{
          doubtfulData[countOne] = doubtFulLen;
          erroneousData[countOne] = 0
        }
      }
    }

    countOne = 0;


    for(i = 0; i < data.length; i++){
      if(date[countOne] === data[i].date){
        if(data[i].quality === 4 && data[i].type === "wg"){
          wgerr[countOne] = ++countwgerr;
          wgdoubt[countOne] = 0;
        }
        else if(data[i].quality === 3 && data[i].type === "wg"){
          wgdoubt[countOne] = ++countwgdoubt;
          wgerr[countOne] = 0;
        }
        else if (data[i].quality === 3 && data[i].type != "wg" || data[i].quality === 4 && data[i].type != "wg"){
          if(typeof wgerr[countOne] === 'undefined'){
            wgerr[countOne] = 0;
            wgdoubt[countOne] = 0;
          }

        }
      }
      else{
        countOne++;
        countwgerr = 0;
        countwgdoubt = 1;
        if(data[i].quality === 4 && data[i].type === "wg"){
          wgerr[countOne] = countwgerr;
          wgdoubt[countOne] = 0;
        }
        else if(data[i].quality === 3 && data[i].type === "wg"){
          wgdoubt[countOne] = countwgdoubt;
          wgerr[countOne] = 0;
        }
        else if (data[i].quality === 3 && data[i].type != "wg" || data[i].quality === 4 && data[i].type != "wg"){
          if(typeof wgerr[countOne] === 'undefined'){
            wgerr[countOne] = 0;
            wgdoubt[countOne] = 0;
          }
        }

        }
      }

    console.log(wgerr.length);
    console.log(wgerr[0]);
    console.log(wgdoubt.length);


  }

  //Sending the request
  ourRequest.send();

  var dataNum = [617594, 181045];

  var myChart = document.getElementById('myChart').getContext('2d');
  var wgChart = document.getElementById('wgChart').getContext('2d');

  let GeneralChart = new Chart(myChart, {
       type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
       data:{
         labels:date,
         datasets:[{
           label:'Erroneous',
           data: erroneousData,
           borderColor: "red",
           pointBackgroundColor: "black",
           fill: false

         }, {
           label:'Doubtful',
           data: doubtfulData,
           borderColor: "orange",
           pointBackgroundColor: "black",
           fill: false

         }]
       },
       options: {
         title: {
            display: true,
            text: 'General Info (TA000111)'
         },
         scales: {
           yAxes: [{
             scaleLabel: {
               display: true,
               labelString: 'Quality Amount'
             }
           }],
           xAxes: [{
             scaleLabel: {
               display: true,
               labelString: 'Date'
             }
           }]
         }
       }
     });


     let windgChart = new Chart(wgChart, {
          type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
          data:{
            labels:date,
            datasets:[{
              label:'Erroneous',
              data: wgerr,
              borderColor: "red",
              pointBackgroundColor: "black",
              fill: false

            }, {
              label:'Doubtful',
              data: wgdoubt,
              borderColor: "orange",
              pointBackgroundColor: "black",
              fill: false

            }]
          },
          options: {
            title: {
               display: true,
               text: 'Windgust Count (TA000111)'
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Quality Amount'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                }
              }]
            }
          }
        });
