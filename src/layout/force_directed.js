var defaults = require("../core/init.js").defaults;
var network = require("../core/render.js").network;
var update = require("../core/render.js").update;
var nodes_obj_idx = require("../core/render.js").nodes_obj_idx;
var dims = require("../core/init.js").globals.graph_dims;

var cnt = true;
function fdLoop() {
  if(cnt) {
    init();
  }
  if(!defaults.stop_fd) {
    forceDirectedLayout();
    window.requestAnimationFrame(fdLoop);
  }
  cnt = false;
}

var old_coordinates = null;
function init() {
  old_coordinates = new Float32Array(graph.nrNodes() * 3);
  var node_obj = graph.getNodes();
  var i = 0;
  for(node in nodes_obj) {
    old_coordinates[i] = node_obj[node].getFeature('coords').x;
    old_coordinates[i + 1] = node_obj[node].getFeature('coords').y;
    old_coordinates[i + 2] = node_obj[node].getFeature('coords').z;
    i += 3;
  }
}

function forceDirectedLayout() {
  console.log("hier");
  var time = new Date().getMilliseconds();
  //console.log(network);
  
  var node_obj = graph.getNodes();
  var old_nodes = network.children[0].geometry.getAttribute('position').array;
  
  for(node in node_obj) {
    var index = nodes_obj_idx[node];
    node_obj[node].getFeature('coords').x = old_coordinates[index] + time * Math.random() - dims.AVG_X;
    node_obj[node].getFeature('coords').y = old_coordinates[index + 1] + time * Math.random() - dims.AVG_Y;
    node_obj[node].getFeature('coords').z = old_coordinates[index + 2] + time * Math.random() - dims.AVG_Z;

    old_nodes[index] = node_obj[node].getFeature('coords').x;
    old_nodes[index + 1] = node_obj[node].getFeature('coords').y;
    old_nodes[index + 2] = node_obj[node].getFeature('coords').z;
  }
  
  var undEdges = [ network.children[1].geometry.getAttribute('position').array, 
                    graph.getUndEdges()];
  var dirEdges = [ network.children[2].geometry.getAttribute('position').array,
                    graph.getDirEdges()];
                    
  //update edges
  [undEdges, dirEdges].forEach(function(all_edges_of_a_node) {
    var i = 0;
    var old_edges = all_edges_of_a_node[0];
    var edges = all_edges_of_a_node[1];
    for (var edge_index in edges) {
      var edge = edges[edge_index];
      var node_a_id = edge._node_a.getID();
      var node_b_id = edge._node_b.getID();

      old_edges[i] = node_obj[node_a_id].getFeature('coords').x;
      old_edges[i + 1] = node_obj[node_a_id].getFeature('coords').y;
      old_edges[i + 2] = node_obj[node_a_id].getFeature('coords').z;
      old_edges[i + 3] = node_obj[node_b_id].getFeature('coords').x;
      old_edges[i + 4] = node_obj[node_b_id].getFeature('coords').y;
      old_edges[i + 5] = node_obj[node_b_id].getFeature('coords').z;
      i += 6;
    }
  });

  network.children[0].geometry.attributes.position.needsUpdate = true;
  network.children[1].geometry.attributes.position.needsUpdate = true;
  network.children[2].geometry.attributes.position.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function fdStop() {
  console.log("fds");
  defaults.stop_fd = true;
}

module.exports = {
  
  fdLoop: fdLoop,
  fdStop: fdStop
};
