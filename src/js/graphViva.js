var vivaGraph,
    renderer,
    layou;

var colors = [
  0x1f77b4ff, 0xaec7e8ff,
  0xff7f0eff, 0xffbb78ff,
  0x2ca02cff, 0x98df8aff,
  0xd62728ff, 0xff9896ff,
  0x9467bdff, 0xc5b0d5ff,
  0x8c564bff, 0xc49c94ff,
  0xe377c2ff, 0xf7b6d2ff,
  0x7f7f7fff, 0xc7c7c7ff,
  0xbcbd22ff, 0xdbdb8dff,
  0x17becfff, 0x9edae5ff
];

viva.onclick = function() {
  //webGL based
  setElementVisible('containerGraph', 'svgGraph');

  //initGraph();
  //window.$GV.render();
  //renderGraphViva();
}

function renderGraphViva() {
  var vivaGraph = Viva.Graph.graph();
  
  var nodePositions = []
  for(node in node_keys) {
    vivaGraph.addNode(node);
    nodePositions.push({
        x: nodes_obj[node].getFeature('coords').x,
        y: nodes_obj[node].getFeature('coords').y,
        z: nodes_obj[node].getFeature('coords').z
      });
  }  
  
  for (var u_edge in und_edges) {
    edge = und_edges[u_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();
    /*graphics.link(function(link) {
      cur_color = window.rand_color ? getRandomHexColor() : edge_color;
      return Viva.Graph.View.webglLine(cur_color);
    });*/
    vivaGraph.addLink(node_a_id, node_b_id);
  }
  for (var d_edge in dir_edges) {
    edge = dir_edges[d_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();
    graphics.link(function(link) {
      cur_color = window.rand_color ? getRandomHexColor() : edge_color;
      return Viva.Graph.View.webglLine(cur_color);
    });
    vivaGraph.addLink(node_a_id, node_b_id);
  }


  var graphics = Viva.Graph.View.webglGraphics();
  graphics
   .node(function(node){
       return Viva.Graph.View.webglSquare(1 + Math.random() * 10, colors[(Math.random() * colors.length) << 0]);
   })
   .link(function(link) {
       return Viva.Graph.View.webglLine(colors[(Math.random() * colors.length) << 0]);
   });
  
  layout = Viva.Graph.Layout.constant(vivaGraph);  
  layout.placeNode(function(node) {
      return nodePositions[node.id];
  });
  
  renderer = Viva.Graph.View.renderer(vivaGraph, {
      graphics : graphics,
      container: document.querySelector('#containerGraph'),
      layout: layout,
      renderLinks : true
  });
  renderer.run();

  /*
  var nodesLeft = [];
   vivaGraph.forEachNode(function(node){
       nodesLeft.push(node.id);
   });
   var removeInterval = setInterval(function(){
        var nodesCount = nodesLeft.length;
        if (nodesCount > 0){
            var nodeToRemove = Math.min((Math.random() * nodesCount) << 0, nodesCount - 1);
            vivaGraph.removeNode(nodesLeft[nodeToRemove]);
            nodesLeft.splice(nodeToRemove, 1);
        }
        if (nodesCount === 0) {
            clearInterval(removeInterval);
            /*setTimeout(function(){
                beginAddNodesLoop(vivaGraph);
            }, 100);
        }
    }, 5);*/
}

/*renderer.on('nodeclick', function(node) {
      console.log('Clicked on ' + JSON.stringify(node));
    });*/

document.querySelector('.reset').onclick = function(event) {
  console.log("reset");
  renderer.reset()
}

document.querySelector('.zoomIn').onclick = function(event) {
  console.log("zoom in");
  renderer.zoomIn();
}

document.querySelector('.zoomOut').onclick = function(event) {
  console.log("zoom out");
  renderer.zoomOut();
}

function graphVivaMutilate() {
  console.log("mutii");

   
}
