
var INIT = require("../core/init.js");
var defaults = INIT.defaults;
var globals = INIT.globals;
var network = globals.network;
var dims = globals.graph_dims;
var force = INIT.force_layout;
var update = require("../core/render.js").update;
var nodes_obj_idx = require("./constant_layout.js").nodes_obj_idx;

var now = null,
    init_coords = true,
    old_coordinates = null;

function fdLoop() {
  if(init_coords) {
    init();
  }
  if(!defaults.stop_fd) {    
    forceDirectedLayout();
    window.requestAnimationFrame(fdLoop);
  }
  else {
    init_coords = true;
  }
}

function init() {
  now = +new Date;
  old_coordinates = new Float32Array(graph.nrNodes() * 3);
  var node_obj = graph.getNodes(),
      i = 0;
  for(node in nodes_obj) {
    old_coordinates[i] = node_obj[node].getFeature('coords').x - dims.AVG_X;
    old_coordinates[i + 1] = node_obj[node].getFeature('coords').y - dims.AVG_Y;
    old_coordinates[i + 2] = node_obj[node].getFeature('coords').z - dims.AVG_Z;
    i += 3;
  }
  init_coords = false;
  defaults.stop_fd = false;
}

function forceDirectedLayout() {
  var time = (+new Date) - now,
      node_obj = graph.getNodes(),
      old_nodes = network.children[0].geometry.getAttribute('position').array;

  for(node in node_obj) {
    var index = nodes_obj_idx[node];
    node_obj[node].getFeature('coords').x = old_coordinates[index] + Math.sin(time/500)*150;
    node_obj[node].getFeature('coords').y = old_coordinates[index + 1] + Math.sin(time/500)*150;
    node_obj[node].getFeature('coords').z = old_coordinates[index + 2] + Math.sin(time/500)*150;

    old_nodes[index] = node_obj[node].getFeature('coords').x;
    old_nodes[index + 1] = node_obj[node].getFeature('coords').y;
    if ( globals.TWO_D_MODE ) {
      old_nodes[index + 2] = 0;
    } else {
      old_nodes[index + 2] = node_obj[node].getFeature('coords').z;
    }
  }

  var undEdges = [ network.children[1].geometry.getAttribute('position').array,
                    graph.getUndEdges()],
      dirEdges = [ network.children[2].geometry.getAttribute('position').array,
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
      old_edges[i + 3] = node_obj[node_b_id].getFeature('coords').x;
      old_edges[i + 4] = node_obj[node_b_id].getFeature('coords').y;

      if ( globals.TWO_D_MODE ) {
        old_edges[i + 2] = 0;
        old_edges[i + 5] = 0;
      } else {
        old_edges[i + 2] = node_obj[node_a_id].getFeature('coords').z;
        old_edges[i + 5] = node_obj[node_b_id].getFeature('coords').z;
      }
      i += 6;
    }
  });

  network.children[0].geometry.attributes.position.needsUpdate = true;
  network.children[1].geometry.attributes.position.needsUpdate = true;
  network.children[2].geometry.attributes.position.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function fdStop() {
  defaults.stop_fd = true;
}

//export
force.fdLoop = fdLoop;
force.fdStop = fdStop;
