function initGraph() {
  if ( !window.nodes_obj || !window.node_keys ) {
    window.nodes_obj = window.graph.getNodes();
    window.node_keys = Object.keys(window.nodes_obj);
    window.und_edges = window.graph.getUndEdges();
    window.und_edges_keys = Object.keys(window.und_edges);
    window.dir_edges = window.graph.getDirEdges();
    window.dir_edges_keys = Object.keys(window.dir_edges);
  }
}

//function setElementVisible(showElement, hideElement) {
  //document.querySelector('.' + hideElement).style.display = "none";
  //document.querySelector('.' + showElement).style.display = "block";
  //document.querySelector('.' + showElement).innerHTML = "";
//}
