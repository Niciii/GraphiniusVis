cyto.onclick = function(e) {
  console.log("click cytoscape");
  
  //canvas based
  document.getElementById("svgGraph").style.display = "none";
  //document.getElementById("containerGraph").style.display = "initial";
  
  initGraph();
  renderGraphCytoscape();
}

function renderGraphCytoscape() {
    var nodes = [],
      edges = [];
  
  for(key in node_keys){
    nodes.push({ 
      data: { id: key}, 
      renderedPosition: { 
        x: nodes_obj[key].getFeature('coords').x, 
        y: nodes_obj[key].getFeature('coords').y
      } 
    });
  }
  
  var edgesArray = [];
  //undirected graph
  if(und_edges_keys.length > 0) {
    edgesArray = und_edges_keys;
  } else { //directed graph
    edgesArray = dir_edges_keys;
  }
  
  for(var i = 0; i < edgesArray.length; i++) {
    splitEdge = edgesArray[i].split("_");    
    edges.push(
      { data: { id: edgesArray[i], source: splitEdge[0], target: splitEdge[1] } }
    );
  }
  
  var cy = cytoscape({
  container: document.getElementById('containerGraph'),
  elements:{
      nodes: nodes,
      edges:edges
  },
  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#14385c',
        'background-opacity': 0.5,
        'width': 8,
        'height': 8
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        //'target-arrow-shape': 'triangle' //for directed graph
      }
    }
  ],
  layout: {
    name: 'preset'
  }
  });
}
