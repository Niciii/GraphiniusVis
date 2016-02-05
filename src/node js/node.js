function render() {
  var vivaGraph = require('ngraph.graph')(); //var vivaGraph = Viva.Graph.graph();
  
  //vivaGraph.addNode(5, {x: 2, y: 4});
  //vivaGraph.addNode(2, {x: 10, y: 6});
  //vivaGraph.addNode(4, {x: 5, y: 1});  
  //vivaGraph.addLink(4, 2);

  for(node in node_keys) {
    vivaGraph.addNode(node, {
      x: nodes_obj[node].getFeature('coords').x,
      y: nodes_obj[node].getFeature('coords').y,
      z: nodes_obj[node].getFeature('coords').z
    });
  }  

  vivaGraph.forEachNode( function(node){
    console.log(node);
    
  });

  for (var u_edge in und_edges) {
    edge = und_edges[u_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();
    vivaGraph.addLink(node_a_id, node_b_id);
  }
  for (var d_edge in dir_edges) {
    edge = dir_edges[d_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();
    vivaGraph.addLink(node_a_id, node_b_id);
  }
  
  var createLayout = require('pixel.layout');  
  var layout = createLayout(vivaGraph, {is3d: false});
  vivaGraph.forEachNode( function(node) {
    layout.setNodePosition(node.id, node.data.x, node.data.y, node.data.z);
  });
  
  vivaGraph.forEachNode( function(node) {
    console.log(layout.getNodePosition(node.id));
  });

  var pixel = require('ngraph.pixel');  
  var renderer = pixel(vivaGraph, {
    node: createNodeUI,
    link: createLinkUI,
    stable: true,
    graph: vivaGraph,
    clearColor: 0x060910,//0xfdfdee,
    layout: layout
  });

  vivaGraph.forEachNode( function(node){
    layout.setNodePosition(node.id, node.data.x, node.data.y, node.data.z);    
  });

  renderer.on('nodeclick', function(node) {
  console.log('Clicked on ' + JSON.stringify(node));
  });

  renderer.on('nodedblclick', function(node) {
    console.log('Double clicked on ' + JSON.stringify(node));
  });
  
  //renderer.forEachNode(function(node) {
    //console.log(node);
  //});

  //renderer.on('nodehover', function(node) {
    //console.log('Hover node ' + JSON.stringify(node));
  //});
  
  function createNodeUI(node) {
    return {
      color: 0xFF00FF,
      size: 20
    };
  }
  
  function createLinkUI(link) {
    return {
      fromColor: 0xFF00FF,
      toColor: 0x00FFFF
    };
  }

}

/*function render() {
  var vivaGraph = require('ngraph.graph')();//Viva.Graph.graph();
  
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
    vivaGraph.addLink(node_a_id, node_b_id);
  }
  for (var d_edge in dir_edges) {
    edge = dir_edges[d_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();
    vivaGraph.addLink(node_a_id, node_b_id);
  }

  //var createLayout = require('pixel.layout');  
  //var settings = {
    //springLength : 0,
    //springCoeff : 0.0000,
    //dragCoeff : 0.00,
    //gravity : 0
  //}
  //var layout = createLayout(vivaGraph);
  
  var layout = Viva.Graph.Layout.constant(vivaGraph);  
  layout.placeNode(function(node) {
      return nodePositions[node.id];
  });
  
  var graphics = Viva.Graph.View.webglGraphics();
  
  var nthree = require('ngraph.three');
  var renderer = nthree(vivaGraph, {
    interactive: true,
    container: document.querySelector('#containerGraph'),
    layout: layout,
    graphics: graphics
  }); 
  
  renderer.camera.position.z = 1000;
  
  var events = Viva.Graph.webglInputEvents(graphics, vivaGraph);
  events.mouseEnter(function (node) {
      console.log('Mouse entered node: ' + node.id);
  }).mouseLeave(function (node) {
      console.log('Mouse left node: ' + node.id);
  }).dblClick(function (node) {
      console.log('Double click on node: ' + node.id);
  }).click(function (node) {
      console.log('Single click on node: ' + node.id);
  });

  renderer.run(); // begin animation loop

  function createNodeUI(node) {
    return {
      color:0x1766b8,
      size: 12
    };
  }

  function createLinkUI(link) {
    return {
      fromColor: 0xFF00FF,
      toColor: 0x00FFFF
    };
  }
}*/

if (window !== 'undefined') {
  // window.test = test;
  
  window.$GV = {
    render: render,
    nav: {
      zoomIn: null
    }
  }
}
