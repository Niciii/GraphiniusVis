//
// function render() {
//   window.nGraph = require('ngraph.graph')();
//
//
//   for(node in node_keys) {
//     var new_node = nGraph.addNode(node, {
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
//     nGraph.addLink(node_a_id, node_b_id);
//   }
//   for (var d_edge in dir_edges) {
//     edge = dir_edges[d_edge];
//     node_a_id = edge._node_a.getID();
//     node_b_id = edge._node_b.getID();
//     nGraph.addLink(node_a_id, node_b_id);
//   }
//
//   var createLayout = require('pixel.layout');
//   window.layout = createLayout(nGraph, {
//     is3d: true,
//     pinNode: true,
//     physics: {
//       springLength: 0,
//       springCoeff: 0,
//       dragCoeff: 0,
//       gravity: 0,
//       theta: 0,
//       timeStep: 1
//     }
//   });
//
//   console.log("Simulator: " + layout.simulator);
//
//   window.ng_pixel = require('ngraph.pixel');
//   window.renderer = ng_pixel(nGraph, {
//     container: document.querySelector('#containerGraph'),
//     layout: layout,
//     node: createNodeUI,
//     link: createLinkUI,
//     prerender: 1200
//     // graphics: graphics
//   });
//
//   nGraph.forEachNode(function(node) {
//     renderer.getNode(node.id).position.x = nodes_obj[node.id].getFeature('coords').x;
//     renderer.getNode(node.id).position.y = nodes_obj[node.id].getFeature('coords').y;
//     renderer.getNode(node.id).position.z = nodes_obj[node.id].getFeature('coords').z;
//
//     layout.setNodePosition(node.id, node.data.x, node.data.y, node.data.z);
//     layout.pinNode(node.id, true);
//   });
//
//   // renderer.camera.position.z = 1000;
//   //
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
//   // renderer.run(); // begin animation loop
//
//   function createNodeUI(node) {
//     return {
//       color:0x538eff,
//       size: 24
//     };
//   }
//
//   function createLinkUI(link) {
//     return {
//       fromColor: 0x81cf28,
//       toColor: 0x81cf28
//     };
//   }
// }
//
// window.nr_nodes = 50;
//
// window.removeNodes = function() {
//   var count = nGraph.getNodesCount();
//   // assume nodes are named 0..count-1
//   var node;
//   if ( nr_nodes ) {
//     var idx = (Math.random()*count)|0;
//     if ( node = nGraph.getNode(idx) ) {
//       nGraph.removeNode(idx);
//       nr_nodes--;
//     }
//     requestAnimationFrame(removeNodes);
//   }
// }
//
// if (window !== 'undefined') {
//   // window.test = test;
//
//   window.$GV = {
//     render: render
//   }
// }
