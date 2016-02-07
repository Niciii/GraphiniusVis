function render() {
  window.nGraph = require('ngraph.graph')();
  window.layout = require('pixel.static');


  for(node in node_keys) {
    var new_node = nGraph.addNode(node, {
      x: nodes_obj[node].getFeature('coords').x,
      y: nodes_obj[node].getFeature('coords').y,
      z: nodes_obj[node].getFeature('coords').z
    });
    // console.log(new_node);
  }

  for (var u_edge in und_edges) {
    edge = und_edges[u_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();
    nGraph.addLink(node_a_id, node_b_id);
  }
  for (var d_edge in dir_edges) {
    edge = dir_edges[d_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();
    nGraph.addLink(node_a_id, node_b_id);
  }

  // does not exist on static layout (of course)
  // console.log("Simulator: " + layout.simulator);

  window.renderer = require('ngraph.pixel')(nGraph, {
    container: document.querySelector('#containerGraph'),
    createLayout: layout,
    initPosition: getNodePosition,
    node: createNodeUI,
    link: createLinkUI
  });

  function getNodePosition(node) {
    // node is a regular ngraph.graph node
    // we can have access to its `data` or `id`, so if position is known:
    return {
      x: node.data.x,
      y: node.data.y,
      z: node.data.z
    };
  }

  function createNodeUI(node) {
    return {
      color:0x538eff,
      size: 6
    };
  }

  function createLinkUI(link) {
    return {
      fromColor: 0x81cf28,
      toColor: 0x81cf28
    };
  }
}

// TODO doesn't work with renderer / animationFrame / whatever... freezes..
// However: it did work using the force directed layout...
var mut_count = 50;
function mutilateNGraph() {
  var nr_nodes = nGraph.getNodesCount(),
      count = mut_count;

  if ( nr_nodes ) {
    while (count-- && nr_nodes--) {
      // Graphinius
      // key = node_keys[nr_nodes];
      // graph.deleteNode(graph.getNodeById(key));

      // update UI
      document.querySelector('#graphInfo #nodes').innerHTML = nGraph.getNodesCount();
      document.querySelector('#graphInfo #edges').innerHTML = nGraph.getLinksCount();

      nGraph.removeNode(nr_nodes);

    }
    console.log("Nodes remaining: " + nr_nodes);

    requestAnimationFrame(mutilateNGraph);
  }
}


if (window !== 'undefined') {
  // window.test = test;

  window.$GV = {
    render: render,
    mut_count: mut_count,
    mutilateGraph: mutilateNGraph
  }
}
