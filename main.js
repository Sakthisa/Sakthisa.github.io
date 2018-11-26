var sensorS;


function validate(){
  var e = document.getElementById("Sensor");
  var strUser = e.options[e.selectedIndex].value;
  console.log(strUser);
  sessionStorage.setItem('sensor', strUser);
  window.location.href = "timeseries.html";
}

function ajax1(){
        return $.ajax({
                url: "http://localhost:8080/api/raw_data",
                type: 'GET',
                dataType: 'json', // added data type
                // success: function(res) {
                //     getData(res, 0);
                // }
        });
}

function ajax2(){
      return $.ajax({
                  url: "http://localhost:8080/api/fault_data",
                  type: 'GET',
                  dataType: 'json', // added data type
                  // success: function(res) {
                  //     getData(res, 1);
                  // }
      });
}


window.onload = function(){
  if (window.location.href.indexOf('timeseries.html') > -1) {
    $.when(ajax1(), ajax2()).done(function(a1, a2){
        sensorS = sessionStorage.getItem('sensor');
        console.log(a1[0]);
        console.log(a2[0]);
        getData(a1[0], a2[0]);
    });
  }
}


function getData(dataRaw, faultData){
  var myChart = document.getElementById('myChart').getContext('2d');
  console.log(dataRaw);
  var sensor = sensorS;
  console.log(sensorS);
  processData(dataRaw, faultData, myChart, sensor);

}

function addnew(){
    var found = 0;
    var e = document.getElementById("Sensor");
    var sensor = e.options[e.selectedIndex].value;
    var newChartID = "nChart" + sensor;
    if(!document.getElementById(newChartID)){
      $.when(ajax1(), ajax2()).done(function(a1, a2){
          sensorS = sessionStorage.getItem('sensor');
          console.log(a1[0]);
          console.log(a2[0]);
          var container = document.getElementById('container');
          var newChart = document.createElement('canvas');
          newChart.setAttribute("id", newChartID);
          console.log(container);
          container.appendChild(newChart);
          var myChart = document.getElementById(newChartID).getContext('2d');
          processData(a1[0], a2[0], myChart, sensor);
      });
    }

}

function processData(data, faultData, myChart, sensor){
    var date = [];
    var rawdata  = [];
    console.log(data);
    console.log(faultData);
    if(sensor == "wg"){
      Object.keys(data.timeseries.windgusts).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.windgusts[key]);
          console.log(date);
        }
      });
    }
    else if(sensor == "wd"){
      Object.keys(data.timeseries.winddirection).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.winddirection[key]);
        }
      });
    }
    else if(sensor == "ws"){
      Object.keys(data.timeseries.windspeed).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.windspeed[key]);
        }
      });
    }
    else if(sensor == "te"){
      Object.keys(data.timeseries.temperature).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.temperature[key]);
        }
      });
    }
    else if(sensor == "rh"){
      Object.keys(data.timeseries.relativehumidity).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.relativehumidity[key]);
        }
      });
    }
    else if(sensor == "ra"){
      Object.keys(data.timeseries.radiation).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.radiation[key]);
        }
      });
    }
    else if(sensor == "ap"){
      Object.keys(data.timeseries.atmosphericpressure).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.atmosphericpressure[key]);
        }
      });
    }
    else if(sensor == "ec"){
      Object.keys(data.timeseries.electricalconductivity).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.electricalconductivity[key]);
        }
      });
    }
    else if(sensor == "vp"){
      Object.keys(data.timeseries.vaporpressure).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.vaporpressure[key]);
        }
      });
    }
    else if(sensor == "pr"){
      Object.keys(data.timeseries.precipitation).forEach(function(key){
        if(key[14] == "0" && key[15] == "0"){
          date.push(key);
          rawdata.push(data.timeseries.precipitation[key]);
        }
      });
    }
    createChart(date, rawdata, myChart, faultData, sensor);

}

function getMax(obj) {
  return Math.max.apply(null,Object.keys(obj));
}

function createChart(date, rawdata, myChart, data, sensor){
 var qualityDate = [];
 var erroneousDate = [];
 var testErr = [];
 var erroneousTest = [];
 var doubtfulTest = [];
 var doubtfulDate = [];
 var doubtfulstartDate = [];
 var findDoubt = [];
 var endDoubt = [];
 var findErr = [];
 var startDate = [];
 var endDate = [];

 console.log(sensor);
 console.log(date);
 //console.log(data.timeseries.windgusts);

 for(i = 0; i < data.length; i++){
   //console.log(data[i].type);
   if(data[i].type == sensor){
       //console.log(data[i]);
       qualityDate.push(data[i].date);
       if(data[i].quality == 4 && data[i].date[14] == "0" && data[i].date[15] == "0"){
         //testErr.push(data[i]);
         erroneousDate.push(data[i].date);
         console.log(erroneousDate);
         erroneousTest.push(Object.keys(data[i].qc).reduce(function(a, b){ return data[i][a] > data[i][b] ? a : b }));
       }
       else if (data[i].quality == 3 && data[i].date[14] == "0" && data[i].date[15] == "0"){
         doubtfulDate.push(data[i].date);
         doubtfulTest.push(Object.keys(data[i].qc).reduce(function(a, b){ return data[i][a] > data[i][b] ? a : b }));
       }
   }
 }

 //testErr.push(data[5]);
 var test = 0;
 for(i = 0; i < qualityDate.length; i++){
   qualityDate[i] = qualityDate[i].replace(":00.000Z", "");
 }
 for(i = 0; i < erroneousDate.length; i++){
   erroneousDate[i] = erroneousDate[i].replace(":00.000Z", "");
 }
 for(i = 0; i < doubtfulDate.length; i++){
   doubtfulDate[i] = doubtfulDate[i].replace(":00.000Z", "");
 }

 console.log(doubtfulDate);
 console.log(erroneousDate);
 //console.log(date);

 for(i = 0; i < date.length; i++){
   for(j = 0; j < doubtfulDate.length; j++){
     if(doubtfulDate[j] == date[i]){
       doubtfulstartDate.push(i);
     }
   }
 }


 var sum = doubtfulstartDate[0];
 if(doubtfulstartDate.length != 0){
   findDoubt.push(doubtfulstartDate[0]);
 }
 for(i = 0; i < doubtfulstartDate.length; i++){
   if(sum != doubtfulstartDate[doubtfulstartDate.length-1]){
     if(sum + 1 == doubtfulstartDate[i+1]){
       sum = doubtfulstartDate[i+1];
     }
     else{
       endDoubt.push(doubtfulstartDate[i]);
       findDoubt.push(doubtfulstartDate[i+1])
       sum = doubtfulstartDate[i+1];
     }
   }
   if(sum == doubtfulstartDate[doubtfulstartDate.length-1]){
     if(typeof doubtfulstartDate[i+1] != 'undefined'){
         endDoubt.push(doubtfulstartDate[i+1]);
     }
   }
 }

  console.log(date.length);
  for(i = 0; i < date.length; i++){
    for(j = 0; j < erroneousDate.length; j++){
      //console.log(date[i]);
      //console.log(erroneousDate[j]);
      if(erroneousDate[j] == date[i]){
        startDate.push(i);
      }
    }
  }

  var sum = startDate[0];
  if(startDate.length != 0){
    findErr.push(startDate[0]);
  }
  for(i = 0; i < startDate.length; i++){
    console.log(startDate[i]);
    if(sum != startDate[startDate.length-1]){
      if(sum + 1 == startDate[i+1]){
        sum = startDate[i+1];
      }
      else{
        endDate.push(startDate[i]);
        findErr.push(startDate[i+1])
        sum = startDate[i+1];
      }
    }
    if(sum == startDate[startDate.length-1]){
      if(typeof startDate[i+1] != 'undefined'){
          endDate.push(startDate[i+1]);
      }
    }
  }
  console.log(findErr.length);

function secondMax(){
    biggest = -Infinity,
    next_biggest = -Infinity;

    for (var i = 0, n = rawdata.length; i < n; ++i) {
        var nr = +rawdata[i]; // convert to number first

        if (nr > biggest) {
            next_biggest = biggest; // save previous biggest value
            biggest = nr;
        } else if (nr < biggest && nr > next_biggest) {
            next_biggest = nr; // new second biggest value
        }
    }
    console.log(next_biggest);
    if(next_biggest == 0){
      return .04;
    }
    return next_biggest;
}

  let generalChart = new Chart(myChart, {
       type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
       data:{
         labels:date,
         datasets:[{
           label:'Raw Data',
           lineTension: 0,
           data: rawdata,
           borderColor: "black",
           backgroundColor: "white",
           pointBackgroundColor: ["white"],
           fill: false

         }]
       },
       options: {
         elements: {
            line: {
                tension: 0
            }
        },
         legend: {
              display: true,
              labels: {
                  fontColor: 'black'
              }
        },
         tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    console.log(tooltipItem);
                    var label = tooltipItem.xLabel;
                    for(i = 0; i < erroneousDate.length; i++){
                      if(label == erroneousDate[i]){
                        return label = "Erroneous " + "(" + erroneousTest[i] + ") " + tooltipItem.yLabel;
                      }
                    }
                    return label = "Valid " + tooltipItem.yLabel;
                    console.log(label);
                }
            }
        },
         title: {
            display: true,
            text: 'Wind Gust (TA000111)'
         },
         scales: {
           yAxes: [{
             ticks: {
               min: Math.min.apply(this, rawdata),
               max: secondMax(),
               fontColor: "black",
               stepSize: 5
             },
             scaleLabel: {
               display: true,
               labelString: 'Value'
             }
           }],
           xAxes: [{
             scaleLabel: {
               display: true,
               fontColor: "black",
               labelString: 'Date'
             }
           }]
         },
         annotation: {
           drawTime: 'afterDatasetsDraw',
           events: ['click'],
           annotations: [{
               type: 'box',
               xScaleID: 'x-axis-0',
               yScaleID: 'y-axis-0',
               xMin: "2018-06-09T08:00",
               xMax: "2018-06-09T13:00",
               yMin: 0,
               yMax: 1000000,
               backgroundColor: 'rgba(251, 3, 3, 0.0)',
               borderColor: 'white',
               borderWidth: 0,
               onClick: function(e) {
                   console.log('Box', e.type, this);
               }
           }]
       },
           pan: {
             // Boolean to enable panning
             enabled: true,

             // Panning directions. Remove the appropriate direction to disable
             // Eg. 'y' would only allow panning in the y direction
             mode: 'xy'
         },

       // Container for zoom options
         zoom: {
             // Boolean to enable zooming
             enabled: true,
             limits: {
               max: 0,
               min: 10
             },


             // Zooming directions. Remove the appropriate direction to disable
             // Eg. 'y' would only allow zooming in the y direction
             mode: 'xy'
         }

       }
     });

     generalChart.data.datasets.push(new Object);
     generalChart.data.datasets[1].label = "Sensor Range (rs)"
     generalChart.data.datasets[1].borderColor = "black";
     generalChart.data.datasets[1].backgroundColor = "green";

     generalChart.data.datasets.push(new Object);
     generalChart.data.datasets[2].label = "Climate Change (rc)"
     generalChart.data.datasets[2].borderColor = "black";
     generalChart.data.datasets[2].backgroundColor = "purple";

     generalChart.data.datasets.push(new Object);
     generalChart.data.datasets[3].label = "Step Test (ts)"
     generalChart.data.datasets[3].borderColor = "black";
     generalChart.data.datasets[3].backgroundColor = "blue";

     generalChart.data.datasets.push(new Object);
     generalChart.data.datasets[4].label = "Delta Test (td)"
     generalChart.data.datasets[4].borderColor = "black";
     generalChart.data.datasets[4].backgroundColor = "yellow";

     generalChart.data.datasets.push(new Object);
     generalChart.data.datasets[5].label = "Sigma Test (ti)"
     generalChart.data.datasets[5].borderColor = "black";
     generalChart.data.datasets[5].backgroundColor = "teal";

     generalChart.data.datasets.push(new Object);
     generalChart.data.datasets[6].label = "Erroneous"
     generalChart.data.datasets[6].borderColor = "black";
     generalChart.data.datasets[6].backgroundColor = 'rgba(251, 3, 3, 0.6)';

     generalChart.data.datasets.push(new Object);
     generalChart.data.datasets[7].label = "Doubtful"
     generalChart.data.datasets[7].borderColor = "black";
     generalChart.data.datasets[7].backgroundColor = 'rgba(250, 113, 67, 0.8)';

     console.log(generalChart.data.datasets);
     console.log(sensor);
     if(sensor == "wg"){
       generalChart.options.title.text = "Wind Gust";
     }
     else if(sensor == "ws"){
       generalChart.options.title.text = "Wind Speed";
     }
     else if(sensor == "wd"){
       generalChart.options.title.text = "Wind Direction";
     }
     else if(sensor == "te"){
       generalChart.options.title.text = "Temperature";
     }
     else if(sensor == "rh"){
       generalChart.options.title.text = "Relative Humidity";
     }
     else if(sensor == "ap"){
       generalChart.options.title.text = "Atmospheric Pressure";
     }
     else if(sensor == "ra"){
       generalChart.options.title.text = "Radiation";
     }
     else if(sensor == "vp"){
       generalChart.options.title.text = "Vapor Pressure";
     }
     else if(sensor == "pr"){
       generalChart.options.title.text = "Precipitation";
     }
     else if(sensor == "ec"){
       generalChart.options.title.text = "Electrical Conductivity";
     }



     var annotationamt = 0;
     for(var i = 0; i < findErr.length; i++){
       generalChart.options.annotation.annotations.push(new Object);
       generalChart.options.annotation.annotations[i].xMin = date[findErr[i]];
       generalChart.options.annotation.annotations[i].xMax = date[endDate[i]];
       generalChart.options.annotation.annotations[i].type = 'box';
       generalChart.options.annotation.annotations[i].yScaleID ='y-axis-0';
       generalChart.options.annotation.annotations[i].xScaleID = 'x-axis-0';
       generalChart.options.annotation.annotations[i].yMin = 0;
       generalChart.options.annotation.annotations[i].yMax = Math.max.apply(this, rawdata)+5;
       generalChart.options.annotation.annotations[i].backgroundColor = 'rgba(251, 3, 3, 0.4)';
       generalChart.options.annotation.annotations[i].borderColor = 'black';
       generalChart.options.annotation.annotations[i].borderWidth = 1;
       //generalChart.options.annotation.annotations.push(new Object);
       annotationamt++;
     }

     for(var i = 0; i < findDoubt.length; i++){
       generalChart.options.annotation.annotations.push(new Object);
       generalChart.options.annotation.annotations[annotationamt].xMin = date[findDoubt[i]];
       generalChart.options.annotation.annotations[annotationamt].xMax = date[endDoubt[i]];
       generalChart.options.annotation.annotations[annotationamt].type = 'box';
       generalChart.options.annotation.annotations[annotationamt].yScaleID ='y-axis-0';
       generalChart.options.annotation.annotations[annotationamt].xScaleID = 'x-axis-0';
       generalChart.options.annotation.annotations[annotationamt].yMin = 0;
       generalChart.options.annotation.annotations[annotationamt].yMax = Math.max.apply(this, rawdata)+5;
       generalChart.options.annotation.annotations[annotationamt].backgroundColor = 'rgba(250, 113, 67, 0.8)';
       generalChart.options.annotation.annotations[annotationamt].borderColor = 'black';
       generalChart.options.annotation.annotations[annotationamt].borderWidth = 1;
       //generalChart.options.annotation.annotations.push(new Object);
       annotationamt++;
     }

     for (i = 0; i < generalChart.data.datasets[0].data.length; i++){
       generalChart.data.datasets[0].pointBackgroundColor[i] = 'white';
     }
     generalChart.update();
     console.log(generalChart.options.annotation.annotations);
     console.log(generalChart);
     console.log(generalChart.data.datasets[0].pointBackgroundColor);
     for (i = 0; i < generalChart.data.datasets[0].data.length; i++) {
       for(j = 0; j < erroneousDate.length; j++){
         if(generalChart.data.labels[i] == erroneousDate[j]){
           if(erroneousTest[j] == "rs"){
             generalChart.data.datasets[0].pointBackgroundColor[i] = 'green';
           }
           else if(erroneousTest[j] == "rc"){
             generalChart.data.datasets[0].pointBackgroundColor[i] = 'purple';
           }
           else if(erroneousTest[j] == "ts"){
             generalChart.data.datasets[0].pointBackgroundColor[i] = 'blue';
           }
           else if(erroneousTest[j] == "td"){
             generalChart.data.datasets[0].pointBackgroundColor[i] = 'yellow';
           }
           else if(erroneousTest[j] == "ti"){
             generalChart.data.datasets[0].pointBackgroundColor[i] = 'teal';
           }
         }
       }
    }

    for (i = 0; i < generalChart.data.datasets[0].data.length; i++) {
      for(j = 0; j < doubtfulDate.length; j++){
        if(generalChart.data.labels[i] == doubtfulDate[j]){
          if(doubtfulTest[j] == "rs"){
            generalChart.data.datasets[0].pointBackgroundColor[i] = 'green';
          }
          else if(doubtfulTest[j] == "rc"){
            generalChart.data.datasets[0].pointBackgroundColor[i] = 'purple';
          }
          else if(doubtfulTest[j] == "ts"){
            generalChart.data.datasets[0].pointBackgroundColor[i] = 'blue';
          }
          else if(doubtfulTest[j] == "td"){
            generalChart.data.datasets[0].pointBackgroundColor[i] = 'yellow';
          }
          else if(doubtfulTest[j] == "ti"){
            generalChart.data.datasets[0].pointBackgroundColor[i] = 'teal';
          }
        }
      }
   }
    console.log(generalChart.data.datasets[0].pointBackgroundColor);
    generalChart.update();

}
