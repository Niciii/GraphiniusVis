var network = require("../core/render.js").network;
var camera = require("../core/render.js").camera;
var update = require("../core/render.js").update;
var nodes_obj_idx = require("../core/render.js").nodes_obj_idx;
var edges_obj_idx = require("../core/render.js").edges_obj_idx;
var dims = require("../core/init.js").globals.graph_dims;
var mouse = require("../core/init.js").globals.mouse;
var defaults = require("../core/init.js").defaults;
var globals = require("../core/init.js").globals;

//update node and edge position
function updateNodePosition(update_node) {

  var node_id = update_node.getID();
  var index = nodes_obj_idx[node_id];

  //update nodes
  var old_nodes = network.children[0].geometry.getAttribute('position').array;
  old_nodes[index] = update_node.getFeature('coords').x;
  old_nodes[index + 1] = update_node.getFeature('coords').y;
  old_nodes[index + 2] = update_node.getFeature('coords').z;

  if(globals.TWO_D_MODE) {
    old_nodes[index + 2] = 0;
  }
  network.children[0].geometry.attributes.position.needsUpdate = true;

  //update edges  
  var undEdges = [ network.children[1].geometry.getAttribute('position').array, 
                    update_node.undEdges()];
  //TODO - directed
  var in_out_edges = {};
  for (var e in update_node.inEdges()) { in_out_edges[e] = update_node.inEdges()[e]; }
  for (var e in update_node.outEdges()) { in_out_edges[e] = update_node.outEdges()[e]; }
  //----
  var dirEdges = [ network.children[2].geometry.getAttribute('position').array,
                    in_out_edges];
  
  [undEdges, dirEdges].forEach(function(all_edges_of_a_node) {
    var old_edges = all_edges_of_a_node[0];
    var edges = all_edges_of_a_node[1];
    for(var i = 0; i < Object.keys(edges).length; i++) {
      var edge = edges[Object.keys(edges)[i]];

      //update from-node
      var edge_index = edges_obj_idx[edge.getID()];
      if(edge._node_a === update_node) {
        old_edges[edge_index] = update_node.getFeature('coords').x;
        old_edges[edge_index + 1] = update_node.getFeature('coords').y;
        old_edges[edge_index + 2] = update_node.getFeature('coords').z;
      }
      //update to-node
      else if(edge._node_b === update_node) {
        old_edges[edge_index + 3] = update_node.getFeature('coords').x;
        old_edges[edge_index + 4] = update_node.getFeature('coords').y;
        old_edges[edge_index + 5] = update_node.getFeature('coords').z;
      }
    }
  });
  
  network.children[1].geometry.attributes.position.needsUpdate = true;
  network.children[2].geometry.attributes.position.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function updateAll() {
  window.old_coordinates = new Float32Array(graph.nrNodes() * 3);
  var node_obj = graph.getNodes();
  var i = 0;
  for(node in nodes_obj) {
    old_coordinates[i] = node_obj[node].getFeature('coords').x;
    old_coordinates[i + 1] = node_obj[node].getFeature('coords').y;
    old_coordinates[i + 2] = node_obj[node].getFeature('coords').z;
    i += 3;
  }
  
  window.cnt = 0;
  requestAnimationFrame(updateRandomPostions);
}

function updateRandomPostions() {
  //update node
  var node_obj = graph.getNodes();
  var old_nodes = network.children[0].geometry.getAttribute('position').array;
  
  for(node in node_obj) {
    var index = nodes_obj_idx[node];
    node_obj[node].getFeature('coords').x = old_coordinates[index] + Math.random() * 20 - 10 - dims.AVG_X;
    node_obj[node].getFeature('coords').y = old_coordinates[index + 1] + Math.random() * 20 - 10 - dims.AVG_Y;
    node_obj[node].getFeature('coords').z = old_coordinates[index + 2] + Math.random() * 20 - 10 - dims.AVG_Z;

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

  if(window.cnt++ < 100) {
    requestAnimationFrame(updateRandomPostions);
  }
  //set nodes/edges to original coordinates
  else {
    //set coordinates of nodes
    var i = 0;
    for(node in node_obj) {
      var index = nodes_obj_idx[node];
      node_obj[node].getFeature('coords').x = window.old_coordinates[i];
      node_obj[node].getFeature('coords').y = window.old_coordinates[i + 1];
      node_obj[node].getFeature('coords').z = window.old_coordinates[i + 2];
      i += 3;

      old_nodes[index] = node_obj[node].getFeature('coords').x - dims.AVG_X;
      old_nodes[index + 1] = node_obj[node].getFeature('coords').y - dims.AVG_Y;
      old_nodes[index + 2] = node_obj[node].getFeature('coords').z - dims.AVG_Z;
    }
    //set coordinates of edges
    [undEdges, dirEdges].forEach(function(all_edges_of_a_node) {
      var i = 0;
      var old_edges = all_edges_of_a_node[0];
      var edges = all_edges_of_a_node[1];
      for (var edge_index in edges) {
        var edge = edges[edge_index];
        var node_a_id = edge._node_a.getID();
        var node_b_id = edge._node_b.getID();

        old_edges[i] = node_obj[node_a_id].getFeature('coords').x - dims.AVG_X;
        old_edges[i + 1] = node_obj[node_a_id].getFeature('coords').y - dims.AVG_Y;
        old_edges[i + 2] = node_obj[node_a_id].getFeature('coords').z - dims.AVG_Z;
        old_edges[i + 3] = node_obj[node_b_id].getFeature('coords').x - dims.AVG_X;
        old_edges[i + 4] = node_obj[node_b_id].getFeature('coords').y - dims.AVG_Y;
        old_edges[i + 5] = node_obj[node_b_id].getFeature('coords').z - dims.AVG_Z;
        i += 6;
      }
    });
    
    network.children[0].geometry.attributes.position.needsUpdate = true;
    network.children[1].geometry.attributes.position.needsUpdate = true;
    network.children[2].geometry.attributes.position.needsUpdate = true;
    window.requestAnimationFrame(update);
  }
}

function switchTo2D() {
  globals.TWO_D_MODE = true;
  var nodes_array = network.children[0].geometry.attributes.position.array,
      undEdges_array = network.children[1].geometry.attributes.position.array,
      dirEdges_array = network.children[2].geometry.attributes.position.array;
  
  [nodes_array, undEdges_array, dirEdges_array].forEach(function(array) {
    for(var i = 0; i < array.length;) {
      array[i + 2] = 0;
      i+=3;
    }
  });
  
  network.children[0].geometry.attributes.position.needsUpdate = true;
  network.children[1].geometry.attributes.position.needsUpdate = true;
  network.children[2].geometry.attributes.position.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function switchTo3D() {
  globals.TWO_D_MODE = false;

  var i = 0;
  var array = network.children[0].geometry.attributes.position.array;
  for(node in nodes_obj) {
    var z = nodes_obj[node].getFeature('coords').z;
    array[i + 2] = z;
    i+=3;
  }

  i = 0;
  array = network.children[1].geometry.attributes.position.array;
  for (var edge_index in und_edges) {
    var edge = und_edges[edge_index];
    var node_a_id = edge._node_a.getID();
    var node_b_id = edge._node_b.getID();

    array[i + 2] = nodes_obj[node_a_id].getFeature('coords').z;
    array[i + 5] = nodes_obj[node_b_id].getFeature('coords').z;
    i += 6;
  }

  i = 0;
  array = network.children[2].geometry.attributes.position.array;
  for (var edge_index in dir_edges) {
    var edge = dir_edges[edge_index];
    var node_a_id = edge._node_a.getID();
    var node_b_id = edge._node_b.getID();

    array[i + 2] = nodes_obj[node_a_id].getFeature('coords').z;
    array[i + 5] = nodes_obj[node_b_id].getFeature('coords').z;
    i += 6;
  }
  
  network.children[0].geometry.attributes.position.needsUpdate = true;
  network.children[1].geometry.attributes.position.needsUpdate = true;
  network.children[2].geometry.attributes.position.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function nodeIntersection() {
  var attributes = network.children[0].geometry.attributes;
  globals.raycaster.setFromCamera(mouse, camera);
  globals.raycaster.params.Points.threshold = 1;

  var particlesToIntersect = [];
  particlesToIntersect.push(network.children[0]);
  var intersects = globals.raycaster.intersectObjects(particlesToIntersect);

  if(intersects.length > 0 && intersects[0].index != globals.INTERSECTED.index) {
    //console.log("intersected objects");
    //console.log(intersectsParticles);

    //set previous node
    attributes.color.array[globals.INTERSECTED.index*3] = globals.INTERSECTED.color.r;
    attributes.color.array[globals.INTERSECTED.index*3 + 1] = globals.INTERSECTED.color.g;
    attributes.color.array[globals.INTERSECTED.index*3 + 2] = globals.INTERSECTED.color.b;
    
    globals.INTERSECTED.index = intersects[0].index;
    globals.INTERSECTED.color.setRGB(
      attributes.color.array[intersects[0].index*3], 
      attributes.color.array[intersects[0].index*3 + 1],
      attributes.color.array[intersects[0].index*3 + 2]
    );
    
    //set new node
    attributes.color.array[intersects[0].index*3] = defaults.highlight_node_color.r;
    attributes.color.array[intersects[0].index*3 + 1] = defaults.highlight_node_color.g;
    attributes.color.array[intersects[0].index*3 + 2] = defaults.highlight_node_color.b;
    attributes.color.needsUpdate = true;

    //TODO resize node
    //attributes.size.array[intersects[0].index] = 20;
    //attributes.size.needsUpdate = true;
    
    //get key by index
    var nodeID = Object.keys(nodes_obj_idx)[intersects[0].index];
    globals.INTERSECTED.node = window.graph.getNodeById(nodeID);
    
    //Hint: update is called in navigation
    //window.requestAnimationFrame(update);
  }
}

function updateNodePositionClick() {
  globals.selected_node._features.coords.x = Math.floor((Math.random() * dims.MAX_X) - dims.AVG_X);
  globals.selected_node._features.coords.y = Math.floor((Math.random() * dims.MAX_Y) - dims.AVG_Y);
  globals.selected_node._features.coords.z = Math.floor((Math.random() * dims.MAX_Z) - dims.AVG_Z);
  
  updateNodePosition(globals.selected_node);
}

function changeNodeSize(size) {
  if(!document.querySelector("#myonoffswitch").checked) {
    globals.rendererForceDirectedGraph.forEachNode(function (nodeUI) {
      nodeUI.size = size;
    });
  }
}

module.exports = {
    updateNodePosition: updateNodePosition,
    updateAll: updateAll,
    updateNodePositionClick: updateNodePositionClick,
    switchTo2D: switchTo2D,
    switchTo3D: switchTo3D,
    nodeIntersection: nodeIntersection,
    changeNodeSize: changeNodeSize
};
