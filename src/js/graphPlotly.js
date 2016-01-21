plotly.onclick = function(e) {  
  //svg based
  setElementVisible('containerGraph', 'svgGraph');
  
  initGraph();
  renderGraphPlotly();
}

function renderGraphPlotly() {
  container = document.querySelector('.containerGraph');  
  var WIDTH = 1000;
  var HEIGHT = 400;

  var xNodes = [],
      yNodes = [];
      
  for( key in node_keys) {
    xNodes.push(nodes_obj[key].getFeature('coords').x);
    yNodes.push(nodes_obj[key].getFeature('coords').y);
  }
  
  var xEdges = [],
      yEdges = [];
  //undirected graph
  if(und_edges_keys.length > 0) {
    edgesArray = und_edges_keys;
  } else { //directed graph
    edgesArray = dir_edges_keys;
  }
  
  for(var i = 0; i < edgesArray.length; i++) {
    splitEdge = edgesArray[i].split("_");
    src = splitEdge[0];
    target = splitEdge[1];
       
    xEdges.push(nodes_obj[src].getFeature('coords').x);
    yEdges.push(nodes_obj[src].getFeature('coords').y);
    
    xEdges.push(nodes_obj[target].getFeature('coords').x);
    yEdges.push(nodes_obj[target].getFeature('coords').y);
    
    xEdges.push(null);
    yEdges.push(null);
  }
  
    var edges = {
    type: 'scatter',
    x: xEdges,
    y: yEdges,
    mode: 'lines',
    line: {
      width: 1,
      color: 'rgb(219, 64, 82)',
      opacity: 0.3
    }
  };
  
  var nodes = {
    type: 'scatter',
    x: xNodes,
    y: yNodes,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      color: 'rgb(219, 64, 82)',
      opacity: 0.8
      //size: 5
    }
  };

  var data = [nodes, edges];
  
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

function graphPlotlyMutilate() {
  console.log("plotly");
}
