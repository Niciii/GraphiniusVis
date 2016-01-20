plotly.onclick = function(e) {
  console.log("click plotly");
  
  //svg based
  document.getElementById("containerGraph").style.display = "initial";
  document.getElementById("svgGraph").style.display = "none";
  
  initGraph();
  renderGraphPlotly();
}

function renderGraphPlotly() {
  container = document.getElementById('containerGraph');  
  var WIDTH = 1000;
  var HEIGHT = 400;

  var xCoordinates = [],
      yCoordinates = [];
      
  for( key in node_keys) {
    xCoordinates.push(nodes_obj[key].getFeature('coords').x);
    yCoordinates.push(nodes_obj[key].getFeature('coords').y);
  }

  //plot only nodes
  /*var trace1 = {
    type: 'scatter',
    x: xCoordinates,
    y: yCoordinates,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      //size: 5
    }
  };*/
  
  var trace1 = {
    type: 'scatter',
    x: xCoordinates,
    y: yCoordinates,
    mode: 'lines+markers',
    marker: {
      symbol: 'circle',
      //size: 5
    }
  };

  var data = [trace1];
  
  var layout = {
    showlegend: false,
    height: HEIGHT,
    width: WIDTH,
    xaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      autorange: true
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      autorange: true
    }
  };

  Plotly.newPlot(container, data, layout);
}
