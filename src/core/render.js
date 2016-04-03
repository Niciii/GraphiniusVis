var container = require("./init.js").container;
var globals = require("./init.js").globals;
var constant = require("../layout/constant_layout.js");
var controlUI = require("../view/controlUI.js");

function renderGraph() {  
  var graph = graph || window.graph;
  if(!graph) {
    throw new Error("No graph object present, unable to render anything.");
  }

  if(!window.nodes_obj || !window.node_keys) {
    window.nodes_obj = window.graph.getNodes();
    window.node_keys = Object.keys(window.nodes_obj);
    window.und_edges = window.graph.getUndEdges();
    window.und_edges_keys = Object.keys(window.und_edges);
    window.dir_edges = window.graph.getDirEdges();
    window.dir_edges_keys = Object.keys(window.dir_edges);
  }

  constant.renderGraph(graph);
  window.requestAnimationFrame(updateGraph);
  controlUI.setDirectionUnchecked();
  console.log("rendering graph...");
}

function updateGraph () {
  globals.renderer.render(globals.scene, globals.camera);
};

module.exports = {
    renderGraph: renderGraph,
    update: updateGraph
};
