// function render() {
//   var vivaGraph = require('ngraph.graph')(); //var vivaGraph = Viva.Graph.graph();
//
//   for(node in node_keys) {
//     var new_node = vivaGraph.addNode(node, {
//       x: nodes_obj[node].getFeature('coords').x,
//       y: nodes_obj[node].getFeature('coords').y,
//       z: nodes_obj[node].getFeature('coords').z
//     });
//     console.log(new_node);
//   }
//
//   for (var u_edge in und_edges) {
//     edge = und_edges[u_edge];
//     node_a_id = edge._node_a.getID();
//     node_b_id = edge._node_b.getID();
//     vivaGraph.addLink(node_a_id, node_b_id);
//   }
//   for (var d_edge in dir_edges) {
//     edge = dir_edges[d_edge];
//     node_a_id = edge._node_a.getID();
//     node_b_id = edge._node_b.getID();
//     vivaGraph.addLink(node_a_id, node_b_id);
//   }
//
//   var createLayout = require('pixel.layout');
//   var layout = createLayout(vivaGraph, {is3d: false});
//   vivaGraph.forEachNode( function(node) {
//     layout.setNodePosition(node.id, node.data.x, node.data.y, node.data.z);
//   });
//
//   vivaGraph.forEachNode( function(node) {
//     // console.log(layout.getNodePosition(node.id));
//   });
//
//   var pixel = require('ngraph.pixel');
//   var renderer = pixel(vivaGraph, {
//     node: createNodeUI,
//     link: createLinkUI,
//     stable: true,
//     graph: vivaGraph,
//     clearColor: 0x060910,//0xfdfdee,
//     layout: layout
//   });
//
//   vivaGraph.forEachNode( function(node){
//     layout.setNodePosition(node.id, node.data.x, node.data.y, node.data.z);
//   });
//
//   renderer.on('nodeclick', function(node) {
//     console.log('Clicked on ' + JSON.stringify(node));
//   });
//
//   renderer.on('nodedblclick', function(node) {
//     console.log('Double clicked on ' + JSON.stringify(node));
//   });
//
//   //renderer.on('nodehover', function(node) {
//     //console.log('Hover node ' + JSON.stringify(node));
//   //});
//
//   function createNodeUI(node) {
//     return {
//       color: 0xFF00FF,
//       size: 20
//     };
//   }
//
//   function createLinkUI(link) {
//     return {
//       fromColor: 0xFF00FF,
//       toColor: 0x00FFFF
//     };
//   }
//
// }

//
// function render() {
//   var vivaGraph = Viva.Graph.graph();
//
//   var nodePositions = []
//   for(node in node_keys) {
//     var new_node = vivaGraph.addNode(node, {
//       x: nodes_obj[node].getFeature('coords').x,
//       y: nodes_obj[node].getFeature('coords').y,
//       z: nodes_obj[node].getFeature('coords').z
//     });
//     // console.log(new_node);
//   }
//
//   for (var u_edge in und_edges) {
//     edge = und_edges[u_edge];
//     node_a_id = edge._node_a.getID();
//     node_b_id = edge._node_b.getID();
//     vivaGraph.addLink(node_a_id, node_b_id);
//   }
//   for (var d_edge in dir_edges) {
//     edge = dir_edges[d_edge];
//     node_a_id = edge._node_a.getID();
//     node_b_id = edge._node_b.getID();
//     vivaGraph.addLink(node_a_id, node_b_id);
//   }
//
//   window.layout = Viva.Graph.Layout.constant(vivaGraph);
//   // layout.placeNode(function(node) {
//   //     return nodePositions[node.id];
//   // });
//
//   window.graphics = Viva.Graph.View.webglGraphics();
//
//   // var nthree = require('ngraph.three');
//   window.renderer = Viva.Graph.View.renderer(vivaGraph, {
//     // interactive: true,
//     container: document.querySelector('#containerGraph'),
//     layout: layout,
//     graphics: graphics
//   });
//
//   // renderer.camera.position.z = 1000;
//
//   // var events = Viva.Graph.webglInputEvents(graphics, vivaGraph);
//   // events.mouseEnter(function (node) {
//   //     console.log('Mouse entered node: ' + node.id);
//   // }).mouseLeave(function (node) {
//   //     console.log('Mouse left node: ' + node.id);
//   // }).dblClick(function (node) {
//   //     console.log('Double click on node: ' + node.id);
//   // }).click(function (node) {
//   //     console.log('Single click on node: ' + node.id);
//   // });
//
//   renderer.run(); // begin animation loop
//
//   function createNodeUI(node) {
//     return {
//       color:0x1766b8,
//       size: 12
//     };
//   }
//
//   function createLinkUI(link) {
//     return {
//       fromColor: 0xFF00FF,
//       toColor: 0x00FFFF
//     };
//   }
//
//
//   // function movePointsRandomly() {
//   //   console.log("moving points randomly...");
//   //   vivaGraph.forEachNode(function(node) {
//   //     // console.log(node);
//   //     var x = (Math.random()*1200) | 0;
//   //     var y = (Math.random()*1000) | 0;
//   //     layout.setNodePosition(node.id, x, y);
//   //   });
//   //   renderer.rerender();
//   //   window.requestAnimationFrame(movePointsRandomly);
//   // }
//   //
//   // window.requestAnimationFrame(movePointsRandomly);
//
// }


//
//
// if (window !== 'undefined') {
//   // window.test = test;
//
//   window.$GV = {
//     render: render,
//     nav: {
//       zoomIn: null
//     }
//   }
// }
