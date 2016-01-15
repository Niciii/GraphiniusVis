//var cytoscape = require('../../lib/cytoscape.min.js');

cytoscape.onclick = function(e) {
  console.log("click cytoscape");
  
  //canvas based
  document.getElementById("svgGraph").style.display = "none";
  document.getElementById("canvasGraph").style.display = "initial";
  
  var cy = cytoscape({
  container: document.getElementById('svgGraph'), // container to render in
  
  elements: [ // list of graph elements to start with
    { // node a
      data: { id: 'a' }
    },
    { // node b
      data: { id: 'b' }
    },
    { // edge ab
      data: { id: 'ab', source: 'a', target: 'b' }
    }
  ],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }

});
}
