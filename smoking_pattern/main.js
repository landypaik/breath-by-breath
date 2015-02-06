/* Michael Richardson helped me understand and fix errors with mouse down and mouse up */


var activities = ["coffee", "studying", "food", "traveling", "exercise", "idleTime", "smokingPeers", "alcohol", "sleep", "chores"];

function getActivity(classText)
{
  var activityName = "";

  for(var i = 0; i < activities.length; i++)
  {
    var activity = activities[i];
    if(classText.indexOf(activity) > -1)
    {
      activityName = activity;
    }
  }

  return activityName;
}

// Tracks the circles that have been changed by a mouse down and became invisible
var changeArray = [];

var margin = {top: 20, right: 0, bottom: 30, left: 70},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// setup x 
var xValue = function(d) { return d.Time;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.Day;}, // data -> value
    yScale = d3.scale.ordinal()
    .domain(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", " "])
    .rangePoints([0, height]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.Activity;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("smoking.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Time = +d.Time;
  });


xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+2]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Time");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Day");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class",
        function(d) {

          var class1;
          var class2;

          switch (d.Activity) {
            case "Coffee":
              class1 = "coffee";
              break;
            case "Studying":
              class1 = "studying";
              break;
            case "Food":
              class1 = "food";
              break;
            case "Traveling":
              class1 = "traveling";
              break;
            case "Exercise":
              class1 = "exercise";
              break;
            case "Idle Time":
              class1 = "idleTime";
              break;
            case "Smoking Peers":
              class1 = "smokingPeers";
              break;
            case "Alcohol":
              class1 = "alcohol";
              break;
            case "Sleep":
              class1 = "sleep";
              break;
            case "Chores":
              class1 = "chores";
              break;
          }

          switch (d.Week) {
            case "1":
              class2 =  "week_1";
              break;
            case "2":
              class2 =  "week_2";
              break;
            case "3":
              class2 =  "week_3";
              break;
            case "4":
              class2 = "week_4";
          }

          switch (d.Day) {
            case "Monday":
              class3 = "monday";
              break;
            case "Tuesday":
              class3 = "tuesday";
              break;
            case "Wednesday":
              class3 = "wednesday";
              break;
            case "Thursday":
              class3 = "thursday";
              break;
            case "Friday":
              class3 = "friday";
              break;
            case "Saturday":
              class3 = "saturday";
              break;
            case "Sunday":
              class3 = "sunday";
              break;
          }

          return class1 + " " + class2 + " " + class3;
        }
      )
      .attr("r", 5)
      .style("visibility", "visible")
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .style("opacity", .5)
      .on("mousedown", mousedown)
      .on("mouseup", mouseup)
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Activity"] + "<br/> (" + d["Time2"] + ")")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 38) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
      filterVisible();
/*
  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 10)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .style("opacity", .5)

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("opacity", .5)
      .text(function(d) { return d;})
*/
document.getElementById("myCheck1").onchange = function() {
  if (document.getElementById("myCheck1").checked === true) {
    d3.selectAll(".week_1").style("visibility", "visible");
  }
  else {
    d3.selectAll(".week_1").style("visibility", "hidden");
  }
  filterVisible();
};

document.getElementById("myCheck2").onchange = function() {
  if (document.getElementById("myCheck2").checked === true) {
    d3.selectAll(".week_2").style("visibility", "visible");
  }
  else {
    d3.selectAll(".week_2").style("visibility", "hidden");  
  }
  filterVisible();
};

document.getElementById("myCheck3").onchange = function() {
  if (document.getElementById("myCheck3").checked === true) {
    d3.selectAll(".week_3").style("visibility", "visible");
  }
  else {
    d3.selectAll(".week_3").style("visibility", "hidden");  
  }
  filterVisible();
};
document.getElementById("myCheck4").onchange = function() {
  if (document.getElementById("myCheck4").checked === true) {
    d3.selectAll(".week_4").style("visibility", "visible");
  }
  else {
    d3.selectAll(".week_4").style("visibility", "hidden");   
  }
  filterVisible();
};
});

function mousedown() {
  var classText = this.className.animVal;
  var activity = getActivity(classText);

  var circles = document.getElementsByTagName("circle");
  for (var i = 0; i < circles.length; i++) 
  {
    var circle = circles[i];
    if (circle.style.visibility == "visible") 
    {
      //Every node here is visible
      var circleClassText = circle.className.animVal;
      var circleActivity = getActivity(circleClassText);
      if(activity == circleActivity)
      {
        //Circle should be visible
        //console.log("Circle " + (i+1) + "visible", circle);
      }
      else
      {
        circle.style.visibility = "hidden";
        //console.log("Circle " + (i+1) + "hidden", circle);
        changeArray.push(i);
      }
    }
  }
  filterVisible();
}

function mouseup() 
{
  var circles = document.getElementsByTagName("circle");
  for (var i =0; i < changeArray.length; i++)
  {
    var circleIndex = changeArray[i];
    var circle = circles[circleIndex];
    circle.style.visibility = "visible";
  }
  changeArray = [];
  filterVisible();
}

function check() {
    document.getElementById("myCheck1").checked = true;
    document.getElementById("myCheck2").checked = true;
    document.getElementById("myCheck3").checked = true;
    document.getElementById("myCheck4").checked = true;
    d3.selectAll("circle").style("visibility", "visible");
    filterVisible();
}

function uncheck() {
    document.getElementById("myCheck1").checked = false;
    document.getElementById("myCheck2").checked = false;
    document.getElementById("myCheck3").checked = false;
    document.getElementById("myCheck4").checked = false;
    d3.selectAll("circle").style("visibility", "hidden");
    filterVisible();
}

function filterVisible() {
  var a = 1;
  var b = 1;
  var c = 1;
  var d = 1;
  var e = 1;
  var f = 1;
  var j = 1;
  var a1 = document.getElementsByClassName("monday");
  var a2 = document.getElementsByClassName("tuesday");
  var a3 = document.getElementsByClassName("wednesday");
  var a4 = document.getElementsByClassName("thursday");
  var a5 = document.getElementsByClassName("friday");
  var a6 = document.getElementsByClassName("saturday");
  var a7 = document.getElementsByClassName("sunday");
  document.getElementById("monInput").innerHTML = 0;
  document.getElementById("tuesInput").innerHTML = 0;
  document.getElementById("wedInput").innerHTML = 0;
  document.getElementById("thursInput").innerHTML = 0;
  document.getElementById("friInput").innerHTML = 0;
  document.getElementById("satInput").innerHTML = 0;
  document.getElementById("sunInput").innerHTML = 0;
  for (var i = 0; i < a1.length; i++) 
    {
      var a1element = a1[i];
      if (a1element.style.visibility == "visible") 
      {
        document.getElementById("monInput").innerHTML = a++;
      }
      else
      {
      }
  }
  for (var i = 0; i < a2.length; i++) 
    {
      var a2element = a2[i];
      if (a2element.style.visibility == "visible") 
      {
        document.getElementById("tuesInput").innerHTML = b++;
      }
      else
      {
      }
  }
  for (var i = 0; i < a3.length; i++) 
    {
      var a3element = a3[i];
      if (a3element.style.visibility == "visible") 
      {
        document.getElementById("wedInput").innerHTML = c++;
      }
      else
      {
      }
  }
  for (var i = 0; i < a4.length; i++) 
    {
      var a4element = a4[i];
      if (a4element.style.visibility == "visible") 
      {
        document.getElementById("thursInput").innerHTML = d++;
      }
      else
      {
      }
  }
  for (var i = 0; i < a5.length; i++) 
    {
      var a5element = a5[i];
      if (a5element.style.visibility == "visible") 
      {
        document.getElementById("friInput").innerHTML = e++;
      }
      else
      {
      }
  }
  for (var i = 0; i < a6.length; i++) 
    {
      var a6element = a6[i];
      if (a6element.style.visibility == "visible") 
      {
        document.getElementById("satInput").innerHTML = f++;
      }
      else
      {
      }
  } 
  for (var i = 0; i < a7.length; i++) 
    {
      var a7element = a7[i];
      if (a7element.style.visibility == "visible") 
      {
        document.getElementById("sunInput").innerHTML = j++;
      }
      else
      {
      }
  }   
}