sigmaJS.onclick = function() {
  console.log("click sigma");
  
  //canvas based
  //document.getElementById("containerGraph").style.display = "initial";
  document.getElementById("svgGraph").style.display = "none";
        
  initGraph();
  renderGraphSigma();
}

function renderGraphSigma() {
  var i,
  N = 100,
  E = 200,
  s = new sigma();

  for(key in node_keys)
    s.graph.addNode({
      id: 'n' + key,
      //label: 'Node ' + key,
      x: nodes_obj[key].getFeature('coords').x,
      y: nodes_obj[key].getFeature('coords').y,
      size: 0.08
    });
  
    var edgesArray = [];
    //undirected graph
    if(und_edges_keys.length > 0) {
      edgesArray = und_edges_keys;
    } else { //directed graph
      edgesArray = dir_edges_keys;
    }
    
    for(var i = 0; i < edgesArray.length; i++) {
      splitEdge = edgesArray[i].split("_");
      s.graph.addEdge({
        id: 'e' + i,
        source: 'n' + splitEdge[0],
        target: 'n' + splitEdge[1],
        size: 1
      });
    }
        
    // Initialize two distinct renderers, each with its own settings:
    s.addRenderer({
      container: document.getElementById('containerGraph'),
      type: 'svg',
      settings: {
        hideEdgesOnMove: true,
        defaultLabelColor: '#fff',
        defaultNodeColor: '#999',
        defaultEdgeColor: '#333',
        edgeColor: 'default'
      }
    });
    s.refresh();
}
